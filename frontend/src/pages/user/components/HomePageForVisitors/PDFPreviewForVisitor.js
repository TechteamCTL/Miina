import React, { useState, useEffect } from "react";

const PDFPreviewForVisitor = () => {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const path = window.location.search;
    const pathSegment = path.split('?')[1];
    if (pathSegment) {
      const constructedUrl = `https://minadmin.b-cdn.net/documents/${pathSegment}`;
      setPdfUrl(constructedUrl);
    }
  }, []);

  return (
    <iframe
      src={pdfUrl}
      width="100%"
      height={window.innerHeight}
      title="CTL_pdf"
    />
  );
};

export default PDFPreviewForVisitor;
