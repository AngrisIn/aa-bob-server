function getDesiredFieldsFromAccount(type,json) {
  if(type=="DEPOSIT"){
    return {
      maskedAccountNumber: json.maskedAccountNumber,
      fiType: json.fiType,
      name: json.data.Profile.Holders.Holder[0].name,
      pan: json.data.Profile.Holders.Holder[0].pan,
      ifsc: json.data.Summary.ifscCode,
      currentbalance: json.data.Summary.currentBalance,
      currency: json.data.Summary.currency,
      branch:json.data.Summary.branch,
      mobile: json.data.Profile.Holders.Holder[0].mobile,
      };
  }
  if(type=="EQUITIES"){
    return {
        maskedAccountNumber: json.maskedAccountNumber,
        fiType: json.fiType,
        name: json.data.Account.Profile.Holders.Holder.name,
        mobile: json.data.Account.Profile.Holders.Holder.mobile,
        dematId: json.data.Account.Profile.Holders.Holder.dematId,
        pan: json.data.Account.Profile.Holders.Holder.pan,
        investmentvalue: json.data.Account.Summary.investmentValue,
        currentValue: json.data.Account.Summary.currentValue
      }
  }  
  if(type=="MUTUAL_FUNDS"){
    return {
        maskedAccountNumber: json.maskedAccountNumber,
        fiType: json.fiType,
        name: json.data.Account.Profile.Holders.Holder.name,
        mobile: json.data.Account.Profile.Holders.Holder.mobile,
        pan: json.data.Account.Profile.Holders.Holder.pan,
        dematId: json.data.Account.Profile.Holders.Holder.dematId,
      };
  }else{
     return {
        maskedAccountNumber: json.maskedAccountNumber,
        fiType: json.data.Account.type,
        name: json.data.Account.Profile.Holders.Holder.name,
        mobile: json.data.Account.Profile.Holders.Holder.mobile,
        pan: json.data.Account.Profile.Holders.Holder.pan,
      };
  }
}

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
    console.log(alldetails)
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
              "isin":k['Holding']["isin"]
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
          "instrumentType": i['instrumentType'],
          "optionType":i["optionType"],
          "isin":i["isin"],
          
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
    var summary = data[index]['Account']['Summary']['Investment']['Holdings']
    try{
      summary.forEach(function(k,index){
          if(processedData==null)processedData=[]
          processedData.push({
            "isin": k['Holding']["isin"],
            "amc": k['Holding']["amc"],
            "closingUnits": k['Holding']["closingUnits"],
            "rate": k['Holding']["rate"],
            "nav": k['Holding']["nav"],
            "amfiCode":k['Holding']["amfiCode"],
            "schemeCode":k['Holding']["schemeCode"],
          })
    })
    
    }catch(err){
      if(processedData==null)processedData=[]
      processedData.push({
        "isin": summary['Holding']["isin"],
        "amc": summary['Holding']["amc"],
        "closingUnits": summary['Holding']["closingUnits"],
        "rate": summary['Holding']["rate"],
        "nav": summary['Holding']["nav"],
        "amfiCode":summary['Holding']["amfiCode"],
        "schemeCode":summary['Holding']["schemeCode"],
      })
    }
    if(processedData)
      processedData.reverse()
    reply['summary'] = processedData;

    processedData=null
    var all = data[index]['Account']['Transactions']['Transaction']
    console.log(all)
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
    }else if(type=="accounts"){
        var temp =data.accounts;
        for (i in temp){
            if(processedData==null)processedData=[]
            processedData.push(getDesiredFieldsFromAccount(temp[i].fiType,temp[i]))
        }
        if(processedData)
        processedData.reverse()
    }
    return processedData;
  };
module.exports = {processUserDataAA,processUserDataFI};
