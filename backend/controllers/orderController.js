import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    discountPrice,
    couponCode,
    totalPrice,
  } = req.body;

  // 1. KIỂM TRA ĐẦU VÀO CƠ BẢN
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("Không có sản phẩm nào trong đơn hàng");
  }
  if (
    !shippingAddress ||
    !shippingAddress.address ||
    !shippingAddress.fullName ||
    !shippingAddress.phone
  ) {
    res.status(400);
    throw new Error("Vui lòng cung cấp đầy đủ thông tin giao hàng");
  }
  if (!paymentMethod) {
    res.status(400);
    throw new Error("Vui lòng chọn phương thức thanh toán");
  }

  // 2. KIỂM TRA TỒN KHO
  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((item) => item.product) },
  });

  for (const item of orderItems) {
    const productFromDB = itemsFromDB.find(
      (p) => p._id.toString() === item.product
    );
    if (!productFromDB) {
      res.status(404);
      throw new Error(`Không tìm thấy sản phẩm: ${item.name}`);
    }

    if (productFromDB.stock < item.qty) {
      res.status(400);
      throw new Error(
        `Sản phẩm "${item.name}" không đủ hàng. (Chỉ còn ${productFromDB.stock} sản phẩm)`
      );
    }
  }

  // 3. TẠO ĐƠN HÀNG
  try {
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.product,
        _id: undefined,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      discountPrice: discountPrice || 0,
      couponCode: couponCode || null,
      totalPrice: totalPrice,
    });

    // 4. LƯU ĐƠN HÀNG
    const createdOrder = await order.save();

    // 5. TRỪ TỒN KHO
    const bulkOps = orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.qty } },
      },
    }));
    await Product.bulkWrite(bulkOps);

    console.log(`✅ Đơn hàng ${createdOrder._id} đã tạo VÀ ĐÃ TRỪ KHO.`);
    res.status(201).json(createdOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi tạo đơn hàng", error: error.message });
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  // --- (SỬA DÙNG 'fullName') ---
  const order = await Order.findById(req.params.id).populate(
    "user",
    "fullName email"
  );

  if (order) {
    if (
      order.user._id.toString() === req.user._id.toString() ||
      req.user.role === "admin"
    ) {
      res.status(200).json(order);
    } else {
      res.status(403);
      throw new Error("Không có quyền truy cập đơn hàng này");
    }
  } else {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }
});

const getOrders = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate, isPaid, view } = req.query; // Thêm 'view'

    let filter = {};

    // 1. Lọc theo ngày
    if (startDate && endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: new Date(startDate), $lte: endOfDay };
    }

    // 2. Lọc theo loại hiển thị (view)
    if (view === "revenue") {
      filter.$or = [{ isPaid: true }, { isDelivered: true }];
    } else if (isPaid) {
      // Lọc thường (nếu chỉ muốn lọc isPaid)
      filter.isPaid = isPaid === "true";
    }

    const orders = await Order.find(filter)
      .populate("user", "id fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500);
    throw new Error("Lỗi server khi lấy danh sách đơn hàng");
  }
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    try {
      const bulkOps = order.orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: item.qty } },
        },
      }));

      if (bulkOps.length > 0) {
        await Product.bulkWrite(bulkOps);
      }
      console.log(`✅ Đã hoàn kho cho đơn hàng ${req.params.id}.`);
    } catch (stockError) {
      console.error(
        `❌ Lỗi khi hoàn kho cho đơn hàng ${req.params.id}:`,
        stockError
      );
    }
    // 3. Xóa đơn hàng
    await Order.deleteOne({ _id: order._id });
    res
      .status(200)
      .json({ message: "Đơn hàng đã được xóa (và đã hoàn kho nếu có thể)" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy đơn hàng");
  }
});

const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};
    if (startDate && endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: new Date(startDate), $lte: endOfDay } };
    }

    const revenueFilter = {
      ...dateFilter,
      $or: [{ isPaid: true }, { isDelivered: true }],
    };

    const kpiStatsPromise = Order.aggregate([
      { $match: revenueFilter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const chartDataPromise = Order.aggregate([
      { $match: revenueFilter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dailyRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topProductsPromise = Order.aggregate([
      { $match: revenueFilter },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          totalQuantitySold: { $sum: "$orderItems.qty" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 },
    ]);

    const recentOrdersPromise = Order.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "fullName");

    const totalUsersPromise = User.countDocuments({ role: "customer" });
    const totalProductsPromise = Product.countDocuments();

    const [
      kpiStats,
      chartData,
      topProducts,
      recentOrders,
      totalUsers,
      totalProducts,
    ] = await Promise.all([
      kpiStatsPromise,
      chartDataPromise,
      topProductsPromise,
      recentOrdersPromise,
      totalUsersPromise,
      totalProductsPromise,
    ]);

    const stats = {
      kpi: {
        totalOrders: kpiStats.length > 0 ? kpiStats[0].totalOrders : 0,
        totalRevenue: kpiStats.length > 0 ? kpiStats[0].totalRevenue : 0,
        totalUsers: totalUsers,
        totalProducts: totalProducts,
      },
      chartData: chartData,
      topProducts: topProducts,
      recentOrders: recentOrders,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500);
    throw new Error("Không thể lấy dữ liệu thống kê: " + error.message);
  }
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getOrders,
  updateOrderToDelivered,
  deleteOrder,
  getDashboardStats,
};
