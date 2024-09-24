import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import ForgotPasswordComponent from "./ForgotPasswordComponent";
import LoggedInVerifySiteComponent from "./LoggedInVerifySiteComponent";
import axios from "axios";

const LoginPageComponent = ({
  loginUserApiRequest,
  reduxDispatch,
  setReduxUserState,
  getdeliveryBooks,
}) => {
  const [validated, setValidated] = useState(false);
  const [loginUserResponseState, setLoginUserResponseState] = useState({
    success: "",
    error: "",
    loading: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [showVerifySiteModal, setShowVerifySiteModal] = useState(false);
  const [shouldRenderVerifySiteModal, setShouldRenderVerifySiteModal] =
    useState(false);

  const navigate = useNavigate();

  const currentUrl = window.location.href;
  // if (currentUrl.includes("Register=true")) {
  //   window.location.assign("/");
  // }
  //console.log("currentUrl", currentUrl);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const email = form.email.value;
    const password = form.password.value;
    const doNotLogout = true;

    if (event.currentTarget.checkValidity() === true && email && password) {
      setLoginUserResponseState({ loading: true });
      loginUserApiRequest(email, password, doNotLogout, ipAddress)
        .then((res) => {
          setLoginUserResponseState({
            success: res.success,
            loading: false,
            error: "",
          });

          if (res.userLoggedIn) {
            reduxDispatch(setReduxUserState(res.userLoggedIn));
          }
          if (
            res.success === "user logged in" &&
            !res.userLoggedIn.siteVerified
          ) {
            setEmail(res.userLoggedIn.email);
            setShouldRenderVerifySiteModal(true);
            localStorage.setItem("verificationPending", "true");
            setShowVerifySiteModal(true);
          } else if (
            res.success === "user logged in" &&
            !res.userLoggedIn.isAdmin
          ) {
            if (
              currentUrl.includes("login") ||
              currentUrl.includes("Register")
            ) {
              window.location.assign("/");
            } else {
              window.location.assign(currentUrl);
            }
          } else {
            if (
              currentUrl.includes("login") ||
              currentUrl.includes("Register")
            ) {
              window.location.assign("/admin/orders");
            } else {
              window.location.assign(currentUrl);
            }
          }
        })
        .catch((er) => {
          const errorMessage = er.response.data.message || er.response.data;
          setLoginUserResponseState({ error: errorMessage, loading: false });
          setErrorMessage(errorMessage);
        });
    }

    setValidated(true);

    event.preventDefault();

    if (
      email.endsWith("@slrltd.com") ||
      email.endsWith("@focusminerals.com.au") ||
      email.endsWith("@ctlservices.com.au") ||
      email.endsWith("@ctlaus.com") ||
      email.endsWith("@evolutionmining.com")
    ) {
      fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => setIpAddress(data.ip));
    } else {
      setErrorMessage("You are not authorized to login!");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/get-token");
        // console.log("Authorized");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // console.log("Unauthorized");
          localStorage.removeItem("userInfo");
        } else {
          console.error(error);
        }
      }
    };
    checkAuth();
  }, []);

  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  useEffect(() => {
    const verificationPending = localStorage.getItem("verificationPending");

    // console.log(userInfo.siteVerified, verificationPending);

    if (userInfo.siteVerified) {
      localStorage.removeItem("verificationPending");
      setTimeout(() => {
        window.location.href = "/home";
      }, 500);
    }

    if (verificationPending) {
      setEmail(userInfo.email);
      setShouldRenderVerifySiteModal(true);
      localStorage.setItem("verificationPending", "true");
      setShowVerifySiteModal(true);
    }
  }, [userInfo]);

  const refreshUserInfo = () => {
    window.location.reload();
  };

  return (
    <>
      <Container 
      // className="login_desktop"
      >
        <Row className="mt-5 justify-content-md-center">
          <Col md={6} className="w-100">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name="email"
                  required
                  type="email"
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    name="password"
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    minLength={6}
                  />
                  <InputGroup.Text>
                    <i
                      className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"
                        }`}
                      onClick={togglePasswordVisibility}
                      aria-hidden="true"
                      style={{ cursor: "pointer" }}
                    ></i>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  name="doNotLogout"
                  type="checkbox"
                  label="Do not logout"
                />
              </Form.Group>

              <Button className="mb-3" variant="primary" type="submit">
                {loginUserResponseState &&
                  loginUserResponseState.loading === true ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  ""
                )}
                Login
              </Button>

              <Alert
                show={
                  loginUserResponseState &&
                  loginUserResponseState.error === "wrong credentials"
                }
                variant="danger"
              >
                Incorrect email or password!
              </Alert>
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
            </Form>
            <ForgotPasswordComponent />
          </Col>
        </Row>
      </Container>

      {/* <Container>
        <div className="login_mobile">
          𝙒𝙚 𝙖𝙥𝙤𝙡𝙤𝙜𝙞𝙨𝙚 𝙛𝙤𝙧 𝙩𝙝𝙚 𝙞𝙣𝙘𝙤𝙣𝙫𝙚𝙣𝙞𝙚𝙣𝙘𝙚, 𝙗𝙪𝙩 𝙤𝙪𝙧 𝙬𝙚𝙗𝙨𝙞𝙩𝙚 𝙞𝙨 𝙘𝙪𝙧𝙧𝙚𝙣𝙩𝙡𝙮 𝙤𝙥𝙩𝙞𝙢𝙞𝙨𝙚𝙙 𝙛𝙤𝙧 𝙙𝙚𝙨𝙠𝙩𝙤𝙥 𝙪𝙨𝙚𝙧𝙨 𝙤𝙣𝙡𝙮. 𝙁𝙤𝙧 𝙩𝙝𝙚 𝙗𝙚𝙨𝙩 𝙚𝙭𝙥𝙚𝙧𝙞𝙚𝙣𝙘𝙚, 𝙥𝙡𝙚𝙖𝙨𝙚 𝙖𝙘𝙘𝙚𝙨𝙨 𝙤𝙪𝙧 𝙨𝙞𝙩𝙚 𝙪𝙨𝙞𝙣𝙜 𝙖 𝙙𝙚𝙨𝙠𝙩𝙤𝙥 𝙘𝙤𝙢𝙥𝙪𝙩𝙚𝙧. 𝙒𝙚 𝙖𝙥𝙥𝙧𝙚𝙘𝙞𝙖𝙩𝙚 𝙮𝙤𝙪𝙧 𝙪𝙣𝙙𝙚𝙧𝙨𝙩𝙖𝙣𝙙𝙞𝙣𝙜 𝙖𝙣𝙙 𝙖𝙧𝙚 𝙬𝙤𝙧𝙠𝙞𝙣𝙜 𝙩𝙤 𝙨𝙪𝙥𝙥𝙤𝙧𝙩 𝙢𝙤𝙧𝙚 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 𝙞𝙣 𝙩𝙝𝙚 𝙛𝙪𝙩𝙪𝙧𝙚.
        </div>
      </Container> */}
      {/* {shouldRenderVerifySiteModal && (
        <LoggedInVerifySiteComponent
          show={showVerifySiteModal}
          onHide={() => setShowVerifySiteModal(false)}
          refreshUserInfo={refreshUserInfo}
          getdeliveryBooks={getdeliveryBooks}
          email={email}
        />
      )} */}
    </>
  );
};

export default LoginPageComponent;
