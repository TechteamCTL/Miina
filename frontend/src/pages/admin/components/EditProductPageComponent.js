import {
  Row,
  Col,
  Container,
  Form,
  Button,
  CloseButton,
  Table,
  Alert,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useState, useEffect, Fragment, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import GoBackButton from "./GoBackButton";
import { useSelector } from "react-redux";
import styles from "../AdminPagesStyles.module.css";

const EditProductPageComponent = ({
  categories,
  fetchProduct,
  updateProductApiRequest,
  reduxDispatch,
  saveAttributeToCatDoc,
  imageDeleteHandler,
  uploadHandler,
  uploadImagesApiRequest,
  uploadImagesCloudinaryApiRequest,
  uploadPdfApiRequest,
  uploadPdfCloudinaryApiRequest,
  pdfDeleteHandler,
}) => {
  const [validated, setValidated] = useState(false);
  const [product, setProduct] = useState({});
  const [updateProductResponseState, setUpdateProductResponseState] = useState({
    message: "",
    error: "",
  });

  const [attributesFromDb, setAttributesFromDb] = useState([]);
  const [attributesTable, setAttributesTable] = useState([]);
  const [categoryChoosen, setCategoryChoosen] = useState("Choose category");
  const [newAttrKey, setNewAttrKey] = useState(false);
  const [newAttrValue, setNewAttrValue] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [pdfRemoved, setPdfRemoved] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);
  const attrVal = useRef(null);
  const attrKey = useRef(null);
  const createNewAttrKey = useRef(null);
  const createNewAttrVal = useRef(null);

  const [stockLength, setStockLength] = useState(0);
  const setValuesForAttrFromDbSelectForm = (e) => {
    if (e.target.value !== "Choose attribute") {
      let selectedAttr = attributesFromDb.find(
        (item) => item.key === e.target.value
      );
      let valuesForAttrKeys = attrVal.current;
      if (selectedAttr && selectedAttr.value.length > 0) {
        while (valuesForAttrKeys.options.length) {
          valuesForAttrKeys.remove(0);
        }
        valuesForAttrKeys.options.add(new Option("Choose attribute value"));
        selectedAttr.value.map((item) => {
          valuesForAttrKeys.add(new Option(item));
          return "";
        });
      }
    }
  };

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct(id)
      .then((product) => {
        setProduct(product);
        setStockLength(product.stock.length);
      })
      .catch((er) => console.log(er));
  }, [id, imageRemoved, imageUploaded]);

  useEffect(() => {
    fetchProduct(id)
      .then((product) => setProduct(product))
      .catch((er) => console.log(er));
  }, [id, pdfRemoved, pdfUploaded]);

  const calculateNewExpireDate = () => {
    return moment().add(28, "days").format("HH:mm:ss DD/MM/YYYY");
  };

  const validateExpireDate = (dateString) => {
    const format = "HH:mm:ss DD/MM/YYYY";
    return moment(dateString, format, true).isValid();
  };

  const [dynamicPrices, setDynamicPrices] = useState({});

  const updateDynamicPrice = (index, field, value, item) => {
    const newDynamicPrices = { ...dynamicPrices };

    if (!newDynamicPrices[index]) {
      newDynamicPrices[index] = {
        purchaseprice: item.purchaseprice,
        margin: 0,
        calculatedPrice: item.price,
      };
    }
    newDynamicPrices[index][field] = value;

    if (
      newDynamicPrices[index].purchaseprice &&
      newDynamicPrices[index].margin
    ) {
      newDynamicPrices[index].calculatedPrice = (
        newDynamicPrices[index].purchaseprice /
        (1 - newDynamicPrices[index].margin / 100)
      ).toFixed(2);
    }

    setDynamicPrices(newDynamicPrices);
  };

  const handlePriceChange = (index, value) => {
    const newDynamicPrices = { ...dynamicPrices };
    newDynamicPrices[index] = {
      ...newDynamicPrices[index],
      calculatedPrice: parseFloat(value),
    };
    setDynamicPrices(newDynamicPrices);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    const stock = [];
    for (
      let i = 0;
      i < document.querySelectorAll(".stockExisting").length;
      i++
    ) {
      const _id = document.getElementsByName(`_id-${i}`)[0].value;
      let price;

      if (dynamicPrices[i]?.calculatedPrice) {
        price = dynamicPrices[i].calculatedPrice;
      } else {
        price = document.getElementsByName(`price-${i}`)[0].value;
      }

      let purchaseprice;

      if (dynamicPrices[i]?.purchaseprice) {
        purchaseprice = dynamicPrices[i].purchaseprice;
      } else {
        purchaseprice = document.getElementsByName(`purchaseprice-${i}`)[0]
          .value;
      }
      const attrs = document.getElementsByName(`attrs-${i}`)[0].value;
      const mnasku = document.getElementsByName(`mnasku-${i}`)[0].value;
      const suppliersku = document.getElementsByName(`suppliersku-${i}`)[0]
        .value;

      stock.push({
        _id,
        price,
        purchaseprice,
        attrs,
        mnasku,
        suppliersku,
      });
    }

    const stockNew = [];
    for (let i = 0; i < document.querySelectorAll(".stockNew").length; i++) {
      let price;
      if (dynamicPrices[i + stockLength]?.calculatedPrice) {
        price = dynamicPrices[i + stockLength].calculatedPrice;
      } else {
        price = document.getElementsByName(`price-${i}`)[0].value;
      }
      const purchaseprice = dynamicPrices[i + stockLength].purchaseprice;
      const attrs = document.getElementsByName(`newAttrs-${i}`)[0].value;
      const mnasku = document.getElementsByName(`newMnasku-${i}`)[0].value;
      const suppliersku = document.getElementsByName(`newSuppliersku-${i}`)[0]
        .value;
      stockNew.push({
        price,
        purchaseprice,
        attrs,
        mnasku,
        suppliersku,
      });
    }
    const formInputs = {
      name: form.name.value,
      description: form.description.value,
      saleunit: form.saleunit.value,
      displayPrice: form.displayPrice.value,
      category: form.category.value,
      editedBy: userInfo.name + " " + userInfo.lastName,
      attributesTable: [],
      tags: form.tags.value,
      stock: [...stock, ...stockNew],
    };

    const priceError = formInputs.stock.some(
      (item) => item.price >= formInputs.displayPrice / formInputs.saleunit
    );

    if (!priceError) {
      alert("The DISPLAY PRICE have to be less than the ITEM PRICE !!!");
      return;
    }

    if (formInputs.category === "Choose category") {
      alert("Please choose a CATEGORY !!!!!");
      return;
    }

    if (event.currentTarget.checkValidity() === true) {
      updateProductApiRequest(id, formInputs)
        .then((data) => {
          if (data.message === "product updated") navigate("/admin/products");
        })
        .catch((er) =>
          setUpdateProductResponseState({
            error: er.response.data.message
              ? er.response.data.message
              : er.response.data,
          })
        );
    }

    setValidated(true);
  };

  useEffect(() => {
    let categoryOfEditedProduct = categories?.find(
      (item) => item.name === product.category
    );
    if (categoryOfEditedProduct) {
      const mainCategoryOfEditedProduct =
        categoryOfEditedProduct.name.split("/")[0];
      const mainCategoryOfEditedProductAllData = categories?.find(
        (categoryOfEditedProduct) =>
          categoryOfEditedProduct.name === mainCategoryOfEditedProduct
      );
      if (
        mainCategoryOfEditedProductAllData &&
        mainCategoryOfEditedProductAllData.attrs.length > 0
      ) {
        setAttributesFromDb(mainCategoryOfEditedProductAllData.attrs);
      }
    }
    setAttributesTable(product.attrs);
    setCategoryChoosen(product.category);
  }, [product]);

  const changeCategory = (e) => {
    const highLevelCategory = e.target.value.split("/")[0];
    const highLevelCategoryAllData = categories?.find(
      (cat) => cat.name === highLevelCategory
    );
    if (highLevelCategoryAllData && highLevelCategoryAllData.attrs) {
      setAttributesFromDb(highLevelCategoryAllData.attrs);
    } else {
      setAttributesFromDb([]);
    }

    setCategoryChoosen(e.target.value);
  };

  const attributeValueSelected = (e) => {
    if (e.target.value !== "Choose attribute value") {
      setAttributesTableWrapper(attrKey.current.value, e.target.value);
    }
  };

  const setAttributesTableWrapper = (key, val) => {
    setAttributesTable((attr) => {
      if (attr.length !== 0) {
        let keyExistsInOldTable = false;
        let modifiedTable = attr.map((item) => {
          if (item.key === key) {
            keyExistsInOldTable = true;
            item.value = val;
            return item;
          } else {
            return item;
          }
        });
        if (keyExistsInOldTable) return [...modifiedTable];
        else return [...modifiedTable, { key: key, value: val }];
      } else {
        return [{ key: key, value: val }];
      }
    });
  };

  const deleteAttribute = (key) => {
    setAttributesTable((table) => table.filter((item) => item.key !== key));
  };

  const checkKeyDown = (e) => {
    if (e.code === "Enter") e.preventDefault();
  };

  return (
    <Container style={{ paddingBottom: "300px" }} fluid>
      <Row className="justify-content-md-center mt-5 content-container ">
        <Col md={1}>
          <GoBackButton />
        </Col>
        <Col md={6}>
          <h1>EDIT PRODUCT</h1>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            onKeyDown={(e) => checkKeyDown(e)}
          >
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                required
                type="text"
                defaultValue={product.name}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                required
                as="textarea"
                rows={3}
                defaultValue={product.description}
              />
            </Form.Group>

            <hr
              style={{
                color: "#000000",
                backgroundColor: "#000000",
                height: 0.5,
                borderColor: "#000000",
              }}
            />
            {product &&
              product.stock &&
              product.stock.map((item, index) => (
                <div key={item._id}>
                  <>
                    <span className="stockExisting text-primary">
                      Stock : {index + 1}
                    </span>
                    <Row>
                      <React.Fragment>
                        <Form.Group
                          as={Col}
                          md="2"
                          className="mb-3"
                          controlId={`formBasic_id-${index}`}
                          hidden
                        >
                          <Form.Label>Object ID</Form.Label>
                          <Form.Control
                            name={`_id-${index}`}
                            required
                            type="text"
                            defaultValue={item._id}
                          />
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="2"
                          className="mb-3"
                          controlId={`formBasicAttrs-${index}`}
                        >
                          <Form.Label>Attrs</Form.Label>
                          <Form.Control
                            name={`attrs-${index}`}
                            required
                            type="text"
                            defaultValue={item.attrs}

                          />
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          className="mb-3"
                          controlId={`formBasicMargin-${index}`}
                        >
                          <Form.Label>Margin (%)</Form.Label>
                          <Form.Control
                            name={`margin-${index}`}
                            type="number"
                            defaultValue={(((item.price - item.purchaseprice) * 100) / item.price).toFixed(2)}
                            onChange={(e) =>
                              updateDynamicPrice(
                                index,
                                "margin",
                                parseFloat(e.target.value),
                                item
                              )
                            }
                          />
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          className="mb-3"
                          controlId={`formBasicMNASKU-${index}`}
                        >
                          <Form.Label>Miina SKU</Form.Label>
                          <Form.Control
                            name={`mnasku-${index}`}
                            required
                            type="text"
                            defaultValue={item.mnasku}

                          />
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          className="mb-3"
                          controlId={`formBasicSupplierSKU-${index}`}
                        >
                          <Form.Label>Supplier SKU</Form.Label>
                          <Form.Control
                            name={`suppliersku-${index}`}
                            required
                            type="text"
                            defaultValue={item.suppliersku}

                          />
                        </Form.Group>
                      </React.Fragment>
                    </Row>
                    <Row>
                      <React.Fragment key={index}>
                        <Form.Group
                          as={Col}
                          md="3"
                          className="mb-3"
                          controlId={`formBasicPrice-${index}`}
                        >
                          <Form.Label className="text-danger">
                            Product Price
                          </Form.Label>
                          <Form.Control
                            name={`price-${index}`}
                            required
                            type="number"
                            value={
                              dynamicPrices[index]?.calculatedPrice ??
                              item.price
                            }
                            onChange={(e) =>
                              handlePriceChange(index, e.target.value)
                            }
                          />
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          className="mb-3"
                          controlId={`formPurchasePrice-${index}`}
                        >
                          <Form.Label className="text-danger">
                            Purchase Price
                          </Form.Label>
                          <Form.Control
                            name={`purchaseprice-${index}`}
                            required
                            value={
                              dynamicPrices[index]?.purchaseprice ??
                              item.purchaseprice
                            }
                            type="number"
                            onChange={(e) =>
                              updateDynamicPrice(
                                index,
                                "purchaseprice",
                                parseFloat(e.target.value),
                                item
                              )
                            }
                          />
                        </Form.Group>
                      </React.Fragment>
                    </Row>
                  </>
                </div>
              ))}

            <hr />
            <Row>
              <Form.Group
                as={Col}
                md="3"
                className="mb-3"
                controlId="formBasicSLRBuyingPrice"
              >
                <Form.Label className="text-danger">Display Price</Form.Label>

                <Form.Control
                  name="displayPrice"
                  type="number"
                  step="0.01"
                  defaultValue={product.displayPrice}
                  required
                />
              </Form.Group>
              <Form.Group
                as={Col}
                md="3"
                className="mb-3"
                controlId="formBasicSaleunit"
              >
                <Form.Label>Sale Unit</Form.Label>
                <Form.Control
                  name="saleunit"
                  required
                  type="number"
                  defaultValue={product.saleunit}
                  disabled
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formBasicCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                required
                name="category"
                aria-label="Default select example"
                disabled
                onChange={changeCategory}
              >
                <option value="Choose category">Choose category</option>
                {categories?.map((category, idx) => {
                  return product.category === category.name ? (
                    <option selected key={idx} value={category.name}>
                      {category.name}
                    </option>
                  ) : (
                    <option key={idx} value={category.name}>
                      {category.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicTags">
              <Form.Label>
                Tags / Keywords
              </Form.Label>
              <Form.Control
                name="tags"
                type="text"
                defaultValue={product.tags}
                disabled
              />
            </Form.Group>

            {attributesFromDb.length > 0 && (
              <Row className="mt-5">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formBasicAttributes">
                    <Form.Label>Choose atrribute and set value</Form.Label>
                    <Form.Select
                      name="atrrKey"
                      aria-label="Default select example"
                      ref={attrKey}
                      onChange={setValuesForAttrFromDbSelectForm}
                    >
                      <option>Choose attribute</option>
                      {attributesFromDb.map((item, idx) => (
                        <Fragment key={idx}>
                          <option value={item.key}>{item.key}</option>
                        </Fragment>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className="mb-3"
                    controlId="formBasicAttributeValue"
                  >
                    <Form.Label>Attribute value</Form.Label>
                    <Form.Select
                      name="atrrVal"
                      aria-label="Default select example"
                      ref={attrVal}
                      onChange={attributeValueSelected}
                    >
                      <option>Choose attribute value</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              {attributesTable && attributesTable.length > 0 && (
                <Table hover>
                  <thead>
                    <tr>
                      <th>Attribute</th>
                      <th>Value</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attributesTable.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.key}</td>
                        <td>{item.value}</td>
                        <td>
                          <CloseButton
                            onClick={() => deleteAttribute(item.key)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Row>

            <Alert show={newAttrKey && newAttrValue} variant="primary">
              After typing attribute key and value press enter on one of the
              field
            </Alert>

            {/* ********* Documents upload ********* */}
            <Form.Group controlId="formFileMultiple" className="mb-3 mt-3">
              {/* ********* images upload ********* */}
              <Form.Label>Images</Form.Label>
              <Row>
                {product.images &&
                  product.images.map((image, idx) => (
                    <Col key={idx} style={{ position: "relative" }} xs={3}>
                      <Image
                        crossOrigin="anonymous"
                        src={image.path ?? null}
                        fluid
                      />
                    </Col>
                  ))}
              </Row>
            </Form.Group>
            {/* ********* Description PDF ********* */}
            <Form.Group controlId="formFileMultiplePDF" className="mb-3 mt-3">
              <Form.Label>PDF</Form.Label>
              <Row>
                {product.pdfs &&
                  product.pdfs.map((pdf, idx) => {
                    const pdfName = pdf.path && pdf.path.split("/").pop();
                    return (
                      <Col key={idx} style={{ position: "relative" }} xs={3}>
                        <i className="bi bi-file-pdf">{pdfName}</i>{" "}
                      </Col>
                    );
                  })}
              </Row>
            </Form.Group>

            <Button className={styles.btnRedColor} type="submit">
              UPDATE
            </Button>

            <Link to="/admin/products" className="btn btn-secondary mb-0 ms-5">
              Cancel
            </Link>
            <p></p>
            {updateProductResponseState.error ?? ""}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProductPageComponent;
