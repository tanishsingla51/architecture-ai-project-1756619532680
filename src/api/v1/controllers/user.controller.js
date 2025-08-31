const User = require('../models/user.model');
const { ApiResponse, ApiError } = require('../../../utils/apiResponse');

const getMyProfile = async (req, res, next) => {
    try {
        // req.user is populated by the 'protect' middleware
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }
        res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
    } catch (error) {
        next(error);
    }
};

const updateMyProfile = async (req, res, next) => {
    try {
        const { name, address, phone } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { name, address, phone }, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }
        res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { getMyProfile, updateMyProfile };