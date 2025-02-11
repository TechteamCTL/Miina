import { Form } from "react-bootstrap";
import RemoveFromOrderComponent from "../Utils/RemoveFromOrderComponent";
import { useState, useEffect } from "react";


const CartItemForOrderComponent = ({
  item,
  id,
  removeFromOrderHandler = false,
  orderCreated = false,
  changeCount = false,
  changePrice = false,
  edit,
  backOrderStatus,
  userInfo,
  onSkuUpdateSuccess,
  selectedDeliverySite,
  editingIndex,
  setEditingIndex,
  index,
  isCancel,
  isUpdated
}) => {
  const [qty, setQty] = useState(item.cartProducts[0].suppliedQty);
  const [price, setPrice] = useState(item.cartProducts[0].price);

  useEffect(() => {
    if (item.saleunit) {
      setQty(item.cartProducts[0].suppliedQty);
    }
  }, [item]);

  const handleBlur = (e) => {
    const newValue = Math.round(e.target.value / item.saleunit) * item.saleunit;
    setQty(newValue);
    if (changeCount) {
      changeCount(orderId, item.cartProducts[0]._id, price, newValue);
    }
  };

  const orderId = id;
  const handleChange = (e) => {
    setQty(e.target.value);
    if (changeCount) {
      changeCount(orderId, item.cartProducts[0]._id, price, e.target.value);
    }
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    if (changePrice) {
      changePrice(orderId, item.cartProducts[0]._id, qty, e.target.value);
    }
  };
  const handlePriceBlur = (e) => {
    setPrice(e.target.value);
    if (changePrice) {
      changePrice(orderId, item.cartProducts[0]._id, qty, e.target.value);
    }
  };
  const backOrderQuantity = item.cartProducts[0].quantity - qty;

  return (
      <tbody style={{backgroundColor: "#DBA162"}}>
        <tr>
          <td style={{ width: "6%" }}>
            <img
              crossOrigin="anonymous"
              src={item.image ? item.image ?? null : null}
              className="w-100 img_hovf"
              alt="s"
            />
          </td>
          <td style={{ width: "25%"}} className="ps-2 pe-5">
            <a href={`/product-details/${item.productId}`} className="text-uppercase" style={{color: item.cartProducts[0].backOrder > 0 && backOrderStatus === true ? "red" : "#483F55"}}>
                {item.name} - ({item.cartProducts[0].attrs})
            </a>
          </td>
          <td style={{ width: "10%" }}>
            <p className="m-0">{item.cartProducts[0].mnasku}</p>
          </td>

          <td style={{ width: "10%" }}>
            <Form.Control
              type="number"
              min="0"
              className="form-control"
              onBlur={handlePriceBlur}
              onChange={handlePriceChange}
              value={edit === false ? item.cartProducts[0].price : price}
              disabled={edit === false}
              style={{border: "1px solid #521712", width: "100px"}}
            />
          </td>
          <td style={{ width: "10%" }}>
            <Form.Control
              type="number"
              min={item.saleunit}
              step={item.saleunit}
              className="form-control"
              value={item.cartProducts[0].quantity}
              disabled={orderCreated}
              style={{border: "1px solid #521712", width: "100px"}}
            />
          </td>
          <td style={{ width: "10%" }}>
            <Form.Control
              type="number"
              min="0"
              step={item.saleunit}
              onBlur={handleBlur}
              className="form-control pe-0"
              onChange={handleChange}
              value={edit === false ? item.cartProducts[0].suppliedQty : qty}
              disabled={edit === false}
              style={{border: "1px solid #521712", width: "100px"}}
              onKeyDown={(event) => {event.preventDefault()}}
            />
          </td>
          <td style={{ width: "10%" }}>
            <Form.Control
              type="number"
              className="form-control pe-0"
              value={
                edit === false
                  ? item.cartProducts[0].backOrder
                  : backOrderQuantity
              }
              disabled={orderCreated}
              style={{border: "1px solid #521712", width: "100px"}}
            />
          </td>
          <td style={{ width: "5%" }}>
            <RemoveFromOrderComponent
              orderId={orderId}
              itemId={item.cartProducts[0]._id}
              removeFromOrderHandler={
                removeFromOrderHandler ? removeFromOrderHandler : undefined
              }
            />
          </td>
        </tr>
      </tbody>
  );
};

export default CartItemForOrderComponent;
