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
  return {calculate,assumptions,anchors};
})();
if (typeof module !== 'undefined') module.exports = financialModel;
