const { response } = require("express");
const User = require("../schema/userSchema");

updateAAID = (mobile,tID,rID)=>{
    User.findOneAndUpdate({ mobile: mobile }, { $set: { trackingId: tID, referenceId:rID },            
      runValidators: true,}, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log('User updated successfully!');
        }
      });
    return true;

}

userDetails = async (mobile) => {   
  var user = await User.findOne({mobile: mobile})
  console.log(user)
  return user;
}

idDetailsOfUser = async (mobile) => {   
  var user = await User.findOne({mobile: mobile})
  if(user==null)
    return null
  var response ={}
  response["trackingId"]=user.trackingId;
  response["referenceId"]=user.referenceId;
  return response;
}
module.exports = {updateAAID,userDetails,idDetailsOfUser};