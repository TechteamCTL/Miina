import { useState, useEffect } from "react";
import { Table, Accordion } from "react-bootstrap";

import styles from "./ProductDescription.module.css";

const ProductDescription = ({ product }) => {
  const [standard, setStandard] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [videoUrl, setVideoUrl] = useState([]);

  const execustionDate = new Date("2024-1-15 11:30:00");

  let displayTable = [];
  let tableHeadings = [
    "SPECIFICATIONS",
    "SPECIFICATION",
    "TECHNICAL SPECIFICATIONS",
    "TECHNICAL SPECIFICATION",
    "TECHNICAL DETAILS",
  ];
  let headings = [
    "APPLICATION INFO",
    "DESCRIPTIONS",
    "DESCRIPTION",
    "FEATURES",
    "FEATURE",
    "SPECIFICATIONS",
    "SPECIFICATION",
    "TECHNICAL SPECIFICATIONS",
    "TECHNICAL SPECIFICATION",
    "TECHNICAL DETAILS",
  ];


  //Existing pdf list
  useEffect(() => {
    async function handlePdfs() {
      const pdfArray = [];
      if (product && product.pdfs) {
        for (const pdf of product.pdfs) {
          if (!pdf.path) {
            continue;
          }
          let pdfPath = pdf.path;
          if (pdfPath.includes("http://")) {
            pdfPath = pdfPath.replace("http://", "https://");
          }
          const isExists = await fetchPdf(pdfPath);
          if (isExists.ok) {
            pdfArray.push({
              url: pdfPath,
            });
          }
        }
      }
      setPdfs(pdfArray);
    }
    handlePdfs();
  }, [product]);

  async function fetchPdf(url) {
    try {
      const response = await fetch(url);
      return response;
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  }

  async function downloadPDF(pdfURL, pdfName) {
    if (pdfURL.includes("http:")) {
      pdfURL = pdfURL.replace("http:", "https:");
    }

    const response = await fetch(pdfURL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", pdfName);
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  }

  useEffect(() => {
    if (product?.standards) {
      if (product.standards.includes("/")) {
        const splittedStandards = product.standards.split("/");
        setStandard(splittedStandards);
      } else {
        setStandard([product.standards]);
      }
    }
  }, [product]);


  useEffect(() => {
    if (product?.videoUrl) {
      if (product.videoUrl.includes("/")) {
        const splittedVideoUrl = product.videoUrl.split("/");
        setVideoUrl(splittedVideoUrl);
      } else {
        setVideoUrl([product.videoUrl]);
      }
    }
  }, [product]);

  return <Accordion>
    <Accordion.Item eventKey="0" className={styles.accordeonItem}>
      <Accordion.Header className={styles.accordionHeader}>Specifications</Accordion.Header>
      <Accordion.Body>
        <div
          style={{
            whiteSpace: "pre-wrap",
            textAlign: "justify",
            width: "97%",
            overflowWrap: "break-word",
          }}
        >
          {new Date(product.createdAt) > execustionDate ? (
            <>
              <div>
                {product.description
                  ? product.description
                    .split("\n")
                    .map((item, index) => {
                      item = item.trimStart();
                      if (item !== "" && item !== " ") {
                        if (
                          item.includes(":") &&
                          item.charAt(0) !== "-"
                        ) {
                          displayTable.push(item);
                        } else if (
                          (headings.includes(
                            item.toUpperCase()
                          ) ||
                            item.charAt(0) === "<") &&
                          item.charAt(0) !== "-"
                        ) {
                          return (
                            <div
                              key={"boldUppercase" + index}
                              style={{ paddingTop: "15px" }}
                            >
                              <strong>
                                {!tableHeadings.includes(
                                  item.toUpperCase()
                                )
                                  ? item.charAt(0) === "<"
                                    ? item
                                      .slice(1)
                                      .toUpperCase()
                                      .replace('""', '"')
                                    : item
                                      .toUpperCase()
                                      .replace('""', '"')
                                  : ""}
                              </strong>
                            </div>
                          );
                        } else if (
                          item.includes(".") &&
                          item.charAt(0) !== "-"
                        ) {
                          return (
                            <div
                              key={"Normal" + index}
                              style={{ paddingTop: "10px" }}
                            >
                              {item.trimStart()}
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className="producr-detail-page-spec-item"
                              key={"table2" + index}
                              style={{
                                textIndent: "-10px",
                                paddingLeft: "15px",
                                lineHeight: "1.6rem",
                              }}
                            >
                              <i className="bi bi-dot " />
                              {item.charAt(0) === "-"
                                ? item
                                  .slice(1)
                                  .trimStart()
                                  .replace('""', '"')
                                : item
                                  .trimStart()
                                  .replace('""', '"')}
                            </div>
                          );
                        }
                      }
                    })
                  : ""}
              </div>
              <div>
                {displayTable.length > 0 ? (
                  <h6 style={{ paddingTop: "15px" }}>
                    <b>SPECIFICATIONS</b>
                  </h6>
                ) : (
                  ""
                )}
                <Table striped bordered hover>
                  <tbody>
                    {displayTable.length > 0
                      ? displayTable.map((items, idx) => {
                        if (items.includes(":")) {
                          let splitValues = items.split(":");
                          let key = splitValues[0];
                          let value = splitValues[1];
                          for (
                            let i = 2;
                            i < splitValues.length;
                            i++
                          ) {
                            value =
                              value + " : " + splitValues[i];
                          }
                          if (value !== "") {
                            return (
                              <tr key={"table1" + idx}>
                                <td
                                  style={{
                                    textAlign: "left",
                                  }}
                                >
                                  {key.toUpperCase()}
                                </td>
                                <td
                                  style={{
                                    textAlign: "left",
                                  }}
                                >
                                  {value
                                    ?.trimStart()
                                    .replace('""', '"')}
                                </td>
                              </tr>
                            );
                          } else {
                            return (
                              <tr key={"table1" + idx}>
                                <td
                                  style={{
                                    textAlign: "left",
                                    backgroundColor:
                                      "lightblue",
                                  }}
                                  colspan="2"
                                >
                                  <strong>
                                    {key.toUpperCase()}
                                  </strong>
                                </td>
                              </tr>
                            );
                          }
                        }
                      })
                      : ""}
                  </tbody>
                </Table>
              </div>
            </>
          ) : (
            <>
              {product.description
                ? product.description
                  .split(">")
                  .map((item, index) => {
                    if (
                      item.includes("^") &&
                      item.includes(":")
                    ) {
                      const tableItems = item
                        .split("^")
                        .filter(Boolean);
                      return (
                        <Table striped bordered hover>
                          <tbody>
                            {tableItems.map(
                              (tableItem, tableIndex) => {
                                if (tableItem.includes(":")) {
                                  let [key, value] =
                                    tableItem.split(":");
                                  return (
                                    <tr
                                      key={
                                        "table1" + tableIndex
                                      }
                                    >
                                      <td
                                        style={{
                                          textAlign: "left",
                                        }}
                                      >
                                        {key.toUpperCase()}
                                      </td>
                                      <td
                                        style={{
                                          textAlign: "left",
                                        }}
                                      >
                                        {value
                                          .trimStart()
                                          .replace('""', '"')}
                                      </td>
                                    </tr>
                                  );
                                } else {
                                  return (
                                    <div
                                      key={
                                        "table2" + tableIndex
                                      }
                                      style={{
                                        textIndent: "-10px",
                                        paddingLeft: "15px",
                                        lineHeight: "1.6rem",
                                      }}
                                    >
                                      <i className="bi bi-dot " />
                                      {tableItem
                                        .trimStart()
                                        .replace('""', '"')}
                                    </div>
                                  );
                                }
                              }
                            )}
                          </tbody>
                        </Table>
                      );
                    } else if (item.includes("^")) {
                      const tableItems = item
                        .split("^")
                        .filter(Boolean);
                      return (
                        <>
                          {tableItems.map(
                            (tableItem, tableIndex) => {
                              return (
                                <div
                                  className="producr-detail-page-spec-item"
                                  key={"table3" + tableIndex}
                                  style={{
                                    textIndent: "-10px",
                                    paddingLeft: "15px",
                                    lineHeight: "1.6rem",
                                    whiteSpace: "pre-line",
                                  }}
                                >
                                  <i className="bi bi-dot " />
                                  {tableItem
                                    .trimStart()
                                    .replace('""', '"')}
                                </div>
                              );
                            }
                          )}
                        </>
                      );
                    }
                    if (item.charAt(0) === "<") {
                      return (
                        <div key={"boldUppercase" + index}>
                          <strong>
                            {item
                              .slice(1)
                              .toUpperCase()
                              .replace('""', '"')}
                          </strong>
                        </div>
                      );
                    }

                    return (
                      <div key={"Normal" + index}>{item}</div>
                    );
                  })
                : ""}
            </>
          )}
        </div>
      </Accordion.Body>
    </Accordion.Item>
    {pdfs.length > 0 && <Accordion.Item eventKey="1" className={styles.accordeonItem}>
      <Accordion.Header className={styles.accordionHeader}>Downloads</Accordion.Header>
      <Accordion.Body>
        {pdfs &&
          pdfs.map((pdf, idx) => {
            const pdfName = pdf.url?.split("/").pop();
            return pdf.url ? (
              <div
                className="border border-light border-2 m-2 p-1"
                key={"pdfDiv" + idx}
              >
                <button
                  onClick={() =>
                    downloadPDF(pdf.url, pdfName)
                  }
                  className="border-0"
                  key={"pdfButton" + idx}
                  style={{
                    backgroundColor: "transparent",
                    color: "#1e4881",
                  }}
                >
                  <i className="bi bi-file-earmark-pdf">
                    {" "}
                    {pdfName}
                  </i>
                </button>
              </div>
            ) : (
              ""
            );
          })}
      </Accordion.Body>
    </Accordion.Item >}

    {standard.length > 0 && <Accordion.Item eventKey="2" className={styles.accordeonItem}>
      <Accordion.Header className={styles.accordionHeader}>Standards</Accordion.Header>
      <Accordion.Body>
        <div className="border border-light border-2 m-3 p-3 d-flex justify-content-left">
          {standard &&
            standard.map((item, index) => {
              return (
                <img
                  key={"standards" + index}
                  src={`https://minadmin.b-cdn.net/STANDARDS/${item}.jpg`}
                  target="_blank"
                  alt=""
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              );
            })}
        </div>
      </Accordion.Body>
    </Accordion.Item>}

    {videoUrl.length > 0 && <Accordion.Item eventKey="3" className={styles.accordeonItem}>
      <Accordion.Header className={styles.accordionHeader}>Video</Accordion.Header>
      <Accordion.Body>
        <div className="border border-light border-2 m-3 p-3 d-flex justify-content-left">
          {videoUrl &&
            videoUrl.map((item, index) => {
              return (
                <div>
                  <video width="560" height="315" controls controlsList="nofullscreen nodownload" disablePictureInPicture>
                    <source src={`https://ctladmin.b-cdn.net/video/${item}.mp4`} type="video/mp4" />
                  </video>
                </div>
              );
            })}
        </div>
      </Accordion.Body>
    </Accordion.Item>}
  </Accordion>
}

export default ProductDescription;