const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name:{type:String, required:true},
        email:{type:String, required:true},
        password:{type:String, required:true},
        pic:{type:String,  default:"https://icon-library.com/images/profile-picture-icon/profile-picture-icon-7.jpg"},
    },
    {
        timestamps: true
    }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;