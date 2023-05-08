const router=require("express").Router();
const List=require("../model/List");
const verify=require("../verifyToken");

//create
router.post("/", verify, async (req, res)=>{
    if(req.user.isAdmin){
 const newList=new List(req.body)
        try {
     const savedList= await newList.save() 
      return res.status(200).json(savedList);    
        } catch (error) {
           return res.status(500).json(error) 
        }
 
    }else{
 return res.status(401)
 .json("You are not allowed to perform this operation")
    }
 });

//delete
 router.delete("/:id", verify, async(req, res)=>{
    if(req.user.isAdmin){

try{
 await List.findByIdAndDelete(req.user.id);
 return res.status(200).json("List has been deleted")

}catch(err){
    return res.status(500).json(err)
}
    }else{
        return res.status(403).json("you are not allowed")
    }
});


//get
router.get("/", async(req, res)=>{
const typeQuery=req.query.type;
const genreQuery=req.query.genre;
let list=[];

try{
    if(typeQuery){
//home pages of different genre
        if(genreQuery){
            list=await List.aggregate([
                {$sample:{size:10}},
                {$match:{type:typeQuery, genre:genreQuery}}
            ])
    
        }else{
            //home page of series or movies
            list=await List.aggregate([
                {$sample:{size:10}},
                {$match:{type:typeQuery}}
            ])  
        }
    }else{
        //home page
        list=await List.aggregate([
            {$sample:{size:10}}
        ])
    }
 return res.status(200).json(list)

}catch(err){
    return res.status(500).json(err)
}
    
});


 module.exports=router;