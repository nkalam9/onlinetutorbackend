const mongoose = require("mongoose")

const tutorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    DOB: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    tutorPhoto: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    address: {
        buildingNo: {
            type: String,
            required: true
        },
        floor: {
            type: String
        },
        streetNo: {
            type: String
        },
        area: {
            type: String,
            required: true
        },
        landMark: {
            type: String
        },
        pinCode: {
            type: String,
            required: true
        }
    },
    contactDetails: {

        emailId: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        }

    },
    teachingSubjects: [
        {
            type: String,
            required: true
        }
    ],
    tutionSlots:[
        {
            subject:{
                type: String,
            },
            tuitionDate:{
                type: String,
            },
            timeFrom:{
                type: String,
            },
            timeTo:{
                type: String,
            },
            fee:{
                type: String,
            },
            user:{
                type: String,
            },
            reserved:{
                type: Boolean,
            },
            requested:{
                type: Boolean,
            }
        }
    ]
})

const Tutor = mongoose.model('Tutor', tutorSchema);
module.exports = Tutor;