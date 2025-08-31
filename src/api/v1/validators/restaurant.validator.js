const { body, param, validationResult } = require('express-validator');
const { ApiError } = require('../../../utils/apiResponse');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, 'Validation Error', errors.array()));
    }
    next();
};

const createRestaurantValidator = [
    body('name').notEmpty().withMessage('Restaurant name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('cuisine').notEmpty().withMessage('Cuisine type is required'),
    validate,
];

const createMenuItemValidator = [
    body('name').notEmpty().withMessage('Menu item name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    validate,
];

const restaurantIdValidator = [
    param('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
    validate
];

const menuItemIdValidator = [
    param('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
    param('itemId').isMongoId().withMessage('Invalid menu item ID'),
    validate
];

module.exports = {
    createRestaurantValidator,
    createMenuItemValidator,
    restaurantIdValidator,
    menuItemIdValidator
};