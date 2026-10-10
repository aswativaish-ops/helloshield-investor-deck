const test = require('node:test');
const assert = require('node:assert/strict');
const {calculate} = require('./financial-model.js');
const close = (actual, expected) => assert.ok(Math.abs(actual-expected)<0.01,`${actual} != ${expected}`);
test('two plans, weighted revenue, and market arithmetic use the same prices',()=>{
  const m=calculate();close(m.price,6.19);close(m.cost,3.985);close(m.contribution,2.205);
  close(m.tamUsers,64917580);close(m.samUsers,16229395);
  close(m.tamValue,4822077842.4);close(m.samValue,1205519460.6);
  close(m.months[35].runRate,1114200);
  close(calculate({plusShare:0}).price,4.99);
  close(calculate({plusShare:1}).price,8.99);
});
test('monthly bridge includes replacements, trials, all costs, and zero initial sales',()=>{
  const m=calculate();assert.equal(m.months.length,60);
  assert.equal(m.months[0].revenue,0);assert.equal(m.months[1].revenue,0);
  let previous=0,cash=1500000;
  for(const row of m.months){
    close(previous-row.cancellations+row.additions,row.users);
    close(row.trials*.25,row.additions);
    close(row.acquisition,row.additions*20);
    close(row.expenses,55000+row.serviceCost+row.acquisition);
    close(row.profit,row.revenue-row.expenses);
    cash+=row.profit;close(row.cash,cash);previous=row.users;
  }
});
test('profit date and cash need cannot be confused with investor repayment',()=>{
  const m=calculate();assert.equal(m.firstProfitMonth,60);assert.equal(m.firstProfitUsers,50000);
  assert.ok(m.months[58].profit<0);assert.ok(m.months[59].profit>0);
  close(m.months[59].profit,738.9325);
  assert.equal(m.cashRunsOutMonth,27);
  close(m.additionalFunding,1394506.4325);
  assert.ok(Math.min(...m.months.map(row=>row.cash))+1500000>=240000);
  assert.ok(m.months.slice(48).reduce((sum,row)=>sum+row.profit,0)<0,'Year 5 as a whole is still loss-making');
  assert.ok(m.months[59].cash<0,'Accumulated losses remain despite monthly profit');
});
test('higher usage and acquisition costs delay or prevent the modeled profit',()=>{
  assert.equal(calculate({personalCost:4.25,plusCost:6.70}).firstProfitMonth,null);
  assert.equal(calculate({acquisitionCost:40}).firstProfitMonth,null);
  assert.ok(calculate({plusShare:0.5}).firstProfitMonth<60);
});
