const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

const userSchema = new Schema({
    username: {type: String, require: true, unique: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    role: {
        type: String, default: 'user'
    },
    status: {
        type: String, default: 'active'
    },
    profileImage: String,
    place: String,
    phone: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Joi schema for validation
const joiUserSchema = Joi.object({
    username: Joi.string().min(3).max(30),
    email: Joi.string().email().required(),
    password: PasswordComplexity().required(),
    role: Joi.string().valid('user', 'admin'),
    status: Joi.string().valid('active', 'block'),
    place: Joi.string().optional(),
    phone: Joi.string().optional(),
});

// Validate function
userSchema.statics.validateUser = (data) => {
    return joiUserSchema.validate(data);
};


// hashing passwords
userSchema.pre('save', async function(next){
    const user =  this;
    if(!user.isModified('password')) return next();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
})

// match passwords
userSchema.methods.comparePassword = function (cadidatePassword) {
    return bcrypt.compare(cadidatePassword, this.password)
}

const User = new model('User', userSchema);
module.exports = User;