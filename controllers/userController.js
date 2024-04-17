
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js';
import generatedToken from '../utils/generatedToken.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import HomeSchema from '../models/homeModel.js';



// @desc Auth user/set token
// route Post /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check the user and password match
    if (user && await bcrypt.compare(password, user.password)) {
        generatedToken(res, user.id); 
        res.status(201).json({
            id: user.id, 
            email: user.email,
            name: user.username
        });
    } else {
        res.status(400);
        throw new Error('Invalid email or password');
    }
});


// @desc register user
// route Post /api/users/register
// @access Public
const registerUser = asyncHandler(async (req,res) => {
    const {
        username, password, email, first_name, last_name, logo, company_name,
        address, communication, role, is_active, team_name, channel_ptn_id, contact_number
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

      // Hash password
      const salt = await bcrypt.genSalt(10);  // 10 rounds is generally enough, more rounds are more secure but slower
      const hashedPassword = await bcrypt.hash(password, salt);
  

    // Create new user with all the fields
    const user = await User.create({
        username, password:hashedPassword, email, first_name, last_name, logo, company_name,
        address, communication, role, is_active, team_name, channel_ptn_id, contact_number
    });

    if (user) {
        const token = generatedToken(res,user.id);  // Assuming generatedToken function returns a token

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token  // Send the token as part of the response
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});
    


// @desc logout user
// route Post /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req,res) => {

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
})

// @desc get user profile
// route Get /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req,res) => {
    const user = await User.findByPk(req.user.id);

    if(user){
        res.json({
            id:user.id,
            name:user.username,
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
    const user = await User.findByPk(req.user.id)

    if(user){
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password
        }

        const updateUser = await user.save()

        res.json({
            id:updateUser.id,
            name:updateUser.username,
            email:updateUser.email
        })
    }
    else{
        res.status(404)
        throw new Error('User not found')
    }
    res.status(200).json({message:'Update User Profile'})
})


const refreshToken = asyncHandler(async (req,res) => {
    const refreshToken = req.cookies.refreshToken;
    

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        generatedToken(res, decoded.userId);  // Reissue both tokens
        res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
})


const homeBanner = asyncHandler(async(req ,res) => {
    const {
        project_name, redirect_link, banner_img, is_active, created_at
    } = req.body;

    const homebannerDetails = await HomeSchema.create({
        project_name, redirect_link, banner_img, is_active, created_at
    });
    if (homebannerDetails) {
        res.status(201).json(homebannerDetails);
    } else {
        res.status(400);
        throw new Error('Invalid data');
    }
})


export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    refreshToken,
    homeBanner
}