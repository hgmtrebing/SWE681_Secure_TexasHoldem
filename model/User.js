const mongoose = require('mongoose');
const Bcrypt = require("bcryptjs");

let schema = mongoose.Schema;

let UserSchema = new schema({
    username: {
        type: String,
        unique: true,
        required :true
    }, //need to add validation
    password: {
        type: String,
        required :true
    } //need to add validation

},{timestamps:true})

// this function is automatically called before this user model is saved in the database
// we will hash the password here
UserSchema.pre("save", function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = Bcrypt.hashSync(this.password, 10);
    next();
})

//we will use compare password to see if the password match -- during login
UserSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, Bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model('User', UserSchema);