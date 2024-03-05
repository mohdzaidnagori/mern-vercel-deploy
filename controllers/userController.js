
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js';
import generatedToken from '../utils/generatedToken.js';



// @desc Auth user/set token
// route Post /api/users/auth
// @access Public
const authUser = asyncHandler(async (req,res) => {
     const { email , password} = req.body
    
     const user = await User.findOne({email})
     console.log(user);
     if(user && user.matchPassword(password)){
        generatedToken(res, user._id)
        res.status(201).json({
            _id:user._id,
            email:user.email,
            name:user.name
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid email or password')
    }
})


// @desc register user
// route Post /api/users/register
// @access Public
const registerUser = asyncHandler(async (req,res) => {
    const {name , email , password} = req.body;

    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400);
        throw new Error('User already exists')
    }
    const user = await User.create({
       name,email,password
    })

    if(user){
        generatedToken(res, user._id)
        res.status(201).json({
            _id:user._id,
            email:user.email,
            name:user.name
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid user data')
    }
    
})


// @desc logout user
// route Post /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req,res) => {

    res.cookie('jwt', '', {
        httpOnly:true,
        expires:new Date(0)
    })
    res.status(200).json({message:'Logout User'})
})

// @desc get user profile
// route Get /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id);

    if(user){
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email
        });
    }
    else{
        res.status(404)
        throw new Error('User not found')
    }
  
})

// @desc update user profile
// route Put /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id)

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password
        }

        const updateUser = await user.save()

        res.json({
            _id:updateUser._id,
            name:updateUser.name,
            email:updateUser.email
        })
    }
    else{
        res.status(404)
        throw new Error('User not found')
    }
    res.status(200).json({message:'Update User Profile'})
})


export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}