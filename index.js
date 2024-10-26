const express= require ("express");
const mongoose= require ("mongoose");
const tutorRoutes= require('./routes/tutorRoute');
const studentRoutes= require('./routes/studentRoutes');
const locationRoute= require('./routes/locationRoute');
const bodyParser= require("body-parser");

const cors = require('cors')

const app=express()
const port=4000;

let corsOptions = {
    origin : ['http://localhost:3000']
}
app.use(cors(corsOptions))

mongoose.connect("mongodb://localhost:27017/online_tutor_system")
.then(()=>console.log("db connection successfull"))
.catch((error)=>console.log(error))

app.use(bodyParser.json());
app.use('/tutor',tutorRoutes);
app.use('/student',studentRoutes);
app.use('/location',locationRoute);

app.listen(port,()=>{
    console.log(`listening on port ${port}`);

});

app.use('/home',(req,res)=>{
    res.send("<h1> welcome to online tutor system");
})
