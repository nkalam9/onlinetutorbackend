const mongoose = require("mongoose")

const locationSchema= new mongoose.Schema({
    countrystateCity:[
        {
            country:{
                type:String
            },
            states:{
                state:{
                    type:String
                },
                cities:[
                    {
                        type:String
                    }
                ]
            }
        }
    ]
})

const Location = mongoose.model('Location', locationSchema)
module.exports = Location