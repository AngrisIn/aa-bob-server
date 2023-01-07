const config = require("../config");
const { v4: uuidv4 } = require('uuid');


//TODO STORE TRACKING ID IN MONGODB
const initConsent = (mobileNumber,tId) => {
  if(tId==null){
    tId=uuidv4();
  }
  var data = JSON.stringify({
    vuaId: mobileNumber + "@" + config.aa_id,
    templateType: "PERIODIC",
    trackingId: tId,
    redirectionUrl: "http://"+config.hosted_url + "/redirect",
  });   
  // console.log(data);
  return data;
};

module.exports = initConsent;
