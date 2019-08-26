const mongoose = require('mongoose');
const uniqueValidator = require ('mongoose-unique-validator');

let Schema = mongoose.Schema;

let roleValited = {
    values : ['ADMIN_ROLE', 'USER_ROLE'],
    message : '#####{VALUE} ROL INVALITED########'
}

let userSchema = new Schema ({
    name : {
        type : String,
        required : [true, 'Required Name Please']
    }, 
    email : {
        type : String,
        unique : true,
        required : [true, 'Required Email']
    },
    password : {
        type : String,
        required : [true, 'The password in requerited']
    },
    img : {
        type : String,
        required : false
    },
    role : {
        type : String,
        default : 'USER_ROLE',
        enum : roleValited
    },
    status : {
        type : Boolean,
        default : true
    },
    google : {
        type : Boolean,
        default : false
    }
});

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, {message : '{PATH} sould to unique'});

module.exports = mongoose.model('User', userSchema);