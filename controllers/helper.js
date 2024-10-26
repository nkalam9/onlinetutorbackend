
const Location = require ('../models/Location');


const getLocationFromDB= async (req, res)=>{
    try {
        const location =await Location.find({});
            if(!location){
                return res.status(404).json({message:"no data found"})
            }
        return res.status(200).json({location})
    } catch {
        console.log(error)
        res.status(500).json({error:"Internal server  error"})
    }
}

module.exports = {getLocationFromDB}