const User = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const redis = require('redis');
const config = require("../config");

const { RateLimiterRedis } = require('rate-limiter-flexible');
// You may also use Mongo, Memory or any other limiter type

// const redisClient = redis.createClient( config.redis_port, config.redis_url,
// {  enable_offline_queue: false});

const redisClient = redis.createClient({  enable_offline_queue: false});

const maxConsecutiveFailsByMobile = 5;

const limiterConsecutiveFailsByMobile = new RateLimiterRedis({
  redis: redisClient,
  keyPrefix: 'login_fail_consecutive_mobile',
  points: maxConsecutiveFailsByMobile,
  duration: 60 * 60 * 3, // Store number for three hours since first fail
  blockDuration: 60 * 120, // Block for 15 minutes
});


exports.createUser = async (req, res, next) => {
    console.log("New account request")
    var mobile = req.body.mobile.trim();
    var pin = req.body.pin;
    pin = await bcrypt.hash(pin, 10);
    var user = await User.findOne({mobile: mobile})
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    var response = { "msg":"Account created successfully","type":"success"}
    if(user == null) {
        user = new User({
            mobile: mobile,
            pin: pin,
            isLinked: false,
        });
        
        user.save((error) => {
            if (error) {
                response["msg"]="Couldnt create account";
                response["type"]="error";
                console.log(error);
            }
        });
        
    }else{
        response["msg"]="Account exists already";
        response["type"]="error";
    }
    console.log(response)
    res.end(JSON.stringify(response));
};

exports.loginUser = async (req, res, next) => {   
    console.log("Login request")
    var mobile = req.body.mobile.trim();
    var pin = req.body.pin;
    const rlResMobile = await limiterConsecutiveFailsByMobile.get(mobile);
    console.log(rlResMobile)
    var response = { "msg":"Logged in successfull","type":"success","auth":true,"user":null}
    var user = await User.findOne({mobile: mobile})
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    if(user == null) {
        response["msg"]="Account doesnt exist";
        response["type"]="error";
        response["auth"]=false;

    }else{
        var result = await bcrypt.compare(pin, user.pin);
        if(result === true) {
            await limiterConsecutiveFailsByMobile.set(mobile,0);
            response["user"]=user;
            response["user"].pin=null;
            console.log("Credentials matched")
        }
        else{
            response["auth"]=false;
            if (rlResMobile !== null && rlResMobile.consumedPoints > maxConsecutiveFailsByMobile) {
                response["msg"]="Too many requests try later";
                response["type"]="error";
           
            }else{
                response["msg"]="Incorrect PIN "+(maxConsecutiveFailsByMobile-rlResMobile.consumedPoints)+" try left";
                response["type"]="error";
                await limiterConsecutiveFailsByMobile.consume(mobile).catch((err)=>{
                    console.log("Error when the limit is exactly what was set, need to fix")
                });    
            }

        }

    }
    res.end(JSON.stringify(response));
}





