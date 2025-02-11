const express = require("express");
const router = express.Router();
const {
  managementApproval,
  newOrderRemind,
  sendInvoice,
  sendProformaInvoice,
  deliveryNotice,
  sendRequest,
  sendNotification,
  sendOrderToCtl
} = require("../controllers/sendEmailController");
const { verifyIsLoggedIn } = require("../middleware/verifyAuthToken");

router.post("/sendRequest", sendRequest);

router.use(verifyIsLoggedIn);

router.post("/managementApproval", managementApproval);
router.post("/newOrderRemind", newOrderRemind);
router.post("/emailInv", sendInvoice);
router.post("/emailNotification", sendNotification);
router.post("/emailProformaInv", sendProformaInvoice);
router.post("/emailShipping", deliveryNotice);
router.post("/emailToCtl", sendOrderToCtl);

module.exports = router;
