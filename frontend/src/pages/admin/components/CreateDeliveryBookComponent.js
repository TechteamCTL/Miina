import {
  Row,
  Col,
  Container,
  Form,
  Button
} from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MaskedInput from 'react-text-mask';
import GoBackButton from "./GoBackButton";
import styles from "../AdminPagesStyles.module.css";

const CreateDeliveryBookComponent = ({ createDeliveryBookApiRequest }) => {
  const [validated, setValidated] = useState(false);
  const [textDueDays, setTextDueDays] = useState("7")
  const [createDeliveryBookResponseState, setCreateDeliveryBookResponseState] =
    useState({
      message: "",
      error: "",
    });
  const [abnNum, setAbnNum] = useState("")
  const abnMask = [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]

  const [rowCount, setRowCount] = useState(1);
  const handleNewDeliveryBook = () => {
    setRowCount(rowCount + 1);
  };
  const handleRemoveDeliveryBook = () => {
    setRowCount(rowCount - 1);
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const sites = [];
    for (
      let i = 0;
      i < document.querySelectorAll(".text-primary").length;
      i++
    ) {
      const name = document.getElementsByName(`name-${i}`)[0].value;
      const billingAddress = document.getElementsByName(
        `billingAddress-${i}`
      )[0].value;
      const deliveryAddress = document.getElementsByName(
        `deliveryAddress-${i}`
      )[0].value;
      const storeEmail = document.getElementsByName(`storeEmail-${i}`)[0].value;
      sites.push({
        name,
        billingAddress,
        deliveryAddress,
        storeEmail,
      });
    }

    const formInputs = {
      companyName: form.companyName.value,
      emailHost: form.emailHost.value,
      billingEmail: form.billingEmail.value,
      companyAccount: form.companyAccount.value,
      dueDays: form.dueDays.value,
      sites: sites,
      abn: form.abn.value
    };

    if (event.currentTarget.checkValidity() === true) {
      createDeliveryBookApiRequest(formInputs)
        .then((data) => {
          if (data.message === "Delivery Book Created")
            navigate("/admin/deliveryBooks");
        })
        .catch((er) => {
          setCreateDeliveryBookResponseState({
            error: er.response.data.message
              ? er.response.data.message
              : er.response.data,
          });
        });
    }
    setValidated(true);
  };
  const checkKeyDown = (e) => {
    if (e.code === "Enter") e.preventDefault();
  };

  const handleAbn = (e) => {
    const newValue = e.target.value;
    setAbnNum(newValue);
  };

  return (
    <Container style={{paddingBottom: "350px"}}>
      <Row className="justify-content-md-center mt-5 content-container">
        <Row>
          <Col md={2}>
            <GoBackButton />
          </Col>
          <Col md={8}>
            <h1>Create New Delivery Book</h1>
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
              onKeyDown={(e) => checkKeyDown(e)}
            >
              <Form.Group className="mb-3" controlId="formBasicCompanyName">
                <Form.Label>Company Name</Form.Label>
                <Form.Control name="companyName" required type="text" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmailHost">
                <Form.Label>Email Host</Form.Label>
                <Form.Control name="emailHost" required type="text" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicBillingEmail">
                <Form.Label>Billing Email</Form.Label>
                <Form.Control name="billingEmail" required type="text" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicAbn">
                <Form.Label>Company ABN</Form.Label>
                <MaskedInput
                  mask={abnMask}
                  placeholder="ABN"
                  guide={false}
                  value={abnNum}
                  onChange={handleAbn}
                  render={(ref, props) => <Form.Control
                    required
                    minLength={14}
                    maxLength={14}
                    type="text"
                    name="abn"
                    ref={ref}
                    {...props}
                  />}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCompanyAccount">
                <Form.Label>Company Account</Form.Label>
                <Form.Control name="companyAccount" required type="text" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicDueDays">
                <Form.Label>Due Days</Form.Label>
                <Form.Control name="dueDays" required type="text" value={textDueDays} onChange={(e) => setTextDueDays(e.target.value)} />
              </Form.Group>

              {[...Array(rowCount)].map((_, index) => (
                <>
                  <span className="text-primary">Site: {index + 1}</span>
                  <Row>
                    <React.Fragment key={index}>
                      <Form.Group
                        as={Col}
                        md="3"
                        className="mb-3"
                        controlId={`formBasicName-${index}`}
                      >
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          as="textarea"
                          name={`name-${index}`}
                          required
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        className="mb-3"
                        controlId={`formBasicBillingAddress-${index}`}
                      >
                        <Form.Label>Billing Address </Form.Label>
                        <Form.Control
                          as="textarea"
                          name={`billingAddress-${index}`}
                          required
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md="4"
                        className="mb-3"
                        controlId={`formBasicDeliveryAddress-${index}`}
                      >
                        <Form.Label>Delivery Address </Form.Label>
                        <Form.Control
                          as="textarea"
                          name={`deliveryAddress-${index}`}
                          required
                        />
                      </Form.Group>
                      <Form.Group as={Col} md="1" className="mb-3">
                        <i
                          className="bi bi-trash mt-3"
                          onClick={handleRemoveDeliveryBook}
                          style={{
                            cursor: "pointer",
                          }}
                        ></i>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="4"
                        className="mb-3"
                        controlId={`formBasicStoreEmail-${index}`}
                      >
                        <Form.Label>Store Email </Form.Label>
                        <Form.Control
                          type="text"
                          name={`storeEmail-${index}`}
                          required
                        />
                      </Form.Group>
                    </React.Fragment>
                  </Row>

                </>
              ))}
              <hr />
              <p
                onClick={handleNewDeliveryBook}
                style={{
                  cursor: "hand",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                Add New Site
              </p>
              <hr />

              <Button className={styles.btnRedColor} type="submit">
                Create
              </Button>

              <Link
                to="/admin/deliveryBooks"
                className="btn btn-secondary ms-5"
              >
                Cancel
              </Link>
              <p></p>
              {createDeliveryBookResponseState.error ?? ""}
            </Form>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default CreateDeliveryBookComponent;
