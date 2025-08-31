const express = require('express');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
} = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { createOrderValidator, updateOrderStatusValidator } = require('../validators/order.validator');

const router = express.Router();

// Protect all routes below
router.use(protect);

// Customer routes
router.post('/', authorize('customer'), createOrderValidator, createOrder);
router.get('/', getMyOrders);
router.get('/:orderId', getOrderById);

// Restaurant Owner routes
router.put('/:orderId/status', authorize('restaurantOwner'), updateOrderStatusValidator, updateOrderStatus);

module.exports = router;