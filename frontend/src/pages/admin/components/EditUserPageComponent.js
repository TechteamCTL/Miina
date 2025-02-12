import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GoBackButton from "./GoBackButton";
import FetchAuthFromServer from "../../../components/Utils/FetchAuthFromServer";
import MaskedInput from 'react-text-mask';
import styles from "../AdminPagesStyles.module.css"

const EditUserPageComponent = ({ updateUserApiRequest, fetchUser, getdeliveryBooks }) => {
  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState([]);
  const [isAdminState, setIsAdminState] = useState(false);
  const [isPD, setIsPD] = useState(false);
  const [isSiteManager, setIsSiteManager] = useState(false);
  const [isSitePerson, setIsSitePerson] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isSales, setIsSales] = useState(false);
  const [isMarketing, setIsMarketing] = useState(false);
  const [accounts, setAccounts] = useState(false);
  const [abn, setAbn] = useState();
  const [updateUserResponseState, setUpdateUserResponseState] = useState({
    message: "",
    error: "",
  }); // handling errors and messages
  const abnMask = [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/];
  const [userRole, setUserRole] = useState();
  const [otherRole, setOtherRole] = useState();
  const [deliverySites, setDeliverySites] = useState()
  const [deliveryLocation, setDeliveryLocation] = useState()
  const [company, setCompany] = useState()

  const handleOtherRole = (e) => {
    setOtherRole(e.target.value);
  }

  const handleChangeRole = (e) => {
    setUserRole(e.target.value)
  }

  const handleAbn = (e) => {
    const newValue = e.target.value;
    setAbn(newValue);
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const isAuth = FetchAuthFromServer();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;
    const name = form.name.value;
    const lastName = form.lastName.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const mobile = form.mobile.value;
    const company = form.company.value;
    const location = deliveryLocation;
    let ipAddress = form.ipAddress.value;
    const isAdmin = form.isAdmin.checked;
    const verified = form.verified.checked;
    const isPD = form.isPD.checked;
    const isSiteManager = form.isSiteManager.checked;
    const isSitePerson = form.isSitePerson.checked;
    const isSales = form.isSales.checked;
    const isMarketing = form.isMarketing.checked;
    const accounts = form.accounts.checked;
    const abn = form.abn.value;
    const role = userRole === "other role" ? otherRole : userRole;

    // Set ipAddress to "" if "remove" is entered
    if (ipAddress === "remove") {
      ipAddress = "";
    }

    if (event.currentTarget.checkValidity() === true) {
      updateUserApiRequest(
        id,
        name,
        lastName,
        email,
        phone,
        mobile,
        ipAddress,
        isAdmin,
        verified,
        isPD,
        isSiteManager,
        isSitePerson,
        company,
        location,
        isSales,
        isMarketing,
        accounts,
        abn,
        role
      )
        .then((data) => {
          if (data === "user updated") {
            navigate("/admin/users");
          }
        })
        .catch((er) => {
          setUpdateUserResponseState({
            error: er.response.data.message
              ? er.response.data.message
              : er.response.data,
          });
        });
    }

    setValidated(true);
  };

  useEffect(() => {
    fetchUser(id)
      .then((data) => {
        setUser(data);
        setIsAdminState(data.isAdmin);
        setVerified(data.verified);
        setIsPD(data.isPD);
        setIsSiteManager(data.isSiteManager);
        setIsSitePerson(data.isSitePerson);
        setAccounts(data.accounts);
        setIsSales(data.isSales);
        setIsMarketing(data.isMarketing);
        setUserRole(data.role);
        setAbn(data.abn)
      })
      .catch((er) =>
        console.log(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );
  }, [id]);

  useEffect(() => {
    if (user.email) {
      getdeliveryBooks(user.email)
        .then((data) => {
          setCompany(data[0]?.companyName)
          setDeliverySites(data[0]?.sites)
          data[0]?.sites?.some((site) => {
            if (site?.name.toLowerCase() === user?.location.toLowerCase())
              setDeliveryLocation(user.location)
          })
        }).catch((err) => console.log(err));
    }
  }, [user])

  const handleChangeLocation = (e) => {
    setDeliveryLocation(e.target.value)
  }

  return (
    <Container style={{ paddingBottom: "350px" }}>
      <Row className="justify-content-md-center mt-5 content-container">
        <Col md={2}>
          <GoBackButton />
        </Col>
        <Col md={6}>
          <h1>EDIT USER</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                name="name"
                required
                type="text"
                defaultValue={user.name}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                name="lastName"
                required
                type="text"
                defaultValue={user.lastName}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                defaultValue={user.email}

              />
            </Form.Group>
            {userRole === "other role" && <Form.Group className="mb-3" controlId="formBasicOtherRole">
              <Form.Label>User Role</Form.Label>
              <Form.Control
                required
                type="text"
                name="otherRole"
                placeholder="Job Title"
                onChange={handleOtherRole}
                value={otherRole}
              />
              <Form.Control.Feedback type="invalid">
                Please mention your Job Title.{" "}
              </Form.Control.Feedback>
            </Form.Group>}
            <Form.Group className="mb-3" controlId="formBasicAbn">
              <Form.Label>ABN</Form.Label>
              <MaskedInput
                mask={abnMask}
                placeholder="ABN"
                guide={false}
                value={abn}
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
            <Form.Group className="mb-2" controlId="formBasicPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                required
                type="number"
                defaultValue={user.phone}
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicMobile">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                name="mobile"
                required
                type="number"
                defaultValue={user.mobile}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDeliveryCompany">
              <Form.Label>Company</Form.Label>
              <Form.Control
                name="company"
                required
                type="txt"
                defaultValue={user.company !== "No Company" ? user.company : company}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicBillLocation">
              <Form.Label>Location</Form.Label>
              <Form.Select
                required
                name="location"
                onChange={handleChangeLocation}
                style={{ textTransform: "capitalize" }}
                value={deliveryLocation || user.location || ""}
              >
                <option value="">--Select Site--</option>
                {
                  deliverySites?.map((site, idx) => (
                    <option key={idx} value={site.name} style={{ textTransform: "capitalize" }}>
                      {site?.name.toLowerCase()}
                    </option>))
                }
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicipAddress">
              <Form.Label>
                IP Address (enter 'remove' to remove IP address)
              </Form.Label>
              <Form.Control
                name="ipAddress"
                required
                type="text"
                placeholder="remove"
                defaultValue={user.ipAddress !== "" ? user.ipAddress : "remove"}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicIsAdmin">
              <Row>
                <Col md={2}>
                  <Form.Check
                    name="verified"
                    type="checkbox"
                    label="Verified"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                  />
                </Col>
                <Col md={2}>
                  <Form.Check
                    name="isAdmin"
                    type="checkbox"
                    label="Admin"
                    checked={isAdminState}
                    onChange={(e) => setIsAdminState(e.target.checked)}
                  />
                </Col>
                <Col md={2} hidden>
                  <Form.Check
                    name="isPD"
                    type="checkbox"
                    label="PD"
                    checked={isPD}
                    onChange={(e) => setIsPD(e.target.checked)}

                  />
                </Col>
                <Col md={3} hidden>
                  <Form.Check
                    name="isSiteManager"
                    type="checkbox"
                    label="Site Manager"
                    checked={isSiteManager}
                    onChange={(e) => setIsSiteManager(e.target.checked)}

                  />
                </Col>
                <Col md={3}>
                  <Form.Check
                    name="isSitePerson"
                    type="checkbox"
                    label="Site Person"
                    checked={isSitePerson}
                    onChange={(e) => setIsSitePerson(e.target.checked)}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={2} hidden>
                  <Form.Check
                    name="isSales"
                    type="checkbox"
                    label="Sales"
                    checked={isSales}
                    onChange={(e) => setIsSales(e.target.checked)}

                  />
                </Col>
                <Col md={2} hidden>
                  <Form.Check
                    name="accounts"
                    type="checkbox"
                    label="Accounts"
                    checked={accounts}
                    onChange={(e) => setAccounts(e.target.checked)}

                  />
                </Col>
                <Col md={3} hidden>
                  <Form.Check
                    name="isMarketing"
                    type="checkbox"
                    label="Marketing"
                    checked={isMarketing}
                    onChange={(e) => setIsMarketing(e.target.checked)}

                  />
                </Col>
              </Row>
            </Form.Group>
            <Button type="submit" className={styles.btnRedColor}>
              UPDATE
            </Button>
            {updateUserResponseState.error}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditUserPageComponent;
