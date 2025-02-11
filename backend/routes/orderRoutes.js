// orderRoutes.js

const express = require("express");
const router = express.Router();
const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require("../middleware/verifyAuthToken");
const {
  getUserOrders,
  getUserOrdersByCompany,
  getOrder,
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
  getOrdersInvNo,
  updateBackOrder,
  updateInvoiceNumber,
  deleteOrderItem,
  deleteOrder,
  orderSalesToProduct,
  getSupplier,
  updateApprovedPO,
  markAsSentToCtl
} = require("../controllers/orderController");

// user routes
router.use(verifyIsLoggedIn);
router.get("/", getUserOrders);
router.get("/company:userCompany", getUserOrdersByCompany);
router.get("/user/:id", getOrder);
router.post("/", createOrder);
router.put("/paid/:id", updateOrderToPaid);
router.get("/invoiceNumber", getOrdersInvNo);
router.put("/updateOrderNote/:id", updateOrderNote);
router.put("/updateApprovedPO/:id", updateApprovedPO);
router.put("/updateSecondOwner/:id", updateSecondOwner);

// admin routes
router.use(verifyIsAdmin);
router.get("/supplier", getSupplier);
router.put("/delivered/:id", updateOrderToDelivered);
router.put("/sendInv/:id", markInvAsSent);
router.post("/adminCreateOrder", adminCreateOrder);
router.get("/admin", getOrders);
router.get("/analysis/:date", getOrderForAnalysis);
// router.put("/updateBackOrder/:itemId", updateBackOrder);
router.put("/updateBackOrder/:orderId/:itemId", updateBackOrder);
router.put("/updateInvoiceNumber/:orderId", updateInvoiceNumber);
router.delete("/removeItem/:orderId/:itemId", deleteOrderItem);
router.delete("/delete/:orderId", deleteOrder);
router.put("/deliverySite/:id", updateDeliverySite);
router.put("/updateAdminNote/:id", updateAdminNote);
router.put("/markAsBackOrder/:id", markAsBackOrder);
router.put("/markAsPaid/:id", markAsPaid);
router.put("/orderSalesToProduct", orderSalesToProduct);
router.put("/markAsSendToCtl/:id", markAsSentToCtl);


module.exports = router;
