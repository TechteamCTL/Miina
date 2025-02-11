import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  ListGroup,
  Modal,
  Button,
} from "react-bootstrap";
import CartItemForOrderComponent from "../../../components/Cart/CartItemForOrderComponent";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DeliveryNotePrint from "../../../components/Pdfs/DeliveryNotePrint";
import PickingPackingPrint from "../../../components/Pdfs/PickingPackingPrint";
import InvoicePrint from "../../../components/Pdfs/InvoicePrint";
import ProformaInvoicePrint from "../../../components/Pdfs/ProformaInvoicePrint";
import Order from "../../../components/Pdfs/Order";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { emptyCart } from "../../../redux/actions/cartActions";

import styles from "../AdminPagesStyles.module.css";

const OrderDetailsPageComponent = ({
  getOrder,
  getUser,
  markAsDelivered,
  markAsSendToCtl,
  markAsPaid,
  sendInv,
  sendProformaInv,
  updateBackOrder,
  updateInvoiceNumber,
  removeOrderItem,
  getdeliveryBooks,
  adminUpdateDeliverySite,
  sendDeliveryNotice,
  reduxDispatch,
  reOrdertReduxAction,
  updateAdminNote,
  adminCreateOrder,
  fetchProduct,
  updateOrderClientCurrentSku,
  reOrderReduxAction
}) => {
  const { id } = useParams();

  const [order, setOrder] = useState();
  const [refreshOrder, setRefreshOrder] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [userData, setUserData] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [purchaseNumber, setPurchaseNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [createdAt, setCreatedAt] = useState("");
  const [dueDays, setDueDays] = useState();
  const [deliveredAt, setDeliveredAt] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [deliveryBooks, setDeliveryBooks] = useState([]);
  const [adminNote, setAdminNote] = useState("");
  const [isDelivered, setIsDelivered] = useState(false);
  const [invoiceSent, setInvoiceSent] = useState(false);
  const [proformaInvoiceSent, setProformaInvoiceSent] = useState(false);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState();
  const [deliveredButtonDisabled, setdeliveredButtonDisabled] = useState(false);
  const [paidButtonDisabled, setpaidButtonDisabled] = useState(false);
  const [sentInvButtonDisabled, setSentInvButtonDisabled] = useState(false);
  const [sentProformaInvButtonDisabled, setSentProformaInvButtonDisabled] = useState(false);
  const [orderDeliveredButton, setorderDeliveredButton] =
    useState("Mark as sent");
  const [sendToCtlTextBtn, setSendToCtlTextBtn] = useState("Send To CTL Australia");
  const [invSentButton, setInvSentButton] = useState("Send Invoice");
  const [proformaInvSentButton, setProformaInvSentButton] = useState("Send P.Invoice");
  const [orderPaidButton, setorderPaidButton] = useState("Mark as Paid");
  const [cartItems, setCartItems] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editInvoiceNumber, setEditInvoiceNumber] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [selectedDeliverySite, setSelectedDeliverySite] = useState();
  const [editLocation, setEditLocation] = useState(false);
  const [trackLink, setTrackLink] = useState("");
  const [backOrderStatus, setBackOrderStatus] = useState(false);
  const [buttonText, setButtonText] = useState("Create");
  const reOrderItemsCheck = useSelector((state) => state.cart.cartItems);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showProformaInvoice, setShowProformaInvoice] = useState(false);
  const [btnMarkAsPaid, setBtnMarkAsPaid] = useState(false);
  const [sendOrderToCtl, setSendingOrderToCtl] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getUser()
      .then((data) => {
        setUserData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    getOrder(id)
      .then((order) => {
        setOrder(order);
        setCartItems(order.cartItems);
        setUserInfo(order.user);
        setBackOrderStatus(order.backOrder);
        setPaymentMethod(order.paymentMethod);
        setInvoiceNumber(order.invoiceNumber);
        setCreatedAt(order.createdAt);
        setDeliveredAt(order.deliveredAt);
        setPaidAt(order.paidAt);
        setDueDays(order.dueDays);
        setPurchaseNumber(order.purchaseNumber);
        setTrackLink(order.trackLink);
        setSendingOrderToCtl(order.isSentToCtl)
        order.isDelivered
          ? setIsDelivered(order.deliveredAt)
          : setIsDelivered(false);
        order.invSent ? setInvoiceSent(order.invSentAt) : setInvoiceSent(false);
        setCartSubtotal(order.orderTotal.cartSubtotal);
        if (order.orderTotal.taxAmount) {
          setTaxAmount(order.orderTotal.taxAmount);
        }
        setAdminNote(order.adminNote);
        if (order.isDelivered) {
          setorderDeliveredButton("Update Track");
          setdeliveredButtonDisabled(true);
        }
        if (order.invSent) {
          setInvSentButton("Re-send Inv");
          setSentInvButtonDisabled(true);
        }
        if (order.proformaInvSent) {
          setProformaInvSentButton("Re-send Proforma Inv");
          setSentProformaInvButtonDisabled(true);
        }
        if (order.isPaid) {
          setBtnMarkAsPaid(true)
        }
        if (order.balance === 0) {
          setorderPaidButton("Order is Paid");
          setpaidButtonDisabled(true);
        }
        setOrderData(order);
      })
      .catch((er) =>
        console.log(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );
  }, [isDelivered, invoiceSent, id, edit, removed, editLocation, refreshOrder]);

  useEffect(() => {
    if (userInfo?.email) {
      getdeliveryBooks(userInfo?.email)
        .then((deliveryBooks) => setDeliveryBooks(deliveryBooks))
        .catch((err) =>
          console.log(
            err.response.data.message
              ? err.response.data.message
              : err.response.data
          )
        );
    }
  }, [userInfo]);

  const deliverySites = deliveryBooks[0]?.sites;
  const companyAccount = deliveryBooks[0]?.companyAccount;

  useEffect(() => {
    deliverySites &&
      deliverySites.map((site, idx) => {
        return site.name !== ""
          ? orderData.deliverySite?.toUpperCase() === site.name?.toUpperCase()
            ? setSelectedDeliverySite(site)
            : ""
          : "";
      });
  }, [orderData, deliveryBooks]);

  const nonGSTPrice = (cartSubtotal / 1.1).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const GST = ((cartSubtotal / 1.1) * 0.1).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const incGSTPrice = cartSubtotal.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const orderNetAmount = (cartSubtotal - taxAmount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const TAX = taxAmount?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // edit order
  const handleEdit = () => setEdit(true);

  const saveEdit = () => {
    setTimeout(() => {
      setEdit(false);
    }, 500);
  };

  //edit invoice NUmber
  const handleEditInvoiceNumber = () => setEditInvoiceNumber(true);

  const saveEditInvoiceNumber = () => {
    setTimeout(() => {
      setEditInvoiceNumber(false);
    }, 500);
  };
  const handleChangeInvoiceNumber = (e) => {
    setInvoiceNumber(e.target.value);
    updateInvoiceNumber(id, e.target.value);
  };
  const handleChangeEmailAddress = (e) => {
    const email = e.target.value;
    setEmailAddress(email);
  };

  const changeCount = (orderId, itemId, price, suppliedQty) => {
    updateBackOrder(orderId, itemId, price, suppliedQty);
  };
  const changePrice = (orderId, itemId, suppliedQty, price) => {
    updateBackOrder(orderId, itemId, price, suppliedQty);
  };

  const removeFromOrderHandler = (orderId, itemId) => {
    if (window.confirm("Want Remove the Item?")) {
      removeOrderItem(orderId, itemId);
      setRemoved(true);
      setTimeout(() => {
        setRemoved(false);
      }, 500);
    }
  };

  const changeDeliverySite = (e) => {
    deliverySites &&
      deliverySites.map((site, idx) => {
        return site.name !== ""
          ? e.target.value.toUpperCase() === site.name.toUpperCase()
            ? setSelectedDeliverySite(site)
            : ""
          : "";
      });
  };

  const handleEditLocation = () => setEditLocation(true);

  const saveEditLocation = () => {
    adminUpdateDeliverySite(id, selectedDeliverySite?.name);
    setTimeout(() => {
      setEditLocation(false);
    }, 500);
  };

  const openPDFInPopup = async (documentComponent, fileName) => {
    const blob = await pdf(documentComponent).toBlob();
    const url = URL.createObjectURL(blob);

    const width = 1200;
    const height = 800;

    const left = window.innerWidth / 2 - width / 2 + window.screenX;
    const top = window.innerHeight / 2 - height / 2 + window.screenY;

    window.open(
      url,
      "_blank",
      `scrollbars=yes,toolbar=no,location=no,width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const PDFPopupButton = ({ documentComponent, fileName, loadingText }) => (
    <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: "transparent" }}>
      <div className="d-grid gap-2">
        <Button
          className={`p-0 m-0 pe-2 ps-2 w-50 ${styles.btnRedColor}`}
          onClick={() => openPDFInPopup(documentComponent, fileName)}
        >
          {loadingText}
        </Button>
      </div>
    </ListGroup.Item>
  );

  // email invoice to client's account team
  const [base64Data, setBase64Data] = useState([]);

  const generatePdf = async () => {
    try {
      const blob = await pdf(
        <InvoicePrint
          cartItems={cartItems}
          invoiceNumber={invoiceNumber}
          userInfo={userInfo}
          purchaseNumber={purchaseNumber}
          cartSubtotal={cartSubtotal}
          dueDays={dueDays}
          invoiceDate={deliveredAt}
          selectedDeliverySite={selectedDeliverySite}
          companyAccount={companyAccount}
          taxAmount={taxAmount}
          isPaid={btnMarkAsPaid}
        />
      ).toBlob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setBase64Data({
          base64data,
        });
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  const [invData, setInvData] = useState();
  const invBillingAddress = selectedDeliverySite?.billingAddress;

  useEffect(() => {
    generatePdf();
  }, [
    orderData,
    id,
    edit,
    removed,
    editLocation,
    deliveryBooks,
    selectedDeliverySite,
    invBillingAddress,
  ]);

  useEffect(() => {
    setInvData({
      sentInvButtonDisabled,
      billingEmail: deliveryBooks[0]?.billingEmail,
      invoiceNumber: invoiceNumber,
      base64data: base64Data.base64data,
      cartSubtotal,
      purchaseNumber,
    });
  }, [base64Data]);

  const [sendingInv, setSendingInv] = useState(false);
  const [sendingInvManually, setSendingInvManually] = useState(false);

  const sendInvoiceEmail = async (invData) => {
    setSendingInv(true);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const formDataToSend = new FormData();
    formDataToSend.append("billingEmail", `${deliveryBooks[0]?.billingEmail}`);
    formDataToSend.append("purchaseNumber", `${invData.purchaseNumber}`);
    formDataToSend.append("totalPrice", `${invData.cartSubtotal}`);
    formDataToSend.append("invoiceNumber", `${invData.invoiceNumber}`);
    formDataToSend.append("base64data", `${invData.base64data}`);
    formDataToSend.append("orderID", `${id}`);

    try {
      const res = await axios.post(
        "/api/sendemail/emailInv",
        formDataToSend,
        config
      );

      setSendingInv(false);
      setRefreshOrder(!refreshOrder);
      return true;
    } catch (err) {
      console.error(err);
      setSendingInv(false);
      return false;
    }
  };

  const sendInvoiceEmailManually = async (invData) => {
    if (emailAddress && emailAddress.trim() !== "") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailPattern.test(emailAddress));
      if (emailPattern.test(emailAddress)) {
        setSendingInvManually(true);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        const formDataToSend = new FormData();
        formDataToSend.append("billingEmail", `${emailAddress}`);
        formDataToSend.append("purchaseNumber", `${invData.purchaseNumber}`);
        formDataToSend.append("totalPrice", `${invData.cartSubtotal}`);
        formDataToSend.append("invoiceNumber", `${invData.invoiceNumber}`);
        formDataToSend.append("base64data", `${invData.base64data}`);
        formDataToSend.append("orderID", `${id}`);

        try {
          const res = await axios.post(
            "/api/sendemail/emailInv",
            formDataToSend,
            config
          );
          setSendingInvManually(false);
          setRefreshOrder(!refreshOrder);
          return true;
        } catch (err) {
          console.error(err);
          setSendingInvManually(false);
          return false;
        }
      }
    }
  };

  const handleSentInv = async () => {
    if (await sendInvoiceEmail(invData)) {
      sendInv(id)
        .then((res) => {
          if (res) {
            setInvoiceSent(true);
          }
        })
        .catch((er) =>
          console.log(
            er.response.data.message
              ? er.response.data.message
              : er.response.data
          )
        );
    } else {
      setInvSentButton("Error!!!");
    }
  };


  // email proforma invoice to client's account team
  const [base64ProformaData, setBase64ProformaData] = useState([]);

  const generateProformaPdf = async () => {
    try {
      const blob = await pdf(
        <ProformaInvoicePrint
          cartItems={cartItems}
          invoiceNumber={invoiceNumber}
          userInfo={userInfo}
          purchaseNumber={purchaseNumber}
          cartSubtotal={cartSubtotal}
          dueDays={dueDays}
          invoiceDate={createdAt}
          selectedDeliverySite={selectedDeliverySite}
          companyAccount={companyAccount}
          taxAmount={taxAmount}
        />
      ).toBlob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        setBase64ProformaData({
          base64data,
        });
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  const [proformaInvData, setProformaInvData] = useState();

  useEffect(() => {
    generateProformaPdf();
  }, [
    orderData,
    id,
    edit,
    removed,
    editLocation,
    deliveryBooks,
    selectedDeliverySite,
    invBillingAddress,
  ]);

  useEffect(() => {
    setProformaInvData({
      sentProformaInvButtonDisabled,
      billingEmail: deliveryBooks[0]?.billingEmail,
      invoiceNumber: invoiceNumber,
      base64data: base64ProformaData.base64data,
      cartSubtotal,
      purchaseNumber,
    });
  }, [base64ProformaData]);

  const [sendingProformaInv, setSendingProformaInv] = useState(false);

  const sendProformaInvoiceEmail = async (proformaInvData) => {
    setSendingProformaInv(true);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const formDataToSend = new FormData();
    formDataToSend.append("billingEmail", `${deliveryBooks[0]?.billingEmail}`);
    formDataToSend.append("purchaseNumber", `${proformaInvData.purchaseNumber}`);
    formDataToSend.append("totalPrice", `${proformaInvData.cartSubtotal}`);
    formDataToSend.append("invoiceNumber", `${proformaInvData.invoiceNumber}`);
    formDataToSend.append("base64data", `${proformaInvData.base64data}`);
    formDataToSend.append("orderID", `${id}`);

    try {
      const res = await axios.post(
        "/api/sendemail/emailProformaInv",
        formDataToSend,
        config
      );
      setSendingProformaInv(false);
      setRefreshOrder(!refreshOrder);
      return true;
    } catch (err) {
      console.error(err);
      setSendingProformaInv(false);
      return false;
    }
  };

  const handleSentProformaInv = async () => {
    if (await sendProformaInvoiceEmail(proformaInvData)) {
      sendProformaInv(id)
        .then((res) => {
          if (res) {
            setProformaInvoiceSent(true);
          }
        })
        .catch((er) =>
          console.log(
            er.response.data.message
              ? er.response.data.message
              : er.response.data
          )
        );
    } else {
      setProformaInvSentButton("Error!!!");
    }
  };

  // edite track link modal
  const [showTrackLink, setShowTrackLink] = useState(false);

  const handleCloseTrackLink = () => {
    setShowTrackLink(false);
    setTrackLink(orderData.trackLink);
  };
  const handleShowTrackLink = () => setShowTrackLink(true);

  const enterTrackLink = (e) => {
    setTrackLink(e.target.value);
  };

  const handleMarkAsSent = () => {
    setShowTrackLink(false);

    markAsDelivered(id, trackLink)
      .then((res) => {
        if (res.message === "Order has been shipped") {
          if (cartItems[0]?.cartProducts[0].mnasku !== "CTL000000") {
            setorderDeliveredButton("sending email");
            sendDeliveryNotice(userInfo?.email, purchaseNumber, trackLink)
              .then((res) => {
                if (res.message === "Email sent successfully") {
                  setorderDeliveredButton("Email Sent!!!");
                  setIsDelivered(true);
                } else if (res.message === "Skipping send email in Dev") {
                  setorderDeliveredButton("Skipping Email!!!");
                  setIsDelivered(true);
                } else {
                  setorderDeliveredButton("ERROR!!!");
                }
              })
              .catch((er) => {
                console.log(
                  er.response && er.response.data && er.response.data.message
                    ? er.response.data.message
                    : er.response.data || er.message || "An error occurred"
                );
              });
          } else {
            setorderDeliveredButton("Freight Service Done");
            setIsDelivered(true);
          }
        }
      })
      .catch((err) => {
        console.log(
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : err.response.data || err.message || "An error occurred"
        );
      });
  };

  // create back order
  const incrementInvoiceNumber = (invoiceNumber) => {
    const alphaPart = invoiceNumber.match(/[A-Z]*$/)[0];
    const numericPart = alphaPart
      ? invoiceNumber.slice(0, -alphaPart.length)
      : invoiceNumber;

    function incrementString(str) {
      if (!str) {
        return "A";
      }

      if (str.length === 1) {
        return str + "A";
      }

      const lastChar = str[str.length - 1];
      const newLastChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);

      if (newLastChar <= "C") {
        return str.slice(0, str.length - 1) + newLastChar;
      } else {
        const newFirstChar = String.fromCharCode(str[0].charCodeAt(0) + 1);
        if (newFirstChar <= "Z") {
          return newFirstChar;
        } else {
          throw new Error("Invoice numbering exceeded its limit");
        }
      }
    }

    return numericPart + incrementString(alphaPart);
  };

  const orderHandler = () => {
    let itemsCount = 0;
    // let cartSubtotal = 0;
    let netTotalAmount = 0;
    setButtonText("Creating...");

    const filteredItems = order.cartItems.filter(
      (item) => item.cartProducts[0].backOrder > 0
    );

    for (const item of filteredItems) {
      itemsCount += item.cartProducts[0].backOrder;
      netTotalAmount +=
        item.cartProducts[0].backOrder * item.cartProducts[0].price;
    }

    let totalTaxAmount = netTotalAmount * 0.1;
    let roundedTax;

    if (parseInt((totalTaxAmount * 1000).toString().slice(-1)) > 0) {
      roundedTax = Math.floor(totalTaxAmount * 100) / 100 + 0.01;
    } else {
      roundedTax = totalTaxAmount;
    }

    roundedTax = Math.round(roundedTax * 100) / 100;

    const cartSubtotal = Math.round((netTotalAmount + roundedTax) * 100) / 100;

    const orderData = {
      orderTotal: {
        itemsCount: itemsCount,
        cartSubtotal: cartSubtotal.toFixed(2),
        taxAmount: roundedTax,
      },
      cartItems: filteredItems.map((item) => {
        return {
          productId: item.productId,
          name: item.name,
          saleunit: item.saleunit,
          image: item.image ? item.image ?? null : null,
          cartProducts: [
            {
              attrs: item.cartProducts[0].attrs,
              barcode: item.cartProducts[0].barcode,
              count: item.cartProducts[0].count,
              mnasku: item.cartProducts[0].mnasku,
              price: item.cartProducts[0].price,
              quantity: item.cartProducts[0].backOrder,
              suppliedQty: item.cartProducts[0].backOrder,
              backOrder: 0,
              sales: item.cartProducts[0].sales ?? null,
              // slrsku: item.cartProducts[0].slrsku,
              suppliersku: item.cartProducts[0].suppliersku,
              _id: item.cartProducts[0]._id,
            },
          ],
        };
      }),
      paymentMethod: order.paymentMethod,
      purchaseNumber: order.purchaseNumber,
      adminNote: order.orderNote,
      invoiceNumber: incrementInvoiceNumber(order.invoiceNumber),
      deliverySite: order.deliverySite,
      user_id: order.user._id,
      userName: order.userName,
      userCompany: order.userCompany,
      dueDays: order.dueDays,
      secondOwnerId: order.secondOwnerId,
      storeId: order.storeId,
    };
    adminCreateOrder(orderData)
      .then(async (data) => {
        setButtonText("Created!");
        setTimeout(() => setButtonText("Create"), 1000);
        if (data) {
          const res = await axios.post("/api/sendemail/newOrderRemind", {
            from: userInfo.email,
            PO: purchaseNumber,
            price: cartSubtotal.toFixed(2),
          });
          const response = await axios.put(
            "/api/orders/markAsBackOrder/" + order._id,
            { backOrder: false }
          );
          if (response.status === 200) {
            window.location.href = `/admin/order-details/${data._id}`;
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const [completingOrder, setCompletingOrder] = useState(false);
  const updateBackOrderStatus = async () => {
    setCompletingOrder(true);
    const response = await axios.put(
      "/api/orders/markAsBackOrder/" + order._id,
      { backOrder: false }
    );
    if (response.status === 200) {
      setBackOrderStatus(false);
      setCompletingOrder(false);
    }
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleReorderClick = () => {
    setShowConfirmation(true);
  };

  const closeModal = () => {
    setShowConfirmation(false);
  };

  // admin note
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setAdminNote(order.adminNote);
  };
  const handleShow = () => setShow(true);

  const enterAdminNote = (e) => {
    setAdminNote(e.target.value);
  };

  const saveOrderName = () => {
    setShow(false);
    updateAdminNote(id, adminNote);
  };

  const handleShowProformaInvoice = () => {
    setShowProformaInvoice(!showProformaInvoice)
  }

  const handleDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5, 9);
    setPaidAt(value);
  };

  const isValidDateFormat = (date) => {
    // Regex for DD/MM/YYYY format
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return dateRegex.test(date);
  };

  const isPastOrToday = (date) => {
    const [day, month, year] = date.split("/").map(Number);
    const inputDate = new Date(year, month - 1, day); // JS months are 0-based
    const today = new Date();
    // Remove time from today’s date for accurate comparison
    today.setHours(0, 0, 0, 0);

    return inputDate <= today; // Ensure the date is not in the future
  };

  const convertToISO = (dateStr) => {
    // Split the DD/MM/YYYY format
    const [day, month, year] = dateStr.split("/").map(Number);
    // Create a Date object (months are 0-based in JavaScript)
    const date = new Date(year, month - 1, day);
    // Convert to ISO 8601 format
    return date.toISOString(); // Example output: "2023-09-25T04:55:33.762Z"
  };

  const [paymentMessage, setPaymentMessage] = useState("")
  const handleMarkPaid = async () => {
    if (paidAt !== undefined && isValidDateFormat(paidAt) && isPastOrToday(paidAt)) {
      setPaymentMessage("")
      setBtnMarkAsPaid(true)
      try {
        const response = await axios.put(
          "/api/orders/markAsPaid/" + order._id,
          { isPaid: true, balance: 0, paidAt: convertToISO(paidAt) }
        );
      } catch (err) {
        console.error("Error updating client SKU:", err);
      }
      setRefreshOrder(!refreshOrder);
    } else {
      setPaymentMessage("*please enter valid payment date")
    }
  }

  const [clicked, setClicked] = useState(false);
  const [orderCreated, setOrderCreated] = useState(true);
  const [ showConfirmationReorder, setShowConfirmationReorder] = useState(false);

  const reOrderHandlerFunction = () => {
    reduxDispatch(reOrderReduxAction(id));
    setClicked(true);
  };

  const handleReorder = () => {
    if (reOrderItemsCheck.length > 0) {
      setShowConfirmationReorder(true);
    } else {
      reOrderHandlerFunction(id);
    }
  };

  const removeAllItems = () => {
      reduxDispatch(emptyCart());
    };

  const handleConfirmationClose = (emptyCart) => {
    if (emptyCart) {
      removeAllItems();
      setTimeout(() => {
        reOrderHandlerFunction(id);
      }, 1000);
    } else {
      reOrderHandlerFunction(id);
    }
  };

  const closeModalReorder = () => {
    setShowConfirmationReorder(false);
  };


  const handleOrderToCtl = async (invData) => {
    setSendingOrderToCtl(true);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const formDataToSend = new FormData();
    formDataToSend.append("billingEmail", `${deliveryBooks[0]?.billingEmail}`);
    formDataToSend.append("purchaseNumber", `${invData.purchaseNumber}`);
    formDataToSend.append("totalPrice", `${invData.cartSubtotal}`);
    formDataToSend.append("invoiceNumber", `${invData.invoiceNumber}`);
    formDataToSend.append("base64data", `${invData.base64data}`);
    formDataToSend.append("orderID", `${id}`);

    try {
      const res = await axios.post(
        "/api/sendemail/emailToCtl",
        formDataToSend,
        config
      );

      if(res.status === 200 ) {
        markAsSendToCtl(id, true)
      }
      
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  return (
    <>
      <div className="green-line"></div>
      <div className={styles.orderDetailsPageWrapper}>
        <Row className="mt-4">
          <h1 className={styles.title}>ORDER DETAILS</h1>
          <Col md={9}>
            <Row>
              <Col md={6} className="mb-0">
                <b>Name</b>: {userInfo?.name} {userInfo?.lastName}{" "}
                <b className="ms-3">Phone</b>: {userInfo?.phone} <br />
                <b>Company</b>: {orderData.userCompany}
                <ListGroup.Item className="p-1 ps-0 w-20">
                  <Form.Label className="fw-bold">
                    Delivery Site:
                    {editLocation === false ? (
                      <>
                        {" "}
                        <i
                          onClick={handleEditLocation}
                          className="bi bi-pencil-square"
                          style={{ cursor: "pointer", color: "#DBA162" }}
                        ></i>
                      </>
                    ) : (
                      <>
                        {" "}
                        <i
                          className="bi bi-folder-check"
                          onClick={saveEditLocation}
                          style={{ cursor: "pointer", color: "#DBA162" }}
                        ></i>{" "}
                      </>
                    )}
                  </Form.Label>

                  <Form.Select
                    required
                    name="sites"
                    aria-label="Default select example"
                    onChange={changeDeliverySite}
                    className="p-0 ps-1"
                    disabled={editLocation === false}
                  >
                    {deliverySites &&
                      deliverySites.map((site, idx) => {
                        return site.name !== "" ? (
                          orderData.deliverySite === site.name ? (
                            <option selected key={idx} value={site.name}>
                              {site.name}
                            </option>
                          ) : (
                            <option key={idx} value={site.name}>
                              {site.name}
                            </option>
                          )
                        ) : (
                          <option key={idx} value={site.name}>
                            {site.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </ListGroup.Item>
              </Col>
              <Col md={6} className="mb-0">
                <h5 style={{ color: "#521712" }}>ORDER STATUS:</h5>
                <Alert
                  className="mt-1 p-0 ps-2 mb-1"
                  variant={isDelivered ? "success" : "danger"}
                >
                  {isDelivered ? (
                    <>
                      Shipped at{" "}
                      {new Date(isDelivered).toLocaleString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour12: true,
                      })}
                      <button>
                        <a href={trackLink} target="_blank" rel="noreferrer">
                          Track Shipping
                        </a>
                      </button>
                    </>
                  ) : (
                    <>Not Sent Yet</>
                  )}
                </Alert>
                <Alert
                  className="mt-1 p-0 ps-2 mb-1"
                  variant={invoiceSent ? "success" : "danger"}
                >
                  {invoiceSent ? (
                    <>
                      Inv Sent at{" "}
                      {new Date(invoiceSent).toLocaleString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </>
                  ) : (
                    <>Invoice Not Sent</>
                  )}
                </Alert>
                <Alert
                  className="mt-1 p-0 ps-2 mb-1"
                  variant={order?.balance === 0 ? "success" : "danger"}
                >
                  {order?.balance === 0 && order?.isPaid ? (
                    <>
                      <i className="bi bi-check-circle-fill text-success" /> Paid
                      on: {new Date(paidAt).toLocaleString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour12: true,
                      })}
                    </>
                  ) : (
                    <>Not paid yet</>
                  )}
                </Alert>
              </Col>
            </Row>
            <br />
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <h3>
                ORDER ITEMS
              </h3>
              {edit === false ? (
                <>
                  {" "}
                  <i
                    onClick={handleEdit}
                    className="bi bi-pencil-square"
                    style={{ cursor: "pointer", color: "#DBA162" }}
                  ></i>
                </>
              ) : (
                <>
                  {" "}
                  <button
                    id="btn_InvoiceNumber"
                    className="pe-2 ps-2 pb-1 fs-6"
                    style={{ backgroundColor: "#521712", color: "white", borderRadius: "5px" }}
                    onClick={saveEdit}
                  >
                    save
                  </button>{" "}
                </>
              )}
            </div>

            <ListGroup variant="flush">
              <table style={{ width: "100%", color: "#483F55" }} className={`mt-1 ${styles.tableSpacing}`} >
                <thead>
                  <tr>
                    <th className="pb-2 pt-2" style={{ width: "6%" }}></th>
                    <th className="pb-2 pt-2 ps-2" style={{ width: "25%" }}>Product</th>
                    <th className="pb-2 pt-2" style={{ width: "10%" }}>MNASKU</th>
                    <th className="pb-2 pt-2" style={{ width: "10%" }}>Unit Price</th>
                    <th className="pb-2 pt-2" style={{ width: "10%" }}>Order Qty</th>
                    <th className="pb-2 pt-2" style={{ width: "10%" }}>Supplied Qty</th>
                    <th className="pb-2 pt-2" style={{ width: "10%" }}>Back Order</th>
                    <th className="pb-2 pt-2" style={{ width: "5%" }}></th>
                  </tr>
                </thead>
                {cartItems && cartItems.map((item, idx) => {
                  return (<CartItemForOrderComponent
                    key={idx}
                    index={idx}
                    item={item}
                    orderCreated={true}
                    edit={edit}
                    changeCount={changeCount}
                    changePrice={changePrice}
                    removeFromOrderHandler={removeFromOrderHandler}
                    id={id}
                    backOrderStatus={backOrderStatus}
                    userInfo={userInfo}
                    selectedDeliverySite={setSelectedDeliverySite}
                    editingIndex={editingIndex}
                    setEditingIndex={setEditingIndex}
                  />)
                })}
              </table>
            </ListGroup>
          </Col>
          <Col md={3}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}} className="mb-2">
            <div className={styles.btnGoToOrders}><a href="/admin/orders">Go to All Orders</a></div>
            <div>
                <PDFDownloadLink
                          document={
                            <Order
                              cartItems={cartItems}
                              invoiceNumber={invoiceNumber}
                              userInfo={userInfo}
                              purchaseNumber={purchaseNumber}
                              cartSubtotal={cartSubtotal}
                              dueDays={dueDays}
                              invoiceDate={createdAt}
                              selectedDeliverySite={selectedDeliverySite}
                              companyAccount={companyAccount}
                              taxAmount={taxAmount}
                            />
                          }
                          fileName={invoiceNumber + " Order"}
                          className="btn btn-success p-1 ps-3 pe-3 confirm-btn"
                          style={{fontSize: "12px"}}
                        >
                          <span>
                            Download Order <i className="bi bi-file-earmark-pdf"></i>
                          </span>
                        </PDFDownloadLink>
          </div>      
            <div>
                      <Button
                        onClick={handleReorder}
                        className="p-1 pe-3 ps-3 m-0 confirm-btn"
                        style={{fontSize: "12px"}}
                      >
                        Re-Order
                      </Button>
                      <Modal
                        show={showConfirmationReorder}
                        onHide={closeModalReorder}
                        className="Re_Order_Modal"
                      >
                        <Modal.Header className="p-0 m-2 mb-0" closeButton>
                          <span className="fw-bold p-0 m-0">Confirmation</span>
                        </Modal.Header>
                        <Modal.Body className="p-2 pt-0">
                          Some items already in your cart! Do you want to empty
                          your cart before re-ordering?
                        </Modal.Body>
                        <Modal.Footer className="p-0 d-flex justify-content-between">
                          <Button
                            variant="success"
                            onClick={() => handleConfirmationClose(true)}
                            className="ms-5 p-0 pe-1 ps-1 button-shadow"
                          >
                            Empty Cart
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleConfirmationClose(false)}
                            className="me-5 p-0 pe-1 ps-1 button-shadow"
                          >
                            Keep Cart Items
                          </Button>
                        </Modal.Footer>
                      </Modal>
            </div>
          </div>
            
            <ListGroup>
              <ListGroup.Item className="p-2 ps-2" style={{ backgroundColor: 'transparent' }}>
                <h3 style={{ color: "#483F55" }}>ORDER SUMMARY</h3>
              </ListGroup.Item>
              <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent', color: "#483F55" }}>
                Item Price:{" "}
                <span className="fw-bold float-end">
                  {" "}
                  $ {taxAmount ? orderNetAmount : nonGSTPrice}
                </span>
              </ListGroup.Item>
              <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent', color: "#483F55" }}>
                Total GST{" "}
                <span className="fw-bold float-end">
                  $ {taxAmount ? TAX : GST}
                </span>
              </ListGroup.Item>
              <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent', color: "#483F55" }}>
                Invoice Amount:{" "}
                <span className="fw-bold text-danger float-end">
                  $ {incGSTPrice}
                </span>
              </ListGroup.Item>
              <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent', color: "#483F55" }}>
                PO Number: <span className="fw-bold">{purchaseNumber}</span>
              </ListGroup.Item>
              <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent', color: "#483F55" }}>
                <tr>
                  <td style={{ width: "40%", color: "#483F55" }}>Invoice Number :</td>
                  <td>
                    <Form.Control
                      type="text"
                      style={{ width: "80%" }}
                      min="0"
                      className="form-control pe-0"
                      onChange={handleChangeInvoiceNumber}
                      value={
                        editInvoiceNumber === false
                          ? invoiceNumber
                          : invoiceNumber
                      }
                      disabled={editInvoiceNumber === false}
                    />
                  </td>
                  <td style={{ width: "10%", color: "#DBA162" }}>
                    {editInvoiceNumber === false ? (
                      <>
                        {" "}
                        <i
                          onClick={handleEditInvoiceNumber}
                          className="bi bi-pencil-square"
                          style={{ cursor: "pointer" }}
                        ></i>
                      </>
                    ) : (
                      <>
                        {" "}
                        <button
                          className="pe-1 ps-1 p-0 m-0 fs-6"
                          onClick={saveEditInvoiceNumber}
                        >
                          save
                        </button>{" "}
                      </>
                    )}
                  </td>
                </tr>
              </ListGroup.Item>
              <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent', color: "#483F55" }}>
                Admin Note: {adminNote ? null : "N/A"}
                {adminNote ? <span className="fw-bold">{adminNote}</span> : null}
                <i
                  onClick={handleShow}
                  className="bi bi-pencil-square ms-2"
                  style={{ cursor: "pointer", color: "#DBA162" }}
                ></i>
              </ListGroup.Item>
              {!isDelivered && <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent' }}>
                <div className="d-grid gap-2">
                  <Button
                    className={`p-0 m-0 w-50 ${sendOrderToCtl ? styles.btnRedColor : styles.btnGreenColor}`}
                    onClick={() => handleOrderToCtl(invData)}
                    type="button"
                    disabled={sendOrderToCtl ? true : false}
                  >
                    {sendOrderToCtl ? "Sent to CTL" : "Send to CTL"}
                  </Button>
                </div>
              </ListGroup.Item>}
              <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent' }}>
                <div className="d-grid gap-2">
                  <Button
                    className={`p-0 m-0 w-50 ${deliveredButtonDisabled ? styles.btnRedColor : styles.btnGreenColor}`}
                    onClick={handleShowTrackLink}
                    type="button"
                  >
                    {orderDeliveredButton}
                  </Button>
                </div>
              </ListGroup.Item>
              {!deliveredButtonDisabled ? (
                <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent' }}>
                  <Button className={`p-0 m-0 pe-2 ps-2 w-50 ${styles.btnRedColor}`} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Print Delivery Note</Button>
                </ListGroup.Item>
              ) : (
                <PDFPopupButton
                  documentComponent={
                    <DeliveryNotePrint
                      cartItems={cartItems}
                      invoiceNumber={invoiceNumber}
                      userInfo={userInfo}
                      purchaseNumber={purchaseNumber}
                      cartSubtotal={cartSubtotal}
                      invoiceDate={deliveredAt}
                      dueDays={dueDays}
                      selectedDeliverySite={selectedDeliverySite}
                      companyAccount={companyAccount}
                      deliveredAt={deliveredAt}
                    />
                  }
                  fileName={"DN" + invoiceNumber}
                  loadingText="Print Delivery Note"
                />
              )}

              <ListGroup.Item
                className="p-1 ps-2"
                hidden={backOrderStatus === false}
                style={{ backgroundColor: 'transparent' }}
              >
                <div className="d-grid gap-2">
                  <Button
                    onClick={handleReorderClick}
                    className="button-shadow p-0 m-0 w-50"
                    variant="success"
                  >
                    Create Back Order
                  </Button>
                </div>
                <div className="d-grid gap-2">
                  <Button
                    onClick={updateBackOrderStatus}
                    className="button-shadow p-0 m-0 w-50 mt-2"
                    variant="success"
                    disabled={completingOrder}
                  >
                    {completingOrder ? "Completing" : "Complete Order"}
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
            <br />

            <ListGroup hidden={userData?.isAdmin !== true || order?.isDelivered !== true}>
              <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent' }}>
                <h5 className="m-0">Accounts Use Only:</h5>
              </ListGroup.Item>
              {!deliveredButtonDisabled ? (
                <>
                  <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent' }}>
                    <Button className={`p-0 m-0 pe-2 ps-2 w-50 ${styles.btnRedColor}`} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Print Invoice</Button>
                  </ListGroup.Item>
                  <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent' }}>
                    <Button className="p-0 m-0 pe-2 ps-2 w-50 " variant="secondary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Send Invoice !</Button>
                  </ListGroup.Item>
                </>
              ) : (
                <>
                  <PDFPopupButton
                    documentComponent={
                      <InvoicePrint
                        cartItems={cartItems}
                        invoiceNumber={invoiceNumber}
                        userInfo={userInfo}
                        purchaseNumber={purchaseNumber}
                        cartSubtotal={cartSubtotal}
                        dueDays={dueDays}
                        invoiceDate={deliveredAt}
                        selectedDeliverySite={selectedDeliverySite}
                        companyAccount={companyAccount}
                        taxAmount={taxAmount}
                        isPaid={btnMarkAsPaid}
                      />
                    }
                    fileName={invoiceNumber}
                    loadingText="Print Invoice"
                  />
                  <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent' }}>
                    <div className="d-grid gap-2">
                      <Button
                        className={`p-0 m-0 w-50 ${sentProformaInvButtonDisabled ? styles.btnRedColor : styles.btnGreenColor}`}
                        onClick={
                          sentInvButtonDisabled
                            ? () => sendInvoiceEmail(invData)
                            : handleSentInv
                        }
                        type="button"
                        disabled={sendingInv}
                      >
                        {sendingInv ? "Sending..." : invSentButton}{" "}
                        <span hidden={!order?.invHasSent}>({order?.invHasSent})</span>{" "}
                      </Button>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent' }}>
                    <Form.Label>Send Invoice Manually </Form.Label>
                    <Form.Control
                      type="text"
                      style={{ width: "99%" }}
                      min="0"
                      className="form-control pe-0 mb-1"
                      onChange={handleChangeEmailAddress}
                      value={emailAddress}
                      isInvalid={!isEmailValid}
                      placeholder="test@gmail.com"
                    />
                    <Button
                      className={`p-0 m-0 w-50 ${styles.btnRedColor}`}
                      onClick={() => sendInvoiceEmailManually(invData)}
                      type="button"
                      disabled={sendingInvManually}
                    >{sendingInvManually ? "Sending..." : "Send Invoice"}
                    </Button>
                    {!isEmailValid && (
                      <Form.Label className={styles.labelErrors}> *please enter a valid email address.</Form.Label>
                    )}
                  </ListGroup.Item>
                </>
              )}
              {
                (paidAt === undefined || !order?.isPaid) ? (
                  <>
                    <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent' }}>
                      <Form.Group controlId="paymentDate">
                        <Form.Label>Invoice Paid Date</Form.Label>
                        <Form.Control
                          className="form-control pe-0 mb-1"
                          type="text"
                          style={{ width: "99%" }}
                          min="0"
                          placeholder="DD/MM/YYYY"
                          value={paidAt}
                          onChange={handleDateChange}
                          maxLength={10}
                        />
                      </Form.Group>
                      <Button
                        className={`p-0 m-0 w-50 ${styles.btnRedColor}`}
                        type="button"
                        id="isPaid"
                        onClick={() => handleMarkPaid()}
                        disabled={btnMarkAsPaid}
                      >Mark As Paid</Button>
                      <Form.Label className={styles.labelErrors}>{paymentMessage}</Form.Label>
                    </ListGroup.Item>
                  </>
                ) : ("")
              }
            </ListGroup>
            <br />
            <div style={{ height: "100px" }}>
              <ListGroup>
                <ListGroup.Item style={{ backgroundColor: 'transparent' }}>
                  <h5 className="m-0">Proforma Invoice</h5>
                </ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: 'transparent' }}>
                  <Form.Check
                    type="switch"
                    id="proforma-switch"
                    label="Show Proforma Invoice"
                    onChange={handleShowProformaInvoice}
                  />
                </ListGroup.Item>
                <div hidden={showProformaInvoice === false}>
                  <PDFPopupButton
                    documentComponent={
                      <ProformaInvoicePrint
                        cartItems={cartItems}
                        invoiceNumber={invoiceNumber}
                        userInfo={userInfo}
                        purchaseNumber={purchaseNumber}
                        cartSubtotal={cartSubtotal}
                        dueDays={dueDays}
                        invoiceDate={createdAt}
                        selectedDeliverySite={selectedDeliverySite}
                        companyAccount={companyAccount}
                        taxAmount={taxAmount}
                      />
                    }
                    fileName={invoiceNumber}
                    loadingText="Print P.Invoice"
                  />
                  <ListGroup.Item className="p-1 ps-2" style={{ backgroundColor: 'transparent' }}>
                    <div className="d-grid gap-2">
                      <Button
                        className={`p-0 m-0 w-50 ${sentProformaInvButtonDisabled ? styles.btnRedColor : styles.btnGreenColor}`}
                        onClick={
                          sentProformaInvButtonDisabled
                            ? () => sendProformaInvoiceEmail(invData)
                            : handleSentProformaInv
                        }
                        type="button"
                        disabled={sendingInv}
                      >
                        {sendingInv ? "Sending..." : proformaInvSentButton}{" "}
                        <span hidden={!order?.proformaInvHasSent}>({order?.proformaInvHasSent})</span>{" "}
                      </Button>
                    </div>
                  </ListGroup.Item>
                </div>
              </ListGroup>
            </div>
            <br />

            {/* edit Track Link modal */}
            <Modal
              show={showTrackLink}
              onHide={handleCloseTrackLink}
              className="edite_order_name"
            >
              <Modal.Header className="p-1 ps-3 pe-3 m-0" closeButton>
                <Modal.Title>Enter Tracking Link:</Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-2 m-0">
                <Form.Control
                  as="textarea"
                  onChange={enterTrackLink}
                  type="string"
                  name="trackLink"
                  defaultValue={trackLink}
                  required
                  aria-label="track link"
                  aria-describedby="basic-addon2"
                />
              </Modal.Body>
              <Modal.Footer className="p-0 m-0">
                <Button
                  variant="success"
                  onClick={handleMarkAsSent}
                  className="p-1 pt-0 pb-0 m-1"
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCloseTrackLink}
                  className="p-1 pt-0 pb-0 m-1"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            {/* back order modal */}
            <Modal
              show={showConfirmation}
              onHide={closeModal}
              className="Re_Order_Modal"
            >
              <Modal.Header className="p-0 m-2 mb-0" closeButton>
                <span className="fw-bold p-0 m-0">Create Back Order?</span>
              </Modal.Header>
              <Modal.Body className="p-2 m-2 d-flex justify-content-between">
                {/* Do you want Create the Back Order? */}
                <Button
                  variant="success"
                  onClick={orderHandler}
                  className="ms-5 p-0 pe-1 ps-1 button-shadow"
                >
                  {buttonText}
                </Button>
                <Button
                  variant="secondary"
                  onClick={closeModal}
                  className="me-5 p-0 pe-1 ps-1 button-shadow"
                >
                  Cancel
                </Button>
              </Modal.Body>
            </Modal>

            {/* edit order note modal */}
            <Modal show={show} onHide={handleClose} className="edite_order_name">
              <Modal.Header className="p-1 ps-3 pe-3 m-0" closeButton>
                <Modal.Title>Enter Admin Note:</Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-2 m-0">
                <Form.Control
                  onChange={enterAdminNote}
                  type="string"
                  name="MangerEmail"
                  defaultValue={adminNote}
                  required
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                />
              </Modal.Body>
              <Modal.Footer className="p-0 m-0">
                <Button
                  variant="success"
                  onClick={saveOrderName}
                  className="p-1 pt-0 pb-0 m-1"
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="p-1 pt-0 pb-0 m-1"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </div >
    </>
  );
};

export default OrderDetailsPageComponent;
