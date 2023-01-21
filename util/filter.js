function ruleMatcher(data, filter) {
  for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
          const element = filter[key];
          var val = parseFloat(data[key]);
          if (element.includes("&&")) {
              let range = element.split("&&");
              let min = range[0].slice(1);
              let max = range[1].slice(1);
              if (val < min || val > max) {
                  return false;
              }
          } else if (element.includes(">")) {
              let value = element.slice(1);
              if (val < value) {
                  return false;
              }
          } else if (element.includes("<")) {
              let value = element.slice(1);
              if (val > value) {
                  return false;
              }
          } else if (val != element) {
              return false;
          }
      }
  }
  return true;
}

function getMetrics(data){
    let metrics = {};
    let over = data['analytics']["overallAnalysis"]
    let loan = data['analytics']["loanCreditsAnalysis"]["overallLoanCreditAnalysis"]
    metrics["avgEodBalance"]=over['avgEodBalance']
    for( var key in loan){
        if(loan.hasOwnProperty(key)){
            metrics[key]=loan[key]
        }
    }
    return metrics;
}
module.exports = {getMetrics}
// data ={ "name":"Krishnan",age:46,salary:"5000"}
// filter1 ={ age: ">36&&<45"}
// filter2={salary:"<200000"}

// console.log(func(data,filter1))
// console.log(func(data,filter2))