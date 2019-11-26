const mongoose = require('mongoose');
const Bcrypt = require("bcryptjs");

let schema = mongoose.Schema;

let UserSchema = new schema({
    username: {
        type: String,
        unique: true,
        minlength:[5, 'Username should be at least 5 char long'],
        maxlength:[20,'Username cannot be longer than 20 chars'],
        validate: {
            validator: function(v) {
              return /^[a-zA-Z0-9]+$/.test(v);
            },
            message: props => `${props.value} is not a valid username. Only aplhanumeric char are allowed!`
          },
        required :[true, 'Username is required']
    }, 
    password: {
        type: String,
        minlength:[8, 'Password should be at least 8 char long'],
        maxlength:[20,'Password cannot be longer than 20 chars'],
        //add password complexity validator (Follow Rules)
        validate: {
            validator: function(v) {
              return /^([a-zA-Z0-9@_$*#!.]{8,20})$/.test(v);
            },
            message: props => `${props.value} is not a valid password. See the password rules!`
          },
        required :[true, 'Password is required']
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
    Bcrypt.compare(plaintext, this.password, function(err, match){
        if(err) return callback(err);

        return callback(null, match);
    });
};

module.exports = mongoose.model('User', UserSchema);