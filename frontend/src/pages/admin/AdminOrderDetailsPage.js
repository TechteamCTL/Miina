import OrderDetailsPageComponent from "./components/OrderDetailsPageComponent";
import { useDispatch, useSelector } from "react-redux";
import { backOrder } from "../../redux/actions/cartActions";
import { reOrder } from "../../redux/actions/cartActions";

import axios from "axios";

const getOrder = async (id) => {
  const { data } = await axios.get("/api/orders/user/" + id);
  return data;
};

const fetchProduct = async (productId) => {
  const { data } = await axios.get(`/api/products/get-one/${productId}`);
  return data;
};

const markAsDelivered = async (id, trackLink) => {
  const { data } = await axios.put("/api/orders/delivered/" + id, {
    trackLink: trackLink,
  });
  if (data) {
    return data;
  }
};

const markAsSendToCtl = async (id, isSentToCtl) => {
  const { data } = await axios.put("/api/orders/markAsSendToCtl/" + id, {
    isSentToCtl: isSentToCtl,
  });
  if (data) {
    return data;
  }
};

const sendDeliveryNotice = async (userEmail, purchaseNumber, trackLink) => {
  const { data } = await axios.post(
    "/api/sendemail/emailShipping/", { userEmail, purchaseNumber, trackLink }
  );
  if (data) {
    return data;
  }
};

const markAsPaid = async (id) => {
  const { data } = await axios.put("/api/orders/paid/" + id);
  if (data) {
    return data;
  }
};

const sendInv = async (id) => {
  const { data } = await axios.put("/api/orders/sendInv/" + id);
  if (data) {
    return data;
  }
};

const sendProformaInv = async (id) => {
  const { data } = await axios.put("/api/orders/emailProformaInv/" + id);
  if (data) {
    return data;
  }
};

const sendOrderToCtl = async (id) => {
  const { data } = await axios.put("/api/orders/emailToCtl/" + id);
  if (data) {
    return data;
  }
};

const updateBackOrder = async (orderId, itemId, price, suppliedQty) => {
  const { data } = await axios.put(
    "/api/orders/updateBackOrder/" + orderId + "/" + itemId,
    { price, suppliedQty }
  );
  if (data) {
    return data;
  }
};

const updateInvoiceNumber = async (orderId, invoiceNumber) => {
  const { data } = await axios.put(
    "/api/orders/updateInvoiceNumber/" + orderId + "/",
    { invoiceNumber }
  );
  if (data) {
    return data;
  }
};

const removeOrderItem = async (orderId, itemId) => {
  const { data } = await axios.delete(
    "/api/orders/removeItem/" + orderId + "/" + itemId
  );
  if (data) {
    return data;
  }
};

const getdeliveryBooks = async (email) => {
  const { data } = await axios.get("/api/deliveryBooks/deliveryBook/" + email);
  return data;
};

const updateDeliverySite = async (orderId, deliverySite) => {
  const { data } = await axios.put("/api/orders/deliverySite/" + orderId, {
    deliverySite: deliverySite,
  });
  return data;
};

const updateAdminNote = async (orderId, adminNote) => {
  const { data } = await axios.put("/api/orders/updateAdminNote/" + orderId, { adminNote: adminNote });
  return data;
};

const adminCreateOrder = async (orderData) => {
  const { data } = await axios.post("/api/orders/adminCreateOrder", { ...orderData });
  return data;
}

const AdminOrderDetailsPage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  const getUser = async () => {
    const { data } = await axios.get("/api/users/profile/" + userInfo._id);
    return data;
  };

  return (
    <OrderDetailsPageComponent
      getOrder={getOrder}
      getUser={getUser}
      markAsDelivered={markAsDelivered}
      markAsPaid={markAsPaid}
      sendInv={sendInv}
      sendProformaInv={sendProformaInv}
      sendOrderToCtl={sendOrderToCtl}
      updateBackOrder={updateBackOrder}
      updateInvoiceNumber={updateInvoiceNumber}
      removeOrderItem={removeOrderItem}
      getdeliveryBooks={getdeliveryBooks}
      adminUpdateDeliverySite={updateDeliverySite}
      sendDeliveryNotice={sendDeliveryNotice}
      reOrdertReduxAction={backOrder}
      reOrderReduxAction={reOrder}
      reduxDispatch={dispatch}
      updateAdminNote={updateAdminNote}
      adminCreateOrder={adminCreateOrder}
      fetchProduct={fetchProduct}
      markAsSendToCtl={markAsSendToCtl}
    />
  );
};

export default AdminOrderDetailsPage;
