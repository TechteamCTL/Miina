import { Alert } from "react-bootstrap";
import { useState, useEffect } from "react";

import "./AddedToCartMessageComponent.css";

const AddedToCartMessageComponent = ({
  showCartMessage,
  setShowCartMessage,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (showCartMessage) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
        setShowCartMessage(false);
      }, 1200);
    } else {
      setShow(false);
    }
  }, [showCartMessage]);

  return (
    <div className="added-to-cart-message-container">
      <Alert
        show={show}
        variant="success"
        className={`added-to-cart-message ${show ? "show" : ""}`}
      >
        <Alert.Heading className="fs-6">Item Added!</Alert.Heading>
      </Alert>
    </div>
  );
};

export default AddedToCartMessageComponent;
