const express = require('express');
const {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
} = require('../controllers/restaurant.controller');
const { addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menu.controller');
const { getRestaurantOrders } = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const {
    createRestaurantValidator,
    createMenuItemValidator,
    restaurantIdValidator,
    menuItemIdValidator
} = require('../validators/restaurant.validator');

const router = express.Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Protected routes (require login)
router.use(protect);

// Restaurant Owner routes
router.post('/', authorize('restaurantOwner'), createRestaurantValidator, createRestaurant);
router.put('/:id', authorize('restaurantOwner'), updateRestaurant);
router.delete('/:id', authorize('restaurantOwner'), deleteRestaurant);

// Menu item routes
router.post('/:restaurantId/menu', authorize('restaurantOwner'), restaurantIdValidator, createMenuItemValidator, addMenuItem);
router.put('/:restaurantId/menu/:itemId', authorize('restaurantOwner'), menuItemIdValidator, updateMenuItem);
router.delete('/:restaurantId/menu/:itemId', authorize('restaurantOwner'), menuItemIdValidator, deleteMenuItem);

// Restaurant order routes
router.get('/:restaurantId/orders', authorize('restaurantOwner'), restaurantIdValidator, getRestaurantOrders);

module.exports = router;