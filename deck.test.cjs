const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function deck(){
  const els=new Map();
  const element=()=>({innerHTML:'',textContent:'',open:false,classList:{toggle(){}},setAttribute(){},append(){},querySelector(){return element()},addEventListener(){},showModal(){this.open=true},close(){this.open=false}});
  const context=vm.createContext({financialModel:require('./financial-model'),document:{getElementById(id){if(!els.has(id))els.set(id,element());return els.get(id)},querySelector:element,querySelectorAll(){return[]},addEventListener(){},createElement:element},window:{addEventListener(){}},history:{replaceState(){}},location:{hash:''},sessionStorage:{getItem(){return null},setItem(){}},setTimeout(){},clearTimeout(){}});
  vm.runInContext(fs.readFileSync('deck.js','utf8'),context);
  return {els,read:code=>vm.runInContext(code,context)};
}
test('all slides render, all three plans print, and founder/patent copy is present',()=>{
  const {els,read}=deck();
  for(let i=0;i<11;i++)assert.doesNotMatch(read(`slideHTML(${i})`),/undefined|NaN|To size|To test|Start small|Swati Vaish|\$9\.99/);
  for(const i of [8,10]){const html=read(`slideHTML(${i})`);assert.match(html,/Abhishek Kaushal/);assert.match(html,/Patent application filed/);assert.match(html,/T-Mobile/)}
  const before=read('JSON.stringify(state)');read('buildPrintRoot()');assert.equal(read('JSON.stringify(state)'),before);
  const html=els.get('print-root').innerHTML;assert.equal((html.match(/class="print-slide"/g)||[]).length,11);
  for(const phrase of ['$4.99','$8.99','$4.82B','$1.21B','$1.11M','$79','month 55','50,000'])assert.ok(html.includes(phrase),phrase);
});
test('study and every new evidence dialog open with no stale figures',()=>{
  const {els,read}=deck();
  for(const action of ['market-math','financials','growth-plan','competitor-study','valuation']){
    read(`act('${action}')`);const html=els.get('detail-body').innerHTML;
    assert.ok(els.get('detail').open);assert.match(html,/<h2>/);assert.doesNotMatch(html,/undefined|NaN|\$9\.99|23,412/);
  }
  read("act('competitor-study')");for(const name of ['Apple','Google','Wajo','Poka','Truecaller','Hiya'])assert.ok(els.get('detail-body').innerHTML.includes(name));
  read("act('financials')");assert.ok(els.get('detail-body').innerHTML.includes('$58,316'));
});
