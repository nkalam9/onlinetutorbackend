const mongoose = require("mongoose")

const notificationSchema= new mongoose.Schema({
    tutorId:{
        type: String,
        required: true,
      },
    registrations:[
        {
            subject:{
                type: String,
            },
            reserved:{
                type: Boolean,
            },
            requested:{
                type: Boolean,
            },
            requestorId:{
                type: String,
            }
        }
    ]
})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification