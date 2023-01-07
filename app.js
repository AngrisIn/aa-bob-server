// create an express app
const express = require("express");
const cors = require("cors");
const app = express();
const config = require("./config");
var axios = require("axios");
const database = require("./database")  //function intialised on return directly

// UTILS
const initConsent = require("./util/init_consent");
const {updateAAID,userDetails,idDetailsOfUser} = require("./util/db_fucntion")

// ROUTERS
const userRouter = require('./routes/userRouter');
const {processUserDataAA,processUserDataFI} = require("./util/process_user_data");


// use the express-static middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
// app.use(bodyParser.text({ defaultCharset: "utf-8" }));

app.use(express.static("public"));


app.use("/user/", userRouter);



// define the first route
app.get("/", function (req, res) {
  res.send("Server Running");
});

///// CREATE INIT CALL
app.get("/init/:mobileNumber", async (req, res) => {
  console.log("Serve Consent");
  let mobile = req.params.mobileNumber
  // let user = await userDetails(mobile)
  let tId = null
  // if(user.trackingId){
  //     tId=user.trackingId
  // }
  let body = initConsent(mobile,tId);
  var requestConfig = {
    method: "post",
    url: config.api_url + "/init/redirection",
    headers: {
      "Content-Type" : "application/json",
      "API_KEY" : config.api_key,
    },
    data: body,
  };
  axios(requestConfig)
    .then(function (response) {
      let trackingId=response.data.trackingId
      let referenceId=response.data.referenceId
      let url = response.data.redirectionUrl;
      let reply ={
        "url":url,
        "trackingId":trackingId,
        "referenceId":referenceId
      }
      console.log(reply)
      updateAAID(mobile,trackingId,referenceId)
      res.end(JSON.stringify(reply));
    })
    .catch(function (error) {
      console.log(error);
      console.log("Error");
      res.end(JSON.stringify({"url":null,"trackingId":null,"referenceId":null}));
    });

});


//Getting consent status
app.get("/consent/status/:mobileNumber", async (req, res) => {
  
  let mobile = req.params.mobileNumber
  let user = await userDetails(mobile)
  if(!user.trackingId){
    res.end(JSON.stringify({"status":"NO_TRACKING_ID"}));
  }
  var requestConfig = {
    method: "get",
    url: config.api_url + "/consent/status?referenceId="+user.referenceId+"&trackingId="+user.trackingId,
    headers: {
      "Content-Type": "application/json",
      "API_KEY" : config.api_key,
    }
   };

  axios(requestConfig)
    .then(function (response) {
      let status = response.data.status;
      console.log(status)
      // "INITIATED" "PROCESSING" "COMPLETED" "FAILED" "EXPIRED"
      // if(status!="COMPLETED"){
      //    updateAAID(mobile,null,null)
      // }
      res.end(JSON.stringify({"status":status}));
    })
    .catch(function (error) {
      console.log(error);
      res.end(JSON.stringify({"status":"ERROR"}));
    });
});

//Getting user data from FIP 
app.get("/data/fi/:mobileNumber/:type", async (req, res) => {
  
  let mobile = req.params.mobileNumber
  let type = req.params.type
  let user = await idDetailsOfUser(mobile)
  if(!user.trackingId){
    res.end(JSON.stringify({"status":"NO_TRACKING_ID"}));
  }
  var requestConfig = {
    method: "get",
    url: config.api_url + "/consent/data/fetch?referenceId="+user.referenceId+"&trackingId="+user.trackingId,
    headers: {
      "Content-Type": "application/json",
      "API_KEY" : config.api_key,
    }
   };

  axios(requestConfig)
    .then(function (response) {
      var result = processUserDataFI(type, response.data);
      res.end(JSON.stringify({"status":"Check server for fetched data details","data":result}));
    })
    .catch(function (error) {
      console.log(error);
      res.end(JSON.stringify({"status":"ERROR"}));
    });

});


//Getting user data from AA 
app.get("/data/aa/:mobileNumber/:type", async (req, res) => {
  
  let mobile = req.params.mobileNumber
  let type = req.params.type
  console.log(type,mobile)

  let user = await idDetailsOfUser(mobile)
  if(!user.trackingId){
    res.end(JSON.stringify({"status":"NO_TRACKING_ID"}));
  }
  var requestConfig = {
    method: "get",
    url: config.api_url + "/consent/analytics/fetch?referenceId="+user.referenceId+"&trackingId="+user.trackingId,
    headers: {
      "Content-Type": "application/json",
      "API_KEY" : config.api_key,
    }
   };

  axios(requestConfig)
    .then(function (response) {
      var result =  processUserDataAA(type,response.data)
      res.end(JSON.stringify({"status":"Check server for fetched data details","data":result}));
    })
    .catch(function (error) {
      console.log(error);
      res.end(JSON.stringify({"status":"ERROR"}));
    });

});

app.post("/redirect", (req, res) => {
  console.log("In redirect");
  console.log(req);
  res.send("Redirect page in Server of FIU");
});

// start the server listening for requests
app.listen(config.port || 3000, () => console.log("Server is running... on "+config.port));
