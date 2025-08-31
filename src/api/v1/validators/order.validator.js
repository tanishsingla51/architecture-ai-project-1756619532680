const { body, param, validationResult } = require('express-validator');
const { ApiError } = require('../../../utils/apiResponse');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, 'Validation Error', errors.array()));
    }
    next();
};

const createOrderValidator = [
    body('restaurantId').isMongoId().withMessage('Invalid restaurant ID'),
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('items.*.menuItem').isMongoId().withMessage('Invalid menu item ID in order'),
    body('items.*.quantity').isInt({ gt: 0 }).withMessage('Item quantity must be a positive integer'),
    body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
    validate
];

const updateOrderStatusValidator = [
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('status').isIn(['confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled']).withMessage('Invalid status'),
    validate
];

module.exports = { createOrderValidator, updateOrderStatusValidator };