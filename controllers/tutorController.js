const Tutor = require('../models/Tutor');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotEnv = require('dotenv');
const { json } = require('body-parser');

dotEnv.config();

const secretKey = "onlinetutorsystem";
console.log(secretKey)


const tutorRegister = async (req, res) => {
    const { name, DOB, gender, userId, tutorPhoto, email, password, location,
        address, contactDetails, teachingSubjects } = req.body
    try {
        const tutorEmail = await Tutor.findOne({ email });
        if (tutorEmail) {
            return res.status(400).json("email already registered");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newTutor = new Tutor({
            name,
            DOB,
            gender,
            userId,
            tutorPhoto,
            email,
            //password: hashedPassword,
            password,
            location,
            address,
            contactDetails,
            teachingSubjects
        })
        const tutor = await newTutor.save();
        const notification = new Notification({
            tutorId: tutor._id,
            tutorName: tutor.name,
            registrations: []
        })
        console.log(notification)
        const st= await notification.save()
        console.log(st)
        res.status(200).json({
            message: "Tutor successfully registered..!"
        });
        console.log("Tutor successfully registered..!")
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

const tutorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const tutor = await Tutor.findOne({ email });
        if (!tutor) {
            return res.status(401).json({ error: "Invalid userName" })
        }
        if (!(password === tutor.password)) {
            return res.status(401).json({ error: "Invalid password" })
        }
        const token = jwt.sign({ userId: tutor._id, type: "tutor" }, secretKey, { expiresIn: "1h" });
        res.status(200).json({ success: "Tutor logged in successfully", token });
        console.log(tutor.email)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

const getTutorById = async (req, res) => {
    const tutorID = req.params.id;
    try {
        const tutor = await Tutor.findById(tutorID);
        if (!tutor) {
            return res.status(200).json({ message: "no tutor exists with id" + tutorID })
        }
        return res.status(200).json({ tutor })
    } catch {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}


const updateTutorById = async (req, res) => {
    const tutorID = req.params.id;
    console.log(tutorID)
    try {
        const updatedTutor = await Tutor.findByIdAndUpdate(tutorID, req.body, { new: true })
        return res.status(200).json({ tutor: updatedTutor })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}
const addTutionSlot = async (req, res) => {
    const id = req.params.tutorId;
    console.log(id)
    try {
        const slots = await Tutor.findById(id, "tutionSlots");
        for (let i = 0; i < slots.tutionSlots.length; i++) {
            if (slots.tutionSlots[i].subject === req.body.subject) {
                return res.status(409).json({ message: "slot already exists" })
            }
        }
        console.log(slots.tutionSlots)
        const finalReq = {
            tutionSlots: [
                {
                    subject: req.body.subject,
                    tutionDate: req.body.tuitionDate,
                    timeFrom: req.body.tuitionTimeFrom,
                    timeTo: req.body.tuitionTimeTo,
                    tuitionDate:req.body.tuitionDate,
                    fee: req.body.tuitionFee,
                    user: "",
                    reserved: false,
                    requested: false
                }
            ]
        }
        const notificationRequest = {
            registrations: [
                {
                    subject: req.body.subject,
                    reserved: false,
                    timeFrom: req.body.tuitionTimeFrom,
                    timeTo: req.body.tuitionTimeTo,
                    tuitionDate:req.body.tuitionDate,
                    StudentDetails:
                    {
                        studentName: "",
                        studentId: ""
                    }
                    ,
                    requested: false
                }
            ]
        }
        console.log(finalReq)
        const updatedTutor = await Tutor.findByIdAndUpdate({ _id: id }, { $addToSet: finalReq })
        const notification = await Notification.findOne({ tutorId: id })
        console.log(notification)
        const updatedTutorNotification = await Notification.findByIdAndUpdate({ _id: notification._id }, { $addToSet: notificationRequest })
        return res.status(200).json({ message: "slots added successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

const findTutorByLocation = async (req, res) => {
    const city = req.params.city;
    const state = req.params.state;
    const country = req.params.country;
    //console.log("state, country, city",state,country,city)
    try {
        const filter = {
            "location.city": city,
            "location.state": state,
            "location.country": country
        }
        let finalResponse = []
        console.log(filter)
        const findTutorByLoc = await Tutor.find(filter, "_id name tutionSlots")
        console.log(findTutorByLoc)
        for (let i = 0; i < findTutorByLoc.length; i++) {
            let eachTutor = {}
            eachTutor.name = findTutorByLoc[i].name
            eachTutor.tutorId = findTutorByLoc[i]._id
            let availableSlots = []
            for (let j = 0; j < findTutorByLoc[i].tutionSlots.length; j++) {
                if (findTutorByLoc[i].tutionSlots[j].reserved === false &&
                    findTutorByLoc[i].tutionSlots[j].requested === false) {
                    availableSlots.push(findTutorByLoc[i].tutionSlots[j])
                }
            }
            eachTutor.slots = availableSlots
            finalResponse.push(eachTutor)
        }
        console.log(finalResponse)
        if (findTutorByLoc.length === 0) {
            return res.status(404).json({ message: "No Tutor found in the given location" })
        }
        return res.status(200).json(finalResponse)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}
const getPendingApprovals = async (req, res) => {
    const tutId = req.params.id
    const notification = await Notification.findOne({ tutorId: tutId })
    console.log(notification)
    let finalResponse = []
    for (let i = 0; i < notification.registrations.length; i++) {
        if (notification.registrations[i].requested === true && notification.registrations[i].reserved === false) {
            finalResponse.push(notification.registrations[i])
        }
    }
    return res.status(200).json(finalResponse)

}
const approveOrRejectRequests = async (req, res) => {
    const tutId = req.body.tutorId
    const subject = req.body.subject
    const approved = req.body.approved
    let studentName = ""
    let updateNotification = {}
    const notification = await Notification.findOne({ tutorId: tutId })
    let finalResponse = []
    for (let i = 0; i < notification.registrations.length; i++) {
        if (notification.registrations[i].requested === true && notification.registrations[i].reserved === false
            && notification.registrations[i].subject === subject) {
            finalResponse.push(notification.registrations[i])
            studentName = notification.registrations[i].StudentDetails.studentName
            if (approved) {
                updateNotification = await Notification.updateOne({ _id: notification._id, 'registrations._id': notification.registrations[i]._id },
                    {
                        $set: {
                            'registrations.$.reserved': approved
                        }
                    },
                    { new: true }
                )
                const tutordetails = await Tutor.find({ _id: tutId })
                console.log(tutordetails)
                for (let i = 0; i < tutordetails[0].tutionSlots.length; i++) {
                    if (tutordetails[0].tutionSlots[i].subject === subject) {
                        updateNotification = await Tutor.updateOne({ _id: tutId, 'tutionSlots._id': tutordetails[0].tutionSlots[i]._id },
                            {
                                $set: {
                                    'tutionSlots.$.reserved': approved
                                }
                            },
                            { new: true }
                        )
                        console.log(updateNotification)
                    }
                }
            }
            else {
                updateNotification = await Notification.updateOne({ _id: notification._id, 'registrations._id': notification.registrations[i]._id },
                    {
                        $set: {
                            'registrations.$.requested': approved,
                            'registrations.$.StudentDetails.studentName': "",
                            'registrations.$.StudentDetails.studentId': ""
                        }
                    },
                    { new: true }
                )
                const tutordetails = await Tutor.find({ _id: tutId })
                console.log(tutordetails)
                for (let i = 0; i < tutordetails[0].tutionSlots.length; i++) {
                    if (tutordetails[0].tutionSlots[i].subject === subject) {
                        updateNotification = await Tutor.updateOne({ _id: tutId, 'tutionSlots._id': tutordetails[0].tutionSlots[i]._id },
                            {
                                $set: {
                                    'tutionSlots.$.requested': approved
                                }
                            },
                            { new: true }
                        )
                        console.log(updateNotification)
                    }
                }
            }
        }
    }
    if (approved) {
        return res.status(200).json({
            message: "Tution request for " + req.body.subject + " is approved for " + studentName
        })
    }
    else {
        return res.status(200).json({
            message: "Tution request for " + req.body.subject + " is Rejected for " + studentName
        })
    }
}

const getApprovedSlots = async (req, res) => {
    const tutId = req.params.id
    const registrations = await Notification.findOne({ tutorId: tutId }, "registrations")
    console.log(registrations)
    let finalResponse = []
    for (let i = 0; i < registrations.registrations.length; i++) {
        finalResponse.push(registrations.registrations[i])
        // if (registrations.registrations[i].reserved === true ) {
            
        // }
    }
    return res.status(200).json(finalResponse)

}

module.exports = {
    tutorRegister, tutorLogin, getTutorById, updateTutorById, addTutionSlot, findTutorByLocation,
    getPendingApprovals, approveOrRejectRequests, getApprovedSlots
}