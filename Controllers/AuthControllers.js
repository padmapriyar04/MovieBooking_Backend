const User = require('../models/User');
const {getSignedToken,matchPassword} = require('../models/User');

const sendTokenResponse = (user,StatusCode,response)=>{
    const token  = user.getSignedToken();
    response.status(StatusCode).json({success:true,token});
}

exports.register = async(req,res)=>{
    const {name,email,password,role} = req.body;

    try{
        const user = await User.create({
            name,
            email,
            password,
            role,
        });
        sendTokenResponse(user,200,res);
    }catch(error){
        // res.status(400).json(error);
        console.error(error);
    }
}

exports.login = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message : 'Please provide email and password'});
    }

    try{
        const user = await User.findOne({email}).select('+password');

        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({message:"Invalid credentials"});
        }

        sendTokenResponse(user,200,res);

    }catch(error){
        // res.status(400).json({
        //     message : "Error logging in",
        // })
        console.error(error);
    }
}
