const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotEnv = require('dotenv')

dotEnv.config();

const secretkey = "onlinetutorsystem";

const studentRegister = async (req, res) => {
    const { name, DOB, gender, userId, studentPhoto, email, password, location, address, contactDetails } = req.body
    try {
        const studentEmail = await Student.findOne({ email });
        if (studentEmail) {
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
            message: "student successfully registered..!"
        });
        console.log("student succesfully registered..!")
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}
const studentLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ error: "Invalid userName" })
        }
        if (!(password === student.password)) {
            return res.status(401).json({ error: "Invalid password" })
        }
        const token = jwt.sign({ userId: student._id, type: "student", studentName:student.name }, secretkey, { expiresIn: "1h" });

        res.status(200).json({ success: "student logged in successfully", token });
        console.log(student.email)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

const getStudentById = async (req, res) => {
    const studentId = req.params.id;
    try {
        const student = await Student.find({ _id: studentId });
        if (!student) {
            return res.status(404).json({ message: "no student exists with th id" })
        }
        return res.status(200).json({ student })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }

}

const updateStudentById = async (req, res) => {
    const studentId = req.params.id;
    try {
        const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, { new: true })
        return res.status(200).json({ student: updatedStudent })
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
}

const registerForTution = async (req, res) => {
    const tId = req.body.tutorId;
    const sId = req.body.studentId;
    const subject = req.body.subject
    const studentName = req.body.studentName
    console.log(subject)
    try {
        const findTutorFromNotification = await Notification.find({ tutorId: tId })
        const regest = findTutorFromNotification[0].registrations
        for (let i = 0; i < regest.length; i++) {
            if (regest[i].subject === subject && regest[i].reserved === false) {
                const updateNotification = await Notification.updateOne({ _id: findTutorFromNotification[0]._id, 'registrations._id': regest[i]._id },
                    {
                        $set: {
                            'registrations.$.requested': true,
                            'registrations.$.StudentDetails.studentName': studentName,
                            'registrations.$.StudentDetails.studentId': sId
                        }
                    },
                    { new: true }
                )
                const findTutorSlots = await Tutor.find({ _id: tId }, "tutionSlots")
                for (let j = 0; j < findTutorSlots[0].tutionSlots.length; j++) {
                    if (findTutorSlots[0].tutionSlots[j].subject === subject) {
                        const updateTutor = await Tutor.updateOne({ _id: tId, 'tutionSlots._id': findTutorSlots[0].tutionSlots[j]._id },
                            {
                                $set: {
                                    'tutionSlots.$.requested': true,
                                    'tutionSlots.$.user': sId
                                }
                            },
                            { new: true }
                        )
                        //console.log(updateTutor)
                    }
                }
            }
        }
        return res.status(200).json({ message: "Tution request for " + subject + " is submitted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server errorr" })
    }
}

const getRegisteredSubjects = async (req, res) => {
    const finalResponse = []
    const studentId = req.params.id
    try {
        const documents = await Notification.find({});
        for (let i = 0; i < documents.length; i++) {
            let eachObj = {}
            eachObj.regestiredSubjects = []
            for (let j = 0; j < documents[i].registrations.length; j++) {
                //console.log(documents[i])

                if (documents[i].registrations[j].StudentDetails.studentId === studentId &&
                    documents[i].registrations[j].reserved === true) {
                    eachObj.tutotName = documents[i].tutorName
                    eachObj.tutotId = documents[i].tutorId
                    eachObj.regestiredSubjects.push(documents[i].registrations[j])
                    const tutorDet = await Tutor.find({_id:documents[i].tutorId}, "tutionSlots");
                    for(let k=0; k<tutorDet.length;k++){
                    if(tutorDet[0].tutionSlots[k].subject===documents[i].registrations[j].subject){
                        eachObj.timeFrom = tutorDet[0].tutionSlots[k].timeFrom
                        eachObj.timeTo = tutorDet[0].tutionSlots[k].timeTo
                    }
                }
            }
        }
                
            
            if (eachObj.regestiredSubjects.length != 0) {
                finalResponse.push(eachObj)
            }


        }
        return res.status(200).json(finalResponse)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server errorr" })
    }
}

module.exports = { studentRegister, studentLogin, updateStudentById, registerForTution, getRegisteredSubjects, getStudentById }
