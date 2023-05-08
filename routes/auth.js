const router=require("express").Router();
const User=require("../model/User")
const CryptoJS = require("crypto-js");
const jwt=require("jsonwebtoken")

//create or register User
router.post("/register", async(req, res)=>{
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.
        encrypt(req.body.password, process.env.SECRET_KEY).
        toString(),
    },)
try{
    //sending into DB
const saveNewUser=await newUser.save();
return res.status(200).json(saveNewUser)
}catch(err){
    res.status(500).json(err)
}
})

//login
router.post("/login", async(req, res)=>{
    
try{
const user=await User.findOne({email:req.body.email})
// but if there is no user
if(!user){
return res.status(404).json("No Email Found! Pls try again")
}
//if there is a user, continue
const bytes  = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

//if password doesnt match
if(originalPassword!==req.body.password){
    return res.status(401).json("wrong password, recheck and try again")

}else{
    //if password matches, thats password the user inputs=his registration password
    const accessToken=jwt.sign({
        id:user._id,
        isAdmin:user.isAdmin
    }, process.env.SECRET_KEY, {expiresIn:"7d"})
    
        const {password, ...info}=user._doc;
    return res.status(200).json({...info, accessToken}) 
}
}catch(err){
    res.status(500).json(err);
}
});
module.exports=router;