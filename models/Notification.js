const mongoose = require("mongoose")

const notificationSchema= new mongoose.Schema({
    tutorId:{
        type: String,
        required: true,
      },
      tutorName:{
        type:String
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
            timeFrom:{
                type: String,
            },
            timeTo:{
                type: String,
            },
            tuitionDate:{
                type: String,
            },
            StudentDetails:
                {
                    studentName:{
                        type:String
                    },
                    studentId:{
                        type:String
                    }
                }
            
        }
    ]
})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification