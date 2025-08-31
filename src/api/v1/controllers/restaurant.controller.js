const Restaurant = require('../models/restaurant.model');
const { ApiResponse, ApiError } = require('../../../utils/apiResponse');

const createRestaurant = async (req, res, next) => {
    try {
        const { name, description, address, cuisine } = req.body;
        const owner = req.user.id;

        const restaurant = await Restaurant.create({ name, description, address, cuisine, owner });

        res.status(201).json(new ApiResponse(201, restaurant, 'Restaurant created successfully'));
    } catch (error) {
        next(error);
    }
};

const getAllRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find().populate('owner', 'name email');
        res.status(200).json(new ApiResponse(200, restaurants));
    } catch (error) {
        next(error);
    }
};

const getRestaurantById = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('menu');
        if (!restaurant) {
            return next(new ApiError(404, 'Restaurant not found'));
        }
        res.status(200).json(new ApiResponse(200, restaurant));
    } catch (error) {
        next(error);
    }
};

const updateRestaurant = async (req, res, next) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return next(new ApiError(404, 'Restaurant not found'));
        }

        // Check if the logged-in user is the owner
        if (restaurant.owner.toString() !== req.user.id) {
            return next(new ApiError(403, 'User not authorized to update this restaurant'));
        }

        restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(new ApiResponse(200, restaurant, 'Restaurant updated successfully'));
    } catch (error) {
        next(error);
    }
};

const deleteRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return next(new ApiError(404, 'Restaurant not found'));
        }

        // Check if the logged-in user is the owner
        if (restaurant.owner.toString() !== req.user.id) {
            return next(new ApiError(403, 'User not authorized to delete this restaurant'));
        }

        await restaurant.deleteOne();

        res.status(200).json(new ApiResponse(200, {}, 'Restaurant deleted successfully'));
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};