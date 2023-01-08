"use strict";


//FIll the key values and change the file name to config.js
// require("dotenv").config();
const API_URL = "https://hackathon.pirimidtech.com/hackathon";
const API_KEY = "";
const AA_ID = "dashboard-aa-uat";
const HOSTED_URL = "192.168.193.0:5000";
const MONGO_URL="";
const REDIS='127.0.0.1' //Local host redis server

module.exports = {
  // Server port.
  port: 5000,
  api_url: API_URL,
  api_key: API_KEY,
  aa_id: AA_ID,
  hosted_url: HOSTED_URL,
  db_url: MONGO_URL,
  redis_url:REDIS,
  redis_port:"6379"
};
