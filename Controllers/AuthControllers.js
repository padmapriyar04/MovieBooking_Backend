const User = require('../models/User');
const {getSignedToken,matchPassword,getRefreshToken} = require('../models/User');

const sendTokenResponse = (user,StatusCode,response)=>{
    const accesstoken  = user.getSignedToken();
    const refreshToken = user.getRefreshToken();
    response.status(StatusCode).json({success:true,accesstoken,refreshToken,id: user._id,role:user.role});
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

exports.refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token not provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const accessToken = user.getSignedToken();
        res.status(200).json({ success: true, accessToken });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};
