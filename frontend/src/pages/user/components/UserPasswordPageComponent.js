import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

import styles from "./UserPasswordPageComponent.module.css";

const UserPasswordPageComponent = () => {
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const email = userInfo.email.toLowerCase();

    try {
      setSubmitting(true);
      setMessage("");
      setSuccessMessage("");
      const response = await axios.post("/api/users/forgotPassword", { email });
      if (response.status === 200) {
        setSuccessMessage("A password reset link has been sent to your email address. Please check your email inbox.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        handleNonSuccessStatus(error.response);
      } else {
        setMessage("Failed to reset password. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleNonSuccessStatus = (response) => {
    if (response.status === 400) {
      setMessage("Email address is required.");
    } else if (response.status === 404) {
      setMessage("User not found. Please try again.");
    } else if (response.status === 401) {
      setMessage(
        "User email is not verified. Please contact our customer service for assistance."
      );
    } else {
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.passwordChange}>
    <div className={styles.passwordChangeWrapper}>
      <img alt="Miina Group Family Emblem" src="/images/FamilyEmblemWhite.png" className={styles.emblem} />
      <div>
        <h2 className={styles.title}>Change your password?</h2>
        <p className={styles.text}>
          For security reasons, we need to confirm your identity.
          <br /><br />
          A link will be sent to your email to reset your password.
        </p>
        <Form noValidate onSubmit={handleSubmit} className="w-50">
          <Button className={styles.changeBtn} type="submit">
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Form>
        {message && (
          <p className="error-message text-danger mt-3 mb-0">{message}</p>
        )}
        {successMessage && (
          <p className="error-message mt-3 mb-0">{successMessage}</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default UserPasswordPageComponent;
