/* Planning assumptions, not measured demand or a promise of returns. */
const financialModel = (() => {
  const assumptions = {
    personalPrice: 4.99, plusPrice: 8.99, plusShare: 0.30,
    personalCost: 3.25, plusCost: 5.70,
    monthlyCancellationRate: 0.02, trialConversion: 0.25,
    acquisitionCost: 20, fixedMonthlyCost: 55000,
    initialFunding: 1500000, followOnFunding: 1500000, reserve: 240000,
    professionalWorkers: 71338000, smartphoneShare: 0.91,
    iphoneShare: 0.50, serviceableShare: 0.50
  };
  const anchors = [[0,0],[2,0],[6,100],[12,1000],[18,2500],[24,5000],[36,15000],[48,30000],[60,50000]];
  function calculate(overrides = {}) {
    const a = { ...assumptions, ...overrides };
    const price = a.personalPrice * (1-a.plusShare) + a.plusPrice * a.plusShare;
    const cost = a.personalCost * (1-a.plusShare) + a.plusCost * a.plusShare;
    const contribution = price-cost;
    let previous = 0, cash = a.initialFunding;
    const months = [];
    for (let month=1; month<=60; month++) {
      const index = anchors.findIndex(([m]) => m >= month);
      const [startMonth,startUsers] = anchors[index-1];
      const [endMonth,endUsers] = anchors[index];
      const users = Math.round(startUsers+(endUsers-startUsers)*(month-startMonth)/(endMonth-startMonth));
      const cancellations = previous*a.monthlyCancellationRate;
      const additions = users-previous+cancellations;
      const trials = additions/a.trialConversion;
      // Average active users avoids billing a full month for all month-end additions.
      const averageUsers = (previous+users)/2;
      const revenue = averageUsers*price;
      const serviceCost = averageUsers*cost;
      // $20 includes channel spend and free-trial delivery; do not add trial costs twice.
      const acquisition = additions*a.acquisitionCost;
      const expenses = a.fixedMonthlyCost+serviceCost+acquisition;
      const profit = revenue-expenses;
      cash += profit;
      months.push({month,users,averageUsers,cancellations,additions,trials,revenue,serviceCost,acquisition,expenses,profit,cash,runRate:users*price*12});
      previous = users;
    }
    const tamUsers = a.professionalWorkers*a.smartphoneShare;
    const samUsers = tamUsers*a.iphoneShare*a.serviceableShare;
    const firstProfit = months.find(m=>m.profit>=0);
    const minCash = Math.min(...months.map(m=>m.cash));
    return {assumptions:a,price,cost,contribution,months,tamUsers,samUsers,
      tamValue:tamUsers*price*12,samValue:samUsers*price*12,
      firstProfitMonth:firstProfit?.month ?? null,
      firstProfitUsers:firstProfit?.users ?? null,
      cashRunsOutMonth:months.find(m=>m.cash<0)?.month ?? null,
      additionalFunding:Math.max(0,a.reserve-minCash),
      replacementBreakEven:Math.ceil(a.fixedMonthlyCost/(contribution-a.monthlyCancellationRate*a.acquisitionCost))};
  }
  const businessAssumptions = {
    businessPrice:79, businessMinutes:200, extraMinutePrice:0.30,
    businessCost:36, businessCancellationRate:0.01,
    businessAcquisitionCost:250, businessTrialConversion:0.20,
    businessBuildCost:75000, followOnFunding:2000000
  };
  const businessAnchors = [[0,0],[6,0],[12,100],[18,250],[24,500],[36,1500],[48,3000],[60,5000]];
  function calculateCombined(overrides = {}) {
    const personal = calculate(overrides);
    const a = {...personal.assumptions,...businessAssumptions,...overrides};
    let previous=0, cash=a.initialFunding;
    const months=personal.months.map(row=>{
      const i=businessAnchors.findIndex(([m])=>m>=row.month);
      const [sm,su]=businessAnchors[i-1], [em,eu]=businessAnchors[i];
      const businesses=Math.round(su+(eu-su)*(row.month-sm)/(em-sm));
      const businessCancellations=previous*a.businessCancellationRate;
      const businessAdditions=businesses-previous+businessCancellations;
      const averageBusinesses=(previous+businesses)/2;
      const businessRevenue=averageBusinesses*a.businessPrice;
      const businessServiceCost=averageBusinesses*a.businessCost;
      const businessAcquisition=businessAdditions*a.businessAcquisitionCost;
      // Extra staffing/operations grow with the two-segment business; not a flat-cost forecast.
      const extraFixed=row.month<=6?0:row.month<=24?15000:row.month<=36?35000:row.month<=48?65000:100000;
      const fixedCost=a.fixedMonthlyCost+extraFixed;
      const buildCost=row.month===3?a.businessBuildCost:0;
      const revenue=row.revenue+businessRevenue;
      const serviceCost=row.serviceCost+businessServiceCost;
      const acquisition=row.acquisition+businessAcquisition;
      const expenses=serviceCost+acquisition+fixedCost+buildCost;
      const profit=revenue-expenses;
      cash+=profit;previous=businesses;
      return {...row,personalRevenue:row.revenue,businesses,averageBusinesses,
        businessCancellations,businessAdditions,businessTrials:businessAdditions/a.businessTrialConversion,
        businessRevenue,businessServiceCost,businessAcquisition,fixedCost,buildCost,
        revenue,serviceCost,acquisition,expenses,profit,cash,
        margin:revenue?profit/revenue:null,grossMargin:revenue?(revenue-serviceCost)/revenue:null,
        runRate:row.runRate+businesses*a.businessPrice*12};
    });
    const first=months.find(r=>r.profit>=0);
    const sustained=months.find((r,i)=>r.profit>=0&&months.slice(i).every(n=>n.profit>=0));
    const annual=Array.from({length:5},(_,i)=>{
      const period=months.slice(i*12,(i+1)*12);
      const revenue=period.reduce((s,r)=>s+r.revenue,0);
      const profit=period.reduce((s,r)=>s+r.profit,0);
      return {year:i+1,revenue,profit,margin:profit/revenue,users:period[11].users,businesses:period[11].businesses};
    });
    return {personal,assumptions:a,months,annual,
      firstProfitMonth:first?.month??null,sustainedProfitMonth:sustained?.month??null,
      firstProfitableYear:annual.find(r=>r.profit>=0)?.year??null,
      cashRunsOutMonth:months.find(r=>r.cash<0)?.month??null,
      additionalFunding:Math.max(0,a.reserve-Math.min(...months.map(r=>r.cash))),
      cumulativeProfit:months.reduce((s,r)=>s+r.profit,0),
      businessGrossMargin:(a.businessPrice-a.businessCost)/a.businessPrice};
  }
  return {calculate,calculateCombined,assumptions,anchors,businessAssumptions,businessAnchors};
})();
if (typeof module !== 'undefined') module.exports = financialModel;
