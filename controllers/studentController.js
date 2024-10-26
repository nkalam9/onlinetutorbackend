const Student= require('../models/Student');
const Notification= require('../models/Notification');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const dotEnv=require('dotenv')

dotEnv.config();

const secretkey = "onlinetutorsystem";

const studentRegister= async(req, res)=>{
    const{name,DOB,gender,userId,studentPhoto,email,password,location,address,contactDetails}=req.body
    try{
        const studentEmail=await Student.findOne({ email});
        if(studentEmail){
            return res.status(400).json("email already registered");
        }
        
        const newStudent = new Student({
            
           name,
            DOB,
            gender,
            userId,
            studentPhoto,
            email,
            password,
            location,
            address,
           contactDetails

        })
        await newStudent.save();
        res.status(201).json({
           message:"student successfully registered..!" 
        });
        console.log("student succesfully registered..!")
    }catch (error){
        console.log(error)
        res.status(500).json({error:"Internal server error"})
    }
}
 const studentLogin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const student=await Student.findOne({email});
        if(!student){
            return res.status(401).json({error: "Invalid userName"})
        }
        if(!(password === student.password)){
            return res.status(401).json({error:"Invalid password"})
        }
        const token=jwt.sign({userId:student._id, type:"student"},secretkey,{expiresIn:"1h"});
         
        res.status(200).json({success:"student logged in successfully",token});
        console.log(student.email)}
        catch(error){
            console.log(error)
            res.status(500).json({error:"Internal server error"})
        }
    }

    const getStudentById = async (req, res)=>{
        const studentId = req.params.id;
        try {
        const student = await Student.findById(studentId);
        if(!student){
            return res.status(404).json({message:"no student exists with th id"})
        }
        return res.status(200).json({student})
        } catch {
            console.log(error)
            res.status(500).json({message:"internal server error"})
        }

    }

    const updateStudentById = async (req, res) => {
        const studentId =req.params.id;
        try {
            const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, {new:true})
            return res.status(200).json({student: updatedStudent})
        } catch (error) {
           return res.status(500).json({error:"Internal server error"})
        }
    }

    const registerForTution= async(req, res)=>{
        const id =req.body.tutorId;
        const subject = req.body.subject
        console.log(id)
        try {
            const findTutorFromNotification = await Notification.find({tutorId:id})
            console.log(findTutorFromNotification)
            const regest = findTutorFromNotification[0].registrations
            for (let i=0;i<regest.length;i++){
                if(regest[i].subject===subject){
                    
                }
            }

           // const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, {new:true})
            return res.status(200).json(findTutorFromNotification)
        } catch (error) {
            console.log(error)
           return res.status(500).json({error:"Internal server errorr"})
        }
    }

 module.exports={studentRegister,studentLogin, getStudentById, updateStudentById, registerForTution}
