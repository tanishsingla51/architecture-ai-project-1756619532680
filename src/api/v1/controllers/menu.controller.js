const MenuItem = require('../models/menuItem.model');
const Restaurant = require('../models/restaurant.model');
const { ApiResponse, ApiError } = require('../../../utils/apiResponse');

const addMenuItem = async (req, res, next) => {
    const { restaurantId } = req.params;
    const { name, description, price, category } = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return next(new ApiError(404, 'Restaurant not found'));
        }

        if (restaurant.owner.toString() !== req.user.id) {
            return next(new ApiError(403, 'User not authorized to add menu items to this restaurant'));
        }

        const menuItem = await MenuItem.create({
            name,
            description,
            price,
            category,
            restaurant: restaurantId,
        });

        restaurant.menu.push(menuItem._id);
        await restaurant.save();

        res.status(201).json(new ApiResponse(201, menuItem, 'Menu item added successfully'));
    } catch (error) {
        next(error);
    }
};

const updateMenuItem = async (req, res, next) => {
    const { restaurantId, itemId } = req.params;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return next(new ApiError(404, 'Restaurant not found'));
        }

        if (restaurant.owner.toString() !== req.user.id) {
            return next(new ApiError(403, 'User not authorized to update menu items for this restaurant'));
        }

        const menuItem = await MenuItem.findByIdAndUpdate(itemId, req.body, {
            new: true,
            runValidators: true,
        });

        if (!menuItem) {
            return next(new ApiError(404, 'Menu item not found'));
        }

        res.status(200).json(new ApiResponse(200, menuItem, 'Menu item updated successfully'));
    } catch (error) {
        next(error);
    }
};

const deleteMenuItem = async (req, res, next) => {
    const { restaurantId, itemId } = req.params;
    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return next(new ApiError(404, 'Restaurant not found'));
        }

        if (restaurant.owner.toString() !== req.user.id) {
            return next(new ApiError(403, 'User not authorized to delete menu items from this restaurant'));
        }

        const menuItem = await MenuItem.findByIdAndDelete(itemId);
        if (!menuItem) {
            return next(new ApiError(404, 'Menu item not found'));
        }

        // Remove item from restaurant's menu array
        await Restaurant.findByIdAndUpdate(restaurantId, { $pull: { menu: itemId } });

        res.status(200).json(new ApiResponse(200, {}, 'Menu item deleted successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { addMenuItem, updateMenuItem, deleteMenuItem };