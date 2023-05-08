const router=require("express").Router();
const Movies=require("../model/Movies");
const verify=require("../verifyToken");

//create
router.post("/", verify, async (req, res)=>{
    if(req.user.isAdmin){
const newMovie=new Movies(req.body)
        try {
      const savedMovie=await newMovie.save(); 
      return res.status(200).json(savedMovie);    
        } catch (error) {
           return res.status(500).json(error) 
        }

    }else{
 return res.status(401)
 .json("You are not allowed to perform this operation")
    }
})

//update
router.put("/:id",verify, async (req, res)=>{
    if(req.user.isAdmin){
 try {
      const updatedMovie=await Movies.findByIdAndUpdate
      (req.params.id,{$set:req.body}, {new:true}) 
      return res.status(200).json(updatedMovie);    
        } catch (error) {
           return res.status(500).json(error) 
        }

    }else{
 return res.status(401)
 .json("You are not allowed to perform this operation")
    }
})


//delete
router.delete("/:id", verify, async (req, res)=>{
    if(req.user.isAdmin){

        try {
      await Movies.findByIdAndDelete(req.params.id) 
      return res.status(200).json("The movie has been deleted");    
        } catch (error) {
           return res.status(500).json(error) 
        }

    }else{
 return res.status(401)
 .json("You are not allowed to perform this operation")
    }
})

//get
router.get("/find/:id", verify, async (req, res)=>{
   
        try {
    const findMovie= await Movies.findById(req.params.id) 
      return res.status(200).json(findMovie);    
        } catch (error) {
           return res.status(500).json(error) 
        }

    });

    //get random
router.get("/random", verify, async (req, res)=>{
   const type=req.query.type;
   let movie;// a variable created, so as to be changed inside the condition
    try {
 if(type==="series"){
movie=await Movies.aggregate([
  {$match:{isSeries:true}},
  {$sample:{size:1}}  
])
 }else{
    movie=await Movies.aggregate([
        {$match:{isSeries:false}},
        {$sample:{size:1}}  
      ])  
 }
 return res.status(200).json(movie)
 //check whether it returned an object or array?
    } catch (error) {
       return res.status(500).json(error) 
    }

});

//get all movies
router.get("/", verify, async (req, res)=>{
   if(req.user.isAdmin){

       try {
    const allMovies= await Movies.find() 
     return res.status(200).json(allMovies.reverse());    
       } catch (error) {
          return res.status(500).json(error) 
       }

   }else{
return res.status(401)
.json("You are not allowed to perform this operation")
   }
})


module.exports=router;
