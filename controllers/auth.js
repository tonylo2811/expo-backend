const bycrypt = require('bcryptjs');
const {User} = require('../model'); 
const { response } = require('express');

const testAuthController = (req, res) => {
    console.log('get request from AUTH controller')
    obj = {success: true, message: "AUTH controller success"};
    return res.send(JSON.stringify(obj));
}

const signUp = async(req,res) => {
    try{
        console.log('get signup request')
        let { body } = req
        const { username, email, password , confirmPassword} = body
        console.log('body', body)

        if (!username ||!email || !password) {
            return res.send({ success: false, message: 'Please provide All fields!' })
        }

        await User.findOne({'email':email})
            .then((response) => {
                if(response){
                    return res.send({success: false, message: 'Email already exists'})
                }
                console.log('email not found, hashing password')
                bycrypt.genSalt(10, (err, salt) => {
                    bycrypt.hash(password, salt, (err, hash) => {
                        if(err){
                            return res.send({success: false, message: 'Error while hashing password'})
                        }

                        const newUser = new User({
                            username,
                            password: hash,
                            email
                        })

                        newUser.save()
                            .then((newReg) => {
                                    console.log('user registered successfully')
                                    
                                    return res.send({success: true, message: 'User registered successfully', id: (newReg._id).toString(), username: newReg.username})
                                }
                            )
                            .catch((err) => {
                                console.log('err saving user info to DB', err)
                                return res.send({success: false, message: 'Error while registering...'})
                            })
                    })
                })
            })
            .catch((err) => {
                console.log('err when finding email from DB', err)
                return res.send({success: false, message: 'Error while registering...'})
            })
    }catch(err){
        console.log('err when handle request body', err)
        return res.send({success: false, message: 'Error while registering user...'})
    }
}

const signIn = (req, res) => {
    try{
        console.log('get signin request')
        const { body } = req
        const { email, password } = body

        User.findOne({email: email})
            .then((response) => {
                if(!response) return res.send({success: false, message: 'User Not Found'})
                
                console.log('found user, comparing passwords')
                bycrypt.compare(password, response.password, (err, isMatch) => {
                    if(err|| !isMatch){
                        console.log('incorrect password')
                        return res.send({success: false, message: 'Incorrect Password'})
                    }
                    let userId = (response._id).toString();
                    let userName = response.username;
                    
                    console.log('login success')
                    return res.send({success: true, id: userId, username:userName})
                })
                
                
            })
            .catch((err) => {
                console.log('err when finding email from DB', err)
                return res.send({success: false, message: 'Error while logging in...'})
            })
    }
    catch(e){
        console.log('err when handle request body', e)
        return res.send({success: false, message: 'Error while logging in...'})
    }
}



module.exports = {
    testAuthController,
    signUp,
    signIn
}