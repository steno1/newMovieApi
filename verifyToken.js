const jwt=require("jsonwebtoken")
const verify=(req, res, next)=>{
const authHeader=req.headers.token;//is sent to header
if(authHeader){
const token=authHeader.split(" ")[1];
//verify token
jwt.verify(token, process.env.SECRET_KEY, (err,user)=>{
    if(err){
        return res.status(401).json("Token is not valid")
    }else{
        //assign a variable for our credentials
req.user=user;//our id and isAdmin
next();// go to actual router
    }
})

}else{
    return res.status(401).json("you are not authenticated")
}
}


module.exports=verify;