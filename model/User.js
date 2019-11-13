const mongoose = require('mongoose');
const Bcrypt = require("bcryptjs");

let schema = mongoose.Schema;

let UserSchema = new schema({
    username: {
        type: String,
        unique: true,
        minlength:5,
        maxlength:20,
        required :true
    }, 
    password: {
        type: String,
        minlength:5,
        maxlength:20,
        required :true
    } 

},{timestamps:true})

// This function is automatically called before any user model object is saved in the database
// The password property of the user model object is salted and hashed here.
UserSchema.pre("save", function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = Bcrypt.hashSync(this.password, 10);
    next();
})


//A separate comparePassword() to compare the password for the match during login
UserSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, Bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model('User', UserSchema);