const User = require('../models/user.model');
const { ApiResponse, ApiError } = require('../../../utils/apiResponse');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const registerUser = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new ApiError(400, 'User already exists'));
        }

        const user = await User.create({ name, email, password, role });

        const token = generateToken(user._id);

        res.status(201).json(new ApiResponse(201, { user, token }, 'User registered successfully'));
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return next(new ApiError(401, 'Invalid credentials'));
        }

        const token = generateToken(user._id);
        user.password = undefined;

        res.status(200).json(new ApiResponse(200, { user, token }, 'Login successful'));
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser };