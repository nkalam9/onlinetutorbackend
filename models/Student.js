const mongoose= require("mongoose")

const studentSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,

  },
  DOB:{
    type: String,
    required:true,
  },
  gender:{
    type:String,
    required:true,
  },
  userId:{
    type:String,
    required: true,
    unique:true
  },
  studentPhoto:{
    type: String,
    required:true,
  },
  email:{
    type:String,
    required:true,

  },
  password:{
    type:String,
    required: true
  },
  location:{
    city:{
        type:String,
        required: true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }
  },
  address:{
    buildingNo:{
        type:String,
        required:true
    },
    floor:{
        type:String
    },
    streetNo:{
        type:String
    },
    area:{
        type:String,
        required:true
    },
    landMark:{
        type:String
    },
    pinCode:{
        type:String,
        required:true
    }
  },
  contactDetails:{
    emailId:{
        type:String,
        required:true
    },
    phoneNo:{
        type:String,
        required:true
    }

  }
})
const Student = mongoose.model('student',studentSchema);
module.exports=Student;
