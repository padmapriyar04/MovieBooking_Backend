const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {type: String,required: true},
    email : {type: String,required:true,unique:true},
    password: {type:String,required:true},
    role:{
        type : String,
        enum : ['User','Admin','Provider'],
        default : 'User',
    }
})

UserSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next(); 
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
};

UserSchema.methods.getSignedToken = function() {
    return jwt.sign({id : this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_ACCESS_EXP,
    });
};

UserSchema.methods.getRefreshToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXP });
};

module.exports = mongoose.model('User',UserSchema);