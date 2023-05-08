const express=require("express")
const app=express();
const dotenv=require("dotenv");
dotenv.config();

const mongoose = require('mongoose');
const authRoute=require("./routes/auth");
const userRoute=require("./routes/users");
const moviesRoute=require("./routes/movies");
const listRoute=require("./routes/lists")

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err)=>console.log(err))

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/lists", listRoute);


app.listen(8800, ()=>{
    console.log("server is listening to port 8800")
})