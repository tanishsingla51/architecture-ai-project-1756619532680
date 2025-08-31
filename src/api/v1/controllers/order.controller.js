const Order = require('../models/order.model');
const MenuItem = require('../models/menuItem.model');
const { ApiResponse, ApiError } = require('../../../utils/apiResponse');

const createOrder = async (req, res, next) => {
    const { restaurantId, items, deliveryAddress } = req.body;

    try {
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
                return next(new ApiError(404, `Menu item with id ${item.menuItem} not found`));
            }
            if (menuItem.restaurant.toString() !== restaurantId) {
                return next(new ApiError(400, 'All items must be from the same restaurant'));
            }
            totalAmount += menuItem.price * item.quantity;
            orderItems.push({
                menuItem: item.menuItem,
                quantity: item.quantity,
                price: menuItem.price,
            });
        }

        const order = await Order.create({
            customer: req.user.id,
            restaurant: restaurantId,
            items: orderItems,
            totalAmount,
            deliveryAddress,
        });

        res.status(201).json(new ApiResponse(201, order, 'Order created successfully'));
    } catch (error) {
        next(error);
    }
};

const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ customer: req.user.id })
            .populate('restaurant', 'name')
            .populate('items.menuItem', 'name price');
        res.status(200).json(new ApiResponse(200, orders));
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('restaurant', 'name address')
            .populate('customer', 'name email')
            .populate('items.menuItem', 'name');

        if (!order) {
            return next(new ApiError(404, 'Order not found'));
        }
        
        // Ensure customer can only see their own orders, and owner can see their restaurant's orders
        if (order.customer.toString() !== req.user.id && req.user.role !== 'restaurantOwner') {
            return next(new ApiError(403, 'Not authorized to view this order'));
        }

        res.status(200).json(new ApiResponse(200, order));
    } catch (error) {
        next(error);
    }
};

const getRestaurantOrders = async (req, res, next) => {
    try {
        // This endpoint is for restaurant owners to see their orders
        const orders = await Order.find({ restaurant: req.params.restaurantId })
            .populate('customer', 'name')
            .sort({ createdAt: -1 });
            
        res.status(200).json(new ApiResponse(200, orders, "Orders for restaurant fetched successfully"));
    } catch(error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId).populate('restaurant');
        
        if (!order) {
            return next(new ApiError(404, 'Order not found'));
        }
        
        if (order.restaurant.owner.toString() !== req.user.id) {
            return next(new ApiError(403, 'Not authorized to update this order status'));
        }

        order.status = status;
        await order.save();
        
        res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getRestaurantOrders,
};