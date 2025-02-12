const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const ObjectId = require("mongodb").ObjectId;
const mongoose = require("mongoose");
const Decimal = require('decimal.js');
const cron = require("node-cron");
const { sendNotification } = require("./sendEmailController")

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ $or: [{ user: ObjectId(req.user._id) }, { secondOwnerId: (req.user._id) }, { createdUserId: (req.user._id) }] });
    res.send(orders);
  } catch (error) {
    next(error);
  }
};

const getUserOrdersByCompany = async (req, res, next) => {
  try {
    const orders = await Order.find({ userCompany: (req.params.userCompany) });
    res.send(orders);
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "-password -isAdmin -__v -createdAt -updatedAt")
      .orFail();
    res.send(order);
  } catch (err) {
    next(err);
  }
};

const getOrdersInvNo = async (req, res, next) => {
  try {
    const orders = await Order.find({}, "invoiceNumber").sort({
      createdAt: "asc",
    });
    res.send(orders);
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const {
      cartItems,
      orderTotal,
      paymentMethod,
      purchaseNumber,
      invoiceNumber,
      orderNote,
      deliverySite,
      storeId,
      userName,
      userCompany,
      dueDays,
      createdUserId,
      createdUserName,
      deliveryAddress
    } = req.body;

    if (
      !cartItems ||
      !orderTotal ||
      !paymentMethod ||
      !purchaseNumber ||
      !invoiceNumber ||
      !deliverySite ||
      !storeId ||
      !userName ||
      !userCompany ||
      !dueDays ||
      !createdUserId ||
      !createdUserName ||
      !deliveryAddress
    ) {
      return res.status(400).send("All inputs are required");
    }

    const order = new Order({
      user: ObjectId(storeId),
      userName: userName,
      userCompany: userCompany,
      orderTotal: orderTotal,
      balance: orderTotal.cartSubtotal,
      cartItems: cartItems,
      paymentMethod: paymentMethod,
      purchaseNumber: purchaseNumber,
      invoiceNumber: invoiceNumber,
      orderNote: orderNote,
      deliverySite: deliverySite,
      dueDays: dueDays,
      createdUserId: createdUserId,
      createdUserName: createdUserName,
      deliveryAddress: deliveryAddress
    });
    const createdOrder = await order.save();

    res.status(201).send(createdOrder);
  } catch (err) {
    next(err);
  }
};


const adminCreateOrder = async (req, res, next) => {
  try {
    const {
      cartItems,
      orderTotal,
      paymentMethod,
      purchaseNumber,
      invoiceNumber,
      orderNote,
      deliverySite,
      user_id,
      userName,
      userCompany,
      dueDays
    } = req.body;
    if (
      !cartItems ||
      !orderTotal ||
      !paymentMethod ||
      !purchaseNumber ||
      !invoiceNumber ||
      !deliverySite ||
      !user_id ||
      !userName ||
      !userCompany ||
      !dueDays
    ) {
      return res.status(400).send("All inputs are required");
    }
    const order = new Order({
      user: ObjectId(user_id),
      userName: userName,
      userCompany: userCompany,
      orderTotal: orderTotal,
      balance: orderTotal.cartSubtotal,
      cartItems: cartItems,
      paymentMethod: paymentMethod,
      purchaseNumber: purchaseNumber,
      invoiceNumber: invoiceNumber,
      orderNote: orderNote,
      deliverySite: deliverySite,
      dueDays: dueDays
    });
    const createdOrder = await order.save();
    res.status(201).send(createdOrder);
  } catch (err) {
    next(err);
  }
};

const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const markAsBackOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { backOrder: req.body.backOrder });

    res.json({
      updatedOrder,
      message: `Back Order Marked ${req.body.backOrder}`,
    });
  } catch (err) {
    next(err);
  }
};

const markAsPaid = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { isPaid: req.body.isPaid, balance: req.body.balance, paidAt: req.body.paidAt });
    res.json({
      updatedOrder,
      message: `Order Marked As ${req.body.isPaid}`,
    });
  } catch (err) {
    next(err);
  }
};

const markInvAsSent = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    order.invSent = true;
    order.invSentAt = Date.now();

    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const markAsSentToCtl = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    order.isSentToCtl = true;

    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();

    for (const item of order.cartItems) {
      const productId = item.productId;
      const stockId = item.cartProducts[0]._id;

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error(`Product with id ${productId} not found.`);
      }

      const stockItem = product.stock.id(stockId);
      if (!stockItem) {
        throw new Error(
          `Stock item ${stockId} not found in product ${productId}.`
        );
      }
      // console.log(order.isDelivered);
      if (order.isDelivered === false) {
        stockItem.count -= Number(item.cartProducts[0].suppliedQty);
        stockItem.sales += Number(item.cartProducts[0].suppliedQty);
      }

      await product.save();
    }

    if (req.body.trackLink) {
      order.trackLink = req.body.trackLink;
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json({
      updatedOrder,
      message: "Order has been shipped",
    });
  } catch (err) {
    next(err);
  }
};

const updateDeliverySite = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();

    if (req.body.deliverySite) {
      order.deliverySite = req.body.deliverySite;
    }

    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const updateInvoiceNumber = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const invoiceNumber = req.body.invoiceNumber;
    if (!orderId || invoiceNumber === undefined) {
      return res.status(400).json({
        error: "Invoice number or orderID not found in the request",
      });
    }
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    } else {
      order.invoiceNumber = invoiceNumber;
    }
    try {
      await order.save();
      res.json({
        message: "Invoice Number updated",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBackOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const suppliedQty = req.body.suppliedQty;
    const price = req.body.price;

    if (!orderId || !suppliedQty || price === undefined) {
      return res.status(400).json({
        error: "Order ID, supplied quantity, or price not found in the request",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    let itemIndex = -1;
    if (order.cartItems) {
      order.cartItems.forEach((item, i) => {
        const product = item.cartProducts[0];
        if (product && product._id.toString() === req.params.itemId) {
          itemIndex = i;
        }
      });
    }

    if (itemIndex !== -1) {
      const item = order.cartItems[itemIndex].cartProducts[0];
      if (suppliedQty !== item.quantity) {
        order.backOrder = true;
      }

      if (suppliedQty > item.quantity) {
        return res.status(400).json({
          error: "Supplied quantity cannot exceed the current quantity",
        });
      }

      item.price = price;
      item.suppliedQty = suppliedQty;
      item.backOrder = item.quantity - item.suppliedQty;

      let newNetSubtotal = new Decimal(0);
      order.cartItems.forEach(cartItem => {
        cartItem.cartProducts.forEach(product => {
          newNetSubtotal = newNetSubtotal.plus(new Decimal(product.price).mul(product.suppliedQty));
        });
      });

      const roundedNewNetSubtotal = newNetSubtotal.toDecimalPlaces(2, Decimal.ROUND_DOWN);

      let totalTaxAmount = (function calculateTaxAdjustment(baseValue) {
        const taxRate = new Decimal(10);
        const hundred = new Decimal(100);
        const rawTax = baseValue.mul(taxRate).div(hundred);
        return rawTax.toDecimalPlaces(2, Decimal.ROUND_DOWN);
      })(roundedNewNetSubtotal);

      const calculateTotalAmount = (subtotal, tax) => {
        const intermediateTotal = subtotal.plus(tax);
        return intermediateTotal.toDecimalPlaces(2);
      };

      const roundedFinalTotalAmount = calculateTotalAmount(roundedNewNetSubtotal, totalTaxAmount);

      order.orderTotal.cartSubtotal = roundedFinalTotalAmount.toNumber();
      order.orderTotal.taxAmount = totalTaxAmount.toNumber();
      order.balance = roundedFinalTotalAmount.toNumber();

      try {
        await order.save();
        res.json({
          message: "Order updated successfully.",
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(404).json({
        message: "Item not found",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrderItem = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json({
        error: "Order ID not found in the request",
      });
    }
    const { isAdmin, isSuperAdmin, email } = req.user;

    const order = await Order.findById(orderId);

    if (isAdmin && !isSuperAdmin) {
      const editHistoryEntry = {
        operator: email,
        editedAt: new Date(),
        function: 'delete order item'
      };

      order.editeHistroys.push(editHistoryEntry);
      await order.save();

      return res.status(403).json({ message: "You do not have permission to delete orders." });
    }

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    let itemIndex = -1;
    if (order.cartItems) {
      order.cartItems.forEach((item, i) => {
        const product = item.cartProducts[0];
        if (product && product._id.toString() === req.params.itemId) {
          itemIndex = i;
        }
      });
    }
    if (itemIndex !== -1) {
      const item = order.cartItems[itemIndex].cartProducts[0];
      order.cartItems.splice(itemIndex, 1);

      order.orderTotal.itemsCount -= item.suppliedQty;
      order.orderTotal.cartSubtotal -= item.suppliedQty * item.price * 1.1;

      try {
        await order.save();
        res.json({
          message: "Item Deleted",
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(404).json({
        message: "Item not found",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrderNote = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();

    if (req.body.orderNote) {
      order.orderNote = req.body.orderNote;
    }

    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const updateApprovedPO = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    if (req.body.poNumber) {
      const poNumber = order.purchaseNumber
      order.purchaseNumber = req.body.poNumber;
      order.approvedPONumber = poNumber;
    }
    if (req.body.date) {
      order.approvedDate = req.body.date
    }
    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const updateSecondOwner = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();

    if (req.body.secondOwnerId) {
      order.secondOwnerId = ObjectId(req.body.secondOwnerId);
      order.secondOwnerSite = req.body.secondOwnerSite;
    }

    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};


const updateAdminNote = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();

    if (req.body.adminNote) {
      order.adminNote = req.body.adminNote;
    }

    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { isAdmin, email } = req.user;
    const order = await Order.findById(req.params.orderId).orFail();
    if (!isAdmin) {
      const editHistoryEntry = {
        operator: email,
        editedAt: new Date(),
        function: 'delete order'
      };
      order.editeHistroys.push(editHistoryEntry);
      await order.save();
      return res.status(403).json({ message: "You do not have permission to delete orders." });
    }
    await order.remove();
    res.send("order deleted");
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "-password")
      .sort({ createdAt: "asc" });
    //console.log(orders);
    res.send(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderForAnalysis = async (req, res, next) => {
  try {
    const start = new Date(req.params.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(req.params.date);
    end.setHours(23, 59, 59, 999);

    const order = await Order.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    }).sort({ createdAt: "asc" });
    res.send(order);
  } catch (err) {
    next(err);
  }
};

const orderSalesToProduct = async (req, res, next) => {
  const errors = [];
  let processedCount = 0;
  try {
    const orders = await Order.find({}).sort({ createdAt: "asc" });
    for (const order of orders) {
      for (const item of order.cartItems) {
        try {
          if (order.isDelivered === true) {
            const productId = item.productId;
            const stockId = item.cartProducts[0]._id;
            const stockMnasku = item.cartProducts[0].mnasku;

            const product = await Product.findById(productId);
            if (!product) {
              throw new Error(`Product with id ${productId} not found.`);
            }

            const stockItem = product.stock.find(s => s.mnasku === stockMnasku);
            if (!stockItem) {
              throw new Error(`Stock item with mnasku ${stockMnasku} not found in product ${productId}.`);
            }

            stockItem.sales += Number(item.cartProducts[0].suppliedQty);
            await product.save();
            processedCount++;
          }

        } catch (error) {
          errors.push(error.message);
          console.error(error);
        }
      }
    }
    console.log(`Order processing complete. ${processedCount} products have been processed.`); // Terminal message
    res.json({
      message: 'Order processing complete with errors.',
      errors: errors,
    });
  } catch (err) {
    next(err);
  }
}

const getSupplier = async (req, res) => {
  try {
    const results = await Order.aggregate([
      { $unwind: "$cartItems" },
      { $unwind: "$cartItems.cartProducts" },
      {
        $lookup: {
          from: "products",
          localField: "cartItems.cartProducts.mnasku",
          foreignField: "stock.mnasku",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.supplier"
        }
      },
      {
        $project: {
          _id: 0,
          supplier: "$_id"
        }
      }
    ]);

    res.json(results);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).send("An error occurred while fetching suppliers.");
  }
};


module.exports = {
  getUserOrders,
  getOrder,
  getUserOrdersByCompany,
  getOrdersInvNo,
  createOrder,
  adminCreateOrder,
  updateOrderToPaid,
  markAsBackOrder,
  markAsPaid,
  updateOrderToDelivered,
  markInvAsSent,
  updateOrderNote,
  updateSecondOwner,
  updateAdminNote,
  updateDeliverySite,
  getOrders,
  getOrderForAnalysis,
  updateBackOrder,
  updateInvoiceNumber,
  deleteOrderItem,
  deleteOrder,
  orderSalesToProduct,
  getSupplier,
  updateApprovedPO,
  markAsSentToCtl
};
