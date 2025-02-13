import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Quotes.css";

const QuoeteManagementApproval = (quotePriceData) => {
  const [formData, setFormData] = useState({
    from: "",
    managerEmail: "",
    totalPrice: "",
    description: "",
    base64data: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [dots, setDots] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let interval = null;

    if (isSending) {
      interval = setInterval(() => {
        setDots((dots) => {
          if (dots.length === 6) {
            return "";
          }
          return dots + ".";
        });
      }, 500);
    } else {
      clearInterval(interval);
      setDots("");
    }

    return () => clearInterval(interval);
  }, [isSending]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cartItemsString = quotePriceData.quotePriceData.cartItems
    .map(
      (item, idx) =>
        `
    ${idx + 1}. ${item.name} -Item: ${item.cartProducts[0].attrs} - Quantity: ${item.cartProducts[0].quantity
        } - Unit price: $${item.cartProducts[0].price}\n `
    )
    .join("");

  const receiverEmail = quotePriceData.quotePriceData.managerEmail?.split("@")[1];
  const senderEmail = quotePriceData.quotePriceData.email?.split("@")[1]
  const base64data = quotePriceData.quotePriceData.base64Data.base64data

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const formDataToSend = new FormData();
    formDataToSend.append(
      "from",
      `${quotePriceData.quotePriceData.name} <${quotePriceData.quotePriceData.email}>`
    );
    formDataToSend.append(
      "managerEmail",
      `${quotePriceData.quotePriceData.managerEmail}`
    );
    formDataToSend.append(
      "totalPrice",
      `${(quotePriceData.quotePriceData.cartSubtotal).toFixed(2)}`
    );
    formDataToSend.append("description", `${cartItemsString}`);
    formDataToSend.append("base64data", `${base64data}`);
    try {
      setIsSending(true);
      const res = await axios.post(
        "/api/sendemail/managementApproval",
        formDataToSend,

        config
      );
      setIsSending(false);
      setFormData({
        from: "",
        totalPrice: "",
        managerEmail: "",
        description: "",
      });
      setSuccessMessage("Email sent successfully");

      setTimeout(() => {
        setSuccessMessage(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="container email-cart-btn">
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group d-flex justify-content-center email_cart_btn_wrapper">
          <button
            className="btn btn-success p-1 ps-3 pe-3 download_cart_btn rounded"
            disabled={
              isSending ||
              successMessage ||
              receiverEmail !== senderEmail ||
              quotePriceData.quotePriceData.cartItems.length === 0
            }
            style={{ width: "100%", maxWidth: "200px", fontSize: "12px", background: "#999A47", border: "none", color: "#521712" }}
          >
            {isSending ? `Sending${dots}` : "Email Cart"}
          </button>
        </div>
      </form>
      {successMessage && (
        <div className="alert mt-2 p-1 managementAprroval_alert" role="alert">
          <p className="m-1">The cart has been successfully emailed.</p>
        </div>
      )}
    </div>
  );
};

export default QuoeteManagementApproval;
