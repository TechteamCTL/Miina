const mongoose = require("mongoose");
const User = require("./UserModel");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: User,
    },
    secondOwnerId: {
      type: String,
      required: false,
    },
    secondOwnerSite: {
      type: String,
      required: false,
    },
    createdUserId: {
      type: String,
      required: false,
    },
    createdUserName: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: true,
    },
    userCompany: {
      type: String,
      required: true,
    },
    orderTotal: {
      itemsCount: { type: Number, required: true },
      cartSubtotal: { type: Number, required: true },
      taxAmount: { type: Number, required: false },
    },
    balance: { type: Number, required: true },
    cartItems: [
      {
        productId: { type: String, required: false },
        quoteId: { type: String, required: false },
        name: { type: String, required: true },
        saleunit: {
          type: Number,
          required: true,
        },
        cartProducts: [
          {
            purchaseprice: { type: Number, required: false },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            suppliedQty: { type: Number, required: true },
            backOrder: { type: Number, required: false },
            count: { type: Number, required: false },
            mnasku: { type: String, required: false },
            suppliersku: { type: String, required: false },
            attrs: { type: String, required: true },
            color: { type: String, required: false },
            size: { type: String, required: false },
          },
        ],
        image: { type: String, required: true },
      },
    ],
    paymentMethod: {
      type: String,
      required: true,
    },
    purchaseNumber: {
      type: String,
      required: false,
    },
    approvedPONumber: {
      type: String,
      required: false,
    },
    approvedDate: {
      type: Date,
      required: false,
    },
    invoiceNumber: {
      type: String,
      required: false,
    },
    dueDays: {
      type: Number,
      required: false,
    },
    orderNote: {
      type: String,
      required: false,
    },
    adminNote: {
      type: String,
      required: false,
    },
    deliverySite: {
      type: String,
      required: false,
    },
    deliveryAddress: {
      type: String,
      required: false,
    },
    transactionResult: {
      status: { type: String },
      createTime: { type: String },
      amount: { type: Number },
    },
    paidAt: {
      type: Date,
    },
    trackLink: {
      type: String,
      required: true,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    invSent: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSentToCtl: {
      type: Boolean,
      required: true,
      default: false
    },
    invSentAt: {
      type: Date,
    },
    invHasSent: {
      type: Number,
      required: false,
    },
    proformaInvSent: {
      type: Boolean,
      default: false,
    },
    proformaInvSentAt: {
      type: Date,
      required: false,
    },
    proformaInvHasSent: {
      type: Number,
      required: false,
    },
    backOrder: {
      type: Boolean,
      required: false,
      default: false,
    },
    isPaid: {
      type: Boolean,
      required: false,
      default: false,
    },
    editeHistroys: [
      {
        operator: {
          type: String,
          required: false,
        },
        editedAt: {
          type: Date,
          required: false,
        },
        function: {
          type: String,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
