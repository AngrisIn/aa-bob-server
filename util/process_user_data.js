const processUserDataFI = (type,data) => {
  var processedData=null
  var reply ={}
  if(type=="equities"){
    let index=0;
    for(index=0;index<data.length;index++){
      if(data[index]&&data[index]["Account"]){
        if(data[index]["Account"]["type"]=="equities"){
          console.log("Found equities",index)
          break;
        }
      }
    }
    var summary = data[index]['Account']['Summary']['Investment']
    var alldetails = data[index]['Account']['Transactions']['Transaction']
      summary.forEach(function(i,index){
        // i.forEach(function(j,index){
          var raw  = i["Holdings"]
          raw.forEach(function(k,index){
            var d=k["Holding"]['investmentDateTime'].split("T")
            if(processedData==null)processedData=[]
            processedData.push({
              "type": k["Type"],
              "issuerName": k['Holding']["issuerName"],
              "units": k['Holding']["units"],
              "rate": k['Holding']["rate"],
              "lastTradedPrice": k['Holding']["lastTradedPrice"],
              "dateOfInvestment": d[0],
              "timeOfInvestment": d[1],
            })
          })
      //  })
      })
      if(processedData)
        processedData.reverse()
      reply['summary'] = processedData;
      processedData=null
      alldetails.forEach(function(i,index){
        var d=i['transactionDateTime'].split("T")
        if(processedData==null)processedData=[]
        processedData.push({
          "symbol": i["symbol"],
          "exchange": i["exchange"],
          "dateOfTransaction": d[0],
          "timeOfTransaction": d[1],
          "equityCategory": i['equityCategory'],
          "rate": i['rate'],
          "tradeValue": i['tradeValue'],
          "type": i['type'],
          "units": i['units'],
        })
      })
      if(processedData)
        processedData.reverse()
      reply['all'] = processedData;
      return reply;
   }
  else if(type=="mutualfund"){
    let index=0;
    for(index=0;index<data.length;index++){
      if(data[index]&&data[index]["Account"]){
        if(data[index]["Account"]["type"]=="mutualfunds"){
          console.log("Found mutualfunds",index)
          break;
        }
      }
    }
    var all = data[index]['Account']['Transactions']['Transaction']
      all.forEach(function(i,index){
        // i.forEach(function(j,index){
            if(processedData==null)processedData=[]
            processedData.push({
              "amc":i["amc"] ,
              "fundType":i["fundType"] ,
              "amount":i["amount"] ,
              "closingUnits":i["closingUnits"],
              "navDate":i["navDate"],
              "type":i["type"] 
            })
      })
      if(processedData)
        processedData.reverse()
      reply['all'] = processedData;
      return reply;
    }
   return processedData;

}

const processUserDataAA = (type,data) => {
    var processedData=null
    if(type=="allTransactions"){
      var temp = data.analytics["allTransactions"]
        for (i in temp){
            var d=temp[i].dateOfTransaction.split("T")
            if(processedData==null)processedData=[]
            processedData.push({
                "type": temp[i].type,
                "amount": temp[i].amount,
                "dateOfTransaction": d[0],
                "timeOfTransaction": d[1],
                "categoryCode": temp[i].categoryCode,
                "counterParty": temp[i].counterParty,
                "category": temp[i].category,
            })
        }
        if(processedData)
        processedData.reverse()
    }
    return processedData;
  };
module.exports = {processUserDataAA,processUserDataFI};
