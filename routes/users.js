const router=require("express").Router();
const User=require("../model/User");
const CryptoJS = require("crypto-js");
const verify=require("../verifyToken");

//Update
router.put("/:id",verify, async(req, res)=>{
    if(req.user.id===req.params.id || req.user.isAdmin){
        if(req.body.password){
 req.body.password=CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).
            toString()
        }
    
try{
const updatedUser=await User.findByIdAndUpdate(req.user.id,
     {$set:req.body},{new:true});
return res.status(200).json(updatedUser)
}catch(err){
    res.status(500).json(err)
}
}else{
    return res.status(403).json("You can update only your account")
}
})

//Delete
router.delete("/:id", verify, async(req, res)=>{
    if(req.user.id===req.params.id || req.user.isAdmin){
    
        try {
       await User.findByIdAndDelete(req.user.id);
       return res.status(200).json("user has been deleted")   
        } catch (err) {
           return res.status(500).json(err) 
        }
    }else{
        return res.status(401).json("you can only delete your account")
    }
})
//get
router.get("/find/:id", async(req, res)=>{
    try{
const user=await User.findById(req.params.id);
const {password, ...info}=user._doc;
return res.status(200).json(info);
    }catch(err){
        return res.status(500).json(err)
    }
});


//get All
router.get("/",verify, async(req, res)=>{
    const query=req.query.new;//new is the key
    if(req.user.isAdmin){

    try{
const users=query ? await User.find().sort({_id:-1}).limit(5)
:await User.find();
return res.status(200).json(users)
}catch(err){
        return res.status(500).json(err)
    }
}else{
    return res.status(401).json("you are not allowed to see all users")
}

});
//user Stats
router.get("/stats", async(req, res)=>{
    const today=new Date();
    const lastYear=today.setFullYear(today.setFullYear()-1);
    
    //total users per month
    try{
const dataMonthly=await User.aggregate([
    {
    $project:{
month:{$month:"$createdAt"}
    },
},
{
  $group:{
    _id:"$month",
    total:{$sum:1}
  }  
}

])
return res.status(200).json(dataMonthly);
    }catch(err){
        return res.status(500).json(err)
    }
})


module.exports=router