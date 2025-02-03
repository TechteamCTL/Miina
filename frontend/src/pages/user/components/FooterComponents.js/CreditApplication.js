import React from "react";

const CreditApplication = () => {
  return (
    <div className="container">
      <br />
      <h1 className="service">Credit Application:</h1>
      <br />
      <a
        href="/pdfpreview?v1706160202/documents/Miina_Credit-Application-Form.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary btn-block mb-4 CTL_btn p-1 ps-2 pe-2"
      >
        Credit Application Form <i class="bi bi-file-earmark-pdf-fill"></i>
      </a>

    </div>
  );
};

export default CreditApplication;
