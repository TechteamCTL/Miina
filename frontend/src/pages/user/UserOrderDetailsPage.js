import UserOrderDetailsPageComponent from "./components/UserOrderDetailsPageComponent/UserOrderDetailsPageComponent.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loadScript } from "@paypal/paypal-js";
import { reOrder } from "../../redux/actions/cartActions";

const getOrder = async (orderId) => {
  const { data } = await axios.get("/api/orders/user/" + orderId);
  return data;
};

const updateOrderNote = async (orderId, orderNote) => {
  const { data } = await axios.put("/api/orders/updateOrderNote/" + orderId, { orderNote: orderNote });
  return data;
};

const getdeliveryBooks = async (email) => {
  const { data } = await axios.get("/api/deliveryBooks/deliveryBook/" + email);
  return data;
};

const getUsersList = async (company) => {
  const { data } = await axios.get("/api/users/list/" + company);
  return data
};

const updateOrderSecondOwner = async (orderId, secondOwnerId, secondOwnerSite) => {
  const { data } = await axios.put("/api/orders/updateSecondOwner/" + orderId, { secondOwnerId: secondOwnerId, secondOwnerSite: secondOwnerSite });
  return data;
};

const loadPayPalScript = (
  cartSubtotal,
  cartItems,
  orderId,
  updateStateAfterOrder
) => {
  loadScript({
    "client-id":
      "ATs4szzBbA0y066jr1O0oBqm9xVvUZJmoY9bbp8ebpqlwf5GOqpeqHQv78GtNuBiXUpW5PnrCdpsFRho",
  })
    .then((paypal) => {
      paypal
        .Buttons(
          buttons(cartSubtotal, cartItems, orderId, updateStateAfterOrder)
        )
        .render("#paypal-container-element");
    })
    .catch((err) => {
      console.error("failed to load the PayPal JS SDK script", err);
    });
};

const buttons = (cartSubtotal, cartItems, orderId, updateStateAfterOrder) => {
  return {
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: cartSubtotal,
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: cartSubtotal,
                },
              },
            },
            items: cartItems.map((product) => {
              return {
                name: product.name,
                unit_amount: {
                  currency_code: "USD",
                  value: product.price,
                },
                quantity: product.quantity,
              };
            }),
          },
        ],
      });
    },
    onCancel: onCancelHandler,
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (orderData) {
        let transaction = orderData.purchase_units[0].payments.captures[0];
        if (
          transaction.status === "COMPLETED" &&
          Number(transaction.amount.value) === Number(cartSubtotal)
        ) {
          updateOrder(orderId)
            .then((data) => {
              if (data.balance === 0) {
                updateStateAfterOrder(data.paidAt);
              }
            })
            .catch((er) => console.log(er));
        }
      });
    },
    onError: onErrorHandler,
  };
};

const onCancelHandler = function () {
  console.log("cancel");
};

const onErrorHandler = function (err) {
  console.log("error");
};

const updateOrder = async (orderId) => {
  const { data } = await axios.put("/api/orders/paid/" + orderId);
  return data;
};

const UserOrderDetailsPage = () => {
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  const getUser = async () => {
    const { data } = await axios.get("/api/users/profile/" + userInfo._id);
    return data;
  };


  return (
    <UserOrderDetailsPageComponent
      userInfo={userInfo}
      getUser={getUser}
      getOrder={getOrder}
      updateOrderNote={updateOrderNote}
      updateOrderSecondOwner={updateOrderSecondOwner}
      loadPayPalScript={loadPayPalScript}
      reOrdertReduxAction={reOrder}
      reduxDispatch={dispatch}
      getdeliveryBooks={getdeliveryBooks}
      getUsersList={getUsersList}
    />
  );
};

export default UserOrderDetailsPage;
