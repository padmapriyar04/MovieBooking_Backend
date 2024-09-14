const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
        });

        console.log(`MongoDB connected succesfully:${con.connection.host}`)
    } catch(error){
        console.error(`Error Message:${error.message}`);
    }
};

module.exports = connectDB;