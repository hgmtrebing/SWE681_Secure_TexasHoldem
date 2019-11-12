const jwt = require('jsonwebtoken');
const config = require('../config');


//Mock Users
const users = [{
    id :1,
    username: 'Pravin397',
    password : 'password' //its not slated --will work on it also
}];

async function authenticate(username, password){
    const user = users.find(u => u.username === username && u.password ===password);
    console.log(user)
    if(user){  
            const token = jwt.sign({"username": user.username, "password": user.password}, config.secretKey, {expiresIn: '12h'})
            return {
                success:true,
                token: token,
                username: user.username,
                message: 'Successfully logged in'
            }
    }
    return {
        success:false,
        message: 'Invalid Username and Password'
    }
}

module.exports= {
    authenticate : authenticate
}