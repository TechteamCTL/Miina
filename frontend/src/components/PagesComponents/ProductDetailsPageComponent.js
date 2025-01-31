import { Row, Col, Container, ListGroup, Button, Form, Modal } from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "react-medium-image-zoom/dist/styles.css";
import { useSelector, useDispatch, connect } from "react-redux";
import axios from "axios";
import moment from "moment-timezone";
import FilterComponent from "../filterQueryResultOptions/FilterComponent.js";
import { getCategories } from "../../redux/actions/categoryActions";
import EditProductShortInforComponent from "../../pages/admin/components/EditProductShortInforComponent";
import LoginRegisterPage from "../../pages/LoginRegisterPage";
import "../SharedPages.css";
import ProductDescription from "./ui/ProductDescription/ProductDescription";
import AdminProductPanel from "./ui/AdminProductPanel/AdminProductPanel";
import PleaseSelect from "./ui/PleaseSelect/PleaseSelect";
import styles from "../home/MainSection/MainSection.module.css";
import CategoryMenu from "../CategoryMenu/CategoryMenu";


const ProductDetailsPageComponent = ({
  addToCartReduxAction,
  reduxDispatch,
  getProductDetails,
  getUser,
  addToPOCartHandler,
}) => {
  const { id } = useParams();
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("Please-Select");
  const [selectedStock, setSelectedStock] = useState(null);
  const [userNameEmail, setUserNameEmail] = useState();
  const [userData, setUserData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [stockPrice, setStockPrice] = useState('');
  const [stockCode, setstockCode] = useState('');
  const [supplierCode, setsupplierCode] = useState('');
  const [stockLevel, setStockLevel] = useState(0)
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);
  const [isUserInfo, setIsUserInfo] = useState(Object.keys(userInfo).length === 0);
  const [modalType, setModalType] = useState("LoginForm")
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('')
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };
  const handleShowLoginModal = (event, type) => {
    event.preventDefault();
    setModalType(type);
    setShowLoginModal(true);
  };

  const { categories } = useSelector((state) => state.getCategories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (product.saleunit) {
      setQty(product.saleunit);
    }
    setBrandSearch(product.supplier);
  }, [product]);

  useEffect(() => {
    if (product.stock && product.stock.length === 1) {
      const singleStockItem = product.stock[0];
      setSelectedProduct(singleStockItem.attrs);
      setSelectedStock(singleStockItem);
    }
  }, [product, edit]);

  const handleProductChange = (event) => {
    const attrs = event.target.value;
    setSelectedProduct(attrs);

    if (attrs !== "Please-Select") {
      const stockItem = product.stock.find((item) => item.attrs === attrs);
      if (stockItem) {
        const selectedStockWithOneSku = Object.keys(stockItem).reduce(
          (acc, key) => {
            if (
              key === "_id" ||
              key === "attrs" ||
              key === "uom" ||
              key === "count" ||
              key === "purchaseprice" ||
              key === "price" ||
              key === "barcode" ||
              key === "suppliersku" ||
              key === "mnasku" ||
              key === "sales"
            ) {
              acc[key] = stockItem[key];
            }
            return acc;
          },
          {}
        );

        setSelectedStock(selectedStockWithOneSku);
      } else {
        setSelectedStock(null);
      }
    } else {
      setSelectedStock(null);
    }
  };

  useEffect(() => {
    if (selectedProduct !== "Please-Select" && selectedStock) {
      setStockPrice(selectedStock.price);
      setstockCode(selectedStock.mnasku);
      setsupplierCode(selectedStock.suppliersku);
      setStockLevel(selectedStock.count);
    }
  }, [selectedStock, selectedProduct]);

  const [buttonText, setButtonText] = useState("Add to cart");

  const addToCartHandler = async () => {
    setButtonText("Adding...");
    try {
      await reduxDispatch(addToCartReduxAction(id, qty, selectedStock));
      setShowCartMessage(true);
      setButtonText("Added!");
      setTimeout(() => setButtonText("Add to cart"), 1000);
    } catch (error) {
      setButtonText("Add to cart");
    }
  };

  useEffect(() => {
    getProductDetails(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
        setQty(product.saleunit);
      })
      .catch((er) =>
        setError(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );
  }, [edit, id]);

  const price = stockPrice;
  const formattedPrice = price
    ? (price * qty).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    : "";

  const [images, setImages] = useState([]);
  useEffect(() => {
    async function handleImages() {
      const imagesArray = [];
      if (product && product.images) {
        for (const image of product.images) {
          let imagePath = image.path;

          if (imagePath.includes("http://")) {
            imagePath = imagePath.replace("http://", "https://");
          }

          try {
            await fetchImage(imagePath);
            imagesArray.push({
              original: imagePath,
              thumbnail: imagePath,
              url: imagePath,
              title: image.title,
              caption: image.name,
              originalHeight: "400px",
              thumbnailClass: "thumbnailClass"
            });
          } catch (error) {
            console.error("Image failed to load:", error);
          }
        }
      }
      setImages(imagesArray);
    }

    handleImages();
  }, [product]);

  async function fetchImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ ok: true });
      img.onerror = () => reject({ ok: false });

      img.src = url;
    });
  }

  useEffect(() => {
    getUser()
      .then((data) => {
        setUserNameEmail({
          email: data.email,
          name: data.name,
        });
        setUserData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleBlur = (e) => {
    const newValue =
      Math.round(e.target.value / product.saleunit) * product.saleunit;
    setQty(newValue);
  };

  const expireDate = product.expireDate;
  const formattedExpireDate = expireDate?.slice(9);

  const dateCalculation = moment.tz(
    expireDate,
    "HH:mm:ss DD/MM/YYYY",
    "Australia/Perth"
  );

  const currentDate = moment.tz("Australia/Perth");
  const diff = dateCalculation.diff(currentDate, "days");
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const fetchProduct = async (productId) => {
    const { data } = await axios.get(`/api/products/get-one/${productId}`);
    return data;
  };

  const updateProductApiRequest = async (productId, formInputs) => {
    const { data } = await axios.put(
      `/api/products/admin/updateProduct/${productId}`,
      {
        ...formInputs,
      }
    );
    return data;
  };

  const productChanged = async (closeModal) => {
    await setShow(closeModal);
  };

  const [refresh, setRefresh] = useState(false);
  const refreshAfterEdit = async (refresh) => {
    await setRefresh(refresh);
  };
  useEffect(() => {
    if (refresh === true) {
      window.location.reload();
    }
  }, [refresh]);

  const [poCartItems, setPoCartItems] = useState([]);
  const [poCartBtnText, setPoCartBtnText] = useState("Add to PO cart");


  useEffect(() => {
    if (selectedStock) {
      setPoCartItems([
        {
          productId: id,
          name: product.name,
          saleunit: product.saleunit,
          image: product.images[0].path,
          supplier: product.supplier,
          poCartProducts: [
            {
              mnasku: selectedStock.mnasku,
              quantity: qty,
              purchaseprice: selectedStock.purchaseprice,
              suppliersku: selectedStock.suppliersku,
              attrs: selectedStock.attrs,
              uom: selectedStock.uom,
            },
          ],
        },
      ]);
    }
  }, [selectedStock, qty]);

  const addToPOCartCheck = () => {

    let missingFields = [];

    poCartItems.forEach((item, itemIndex) => {
      const requiredItemFields = ['productId', 'name', 'saleunit', 'image', 'supplier'];
      requiredItemFields.forEach((field) => {
        if (item[field] === undefined || item[field] === null) {
          missingFields.push(`${field}`);
        }
      });

      item.poCartProducts.forEach((product, productIndex) => {
        const requiredProductFields = ['mnasku', 'quantity', 'purchaseprice', 'suppliersku', 'attrs', 'uom'];
        requiredProductFields.forEach((field) => {
          if (product[field] === undefined || product[field] === null) {
            missingFields.push(`${field}`);
          }
        });
      });
    });

    if (missingFields.length > 0) {
      const formattedMissingFields = missingFields.map(field => field.toUpperCase());
      const errorMessage = `Please check selected product!!! It is missing:\n${formattedMissingFields.join('\n')}`;
      alert(errorMessage);
      return;
    }
    setPoCartBtnText("Adding...");

    addToPOCartHandler(poCartItems)
      .then((data) => {
        setPoCartBtnText("Added!");
        setTimeout(() => setPoCartBtnText("Add to PO cart"), 1000);
      })
      .catch((error) => {
        console.error("Error adding to PO cart:", error);
        alert("Failed to add to PO cart.");
        setPoCartBtnText("Add to PO cart");
      });
  };

  const [catList, setCatList] = useState([])
  useEffect(() => {
    if (product.category !== "" && product.category !== undefined) {
      const input = product.category;
      const parts = input.split("/");

      let result = [];
      let currentPath = "";

      for (let i = 0; i < parts.length; i++) {
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
        result.push({ name: parts[i], link: currentPath });
      }
      setCatList(result);
    }
  }, [product]);


  return (<>
    <div className="green-line"></div>
    <Container className="content-container product-detail-page" fluid>
      <Row className="product-detail-page-row">
        <CategoryMenu isMobile={true} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />


        <div className={`green-line ${styles.mobile}`}></div>
        {
          catList ? (
            <span className="categoryHD mt-2">
              {
                catList.map((category, index) => (
                  <a href={`/product-list?categoryPath=${category.link}`} key={index}>
                    {category.name} <label>&nbsp; / &nbsp; </label>
                  </a>
                ))
              }
            </span>
          ) : ("")
        }

        <Col xxl={2} xl={3} lg={3} md={3} className="desktop">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <FilterComponent />
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col xxl={10} xl={9} lg={9} className="mb-3">
          <Row className="mt-4 product-detail-page-info-row">

            <Col lg={4} className="m-1 product-detail-page-info-image">
              <ImageGallery items={images} showPlayButton={false} />
            </Col>

            <Col lg={6} className="product-detail-page-info">
              <Row>
                <ListGroup variant="flush" className="product-detail-page-list-group">
                  <ListGroup.Item>
                    <div className="product-detail-page-title">{product.name}</div>
                    {userData.isAdmin === true && <AdminProductPanel handleShow={handleShow} selectedProduct={selectedProduct} poCartBtnText={poCartBtnText} addToPOCartCheck={addToPOCartCheck} />}
                    <PleaseSelect selectedProduct={selectedProduct} product={product} handleProductChange={handleProductChange} />
                    <br />
                    <Row hidden={selectedProduct === "Please-Select"} className="product-details-page-description">
                      <Col>
                        <h6>Product Code: {stockCode}</h6>
                        {!isUserInfo && <h6>
                          {userData.isAdmin === true ||
                            userData.isMarketing === true ? (
                            <>
                              {product.availability?.length > 0 ? (
                                <div float="left" className="stock-items-container">
                                  <h6 className={product.availability[0].local > 10 ? "green" : "orange"}>WA Stock: {product.availability[0].local < 10 ? "low stock" : <><span className="stock-item"><i class="bi bi-broadcast"></i></span><span>{product.availability[0].local}</span></>}</h6>
                                  <h6 className={product.availability[0].national > 10 ? "green" : "orange"}>National Stock: {product.availability[0].national < 10 ? "Low stock" : <><span className="stock-item"><i class="bi bi-broadcast"></i> </span><span>{product.availability[0].national}</span></>}</h6>
                                </div>
                              ) : ("")}
                              <table className="productTable">
                                <tr>
                                  <td className="colKey"><h6>Supplier Code:</h6></td>
                                  <td className="colValue"><h6>{supplierCode}</h6></td>
                                </tr>
                                <tr>
                                  <td className="colKey"><h6>Margin:</h6></td>
                                  <td className="colValue"><h6>{(
                                    (100 *
                                      (selectedStock?.price -
                                        selectedStock?.purchaseprice)) /
                                    selectedStock?.price
                                  ).toFixed(2)}
                                    %</h6>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="colKey"><h6>Price:</h6></td>
                                  <td className="colValue"><h6><b>${formattedPrice}</b></h6>
                                  </td>
                                </tr>
                              </table>
                              {diff < 0 ? (
                                <span className="text-danger ms-5">
                                  PRICE EXPIRED, PLEASE CHECK WITH SUPPLIER
                                </span>
                              ) : (
                                <span
                                  className="ms-5"
                                  style={{ fontSize: "0.9rem" }}
                                  hidden={!formattedExpireDate}
                                >
                                  Price Valid Until: {formattedExpireDate}
                                </span>
                              )}
                            </>
                          ) : product.displayPrice === 0 || diff < 0 ? (
                            <span className="fw-bold PriceContact">
                              Contact us for a quote
                            </span>
                          ) : (
                            <>
                              <span className="fw-bold">
                                Price: ${formattedPrice}
                              </span>
                              <span
                                className="text-danger ms-5"
                                style={{ fontSize: "0.9rem" }}
                                hidden={isNaN(diff)}
                              >
                                Price Valid Until: {formattedExpireDate}
                              </span>
                            </>
                          )}
                        </h6>}
                        {isUserInfo && <div className="btnLogin btnLoginText btnLoginProductPage">
                          <div className="btnsLoginRegistrationProductPage">
                            <button onClick={(e) => handleShowLoginModal(e, "LoginForm")} className="loginBtn">LogIn</button>
                          </div>
                        </div>}

                        <br />
                      </Col>
                      {(product.availability?.length > 0) && (!userData.isAdmin) ? (
                        <>
                          <div float="left" className="stock-items-container">
                            <h6 className={product.availability[0].local > 10 ? "green" : "orange"}>WA Stock: {product.availability[0].local < 10 ? "low stock" : <><span className="stock-item"><i class="bi bi-broadcast"></i></span><span>{product.availability[0].local}</span></>}</h6>
                            <h6 className={product.availability[0].national > 10 ? "green" : "orange"}>National Stock: {product.availability[0].national < 10 ? "Low stock" : <><span className="stock-item"><i class="bi bi-broadcast"></i> </span><span>{product.availability[0].national}</span></>}</h6>
                          </div>
                        </>
                      ) : ("")}

                    </Row>

                    {!isUserInfo && <Row>
                      {userData.isAdmin === true ? (
                        <>
                          {product.displayPrice === 0 ? null : (
                            <h6 className="qnty-title">Quantity :</h6>
                          )}
                          <Col lg={4}>
                            <div
                              role="group"
                            >
                              <Form.Control
                                type="number"
                                min={product.saleunit}
                                className="addToCartQty"
                                value={qty}
                                onBlur={handleBlur}
                                onChange={(e) => setQty(e.target.value)}
                                step={product.saleunit}
                                disabled={selectedProduct === "Please-Select"}
                              />
                            </div>
                          </Col>
                          <Col lg={4}>
                            <Button
                              onClick={() => addToCartHandler(selectedStock)}
                              className="addToCartBtn"
                              disabled={
                                selectedProduct === "Please-Select" ||
                                buttonText !== "Add to cart"
                              }
                            >
                              {buttonText}
                            </Button>
                          </Col>
                        </>
                      ) : product.displayPrice === 0 || diff < 0 ? (
                        <div></div>
                      ) : (
                        <>
                          {product.displayPrice === 0 || diff < 0 ? null : (
                            <h6 hidden={selectedProduct === "Please-Select"} className="qnty-title">
                              Quantity:
                            </h6>
                          )}
                          <Col
                            lg={5}
                            hidden={selectedProduct === "Please-Select"}
                          >
                            <div
                              role="group"
                            >
                              <Form.Control
                                type="number"
                                min={product.saleunit}
                                className="addToCartQty"
                                value={qty}
                                onBlur={handleBlur}
                                onChange={(e) => setQty(e.target.value)}
                                step={product.saleunit}
                                disabled={selectedProduct === "Please-Select"}
                              />
                            </div>
                          </Col>
                          &nbsp;&nbsp;
                          <Col
                            lg={6}
                            hidden={selectedProduct === "Please-Select"}
                          >
                            <Button
                              onClick={() => addToCartHandler(selectedStock)}
                              className="addToCartBtn"
                              disabled={
                                selectedProduct === "Please-Select" ||
                                buttonText !== "Add to cart"
                              }
                            >
                              {buttonText}
                            </Button>&nbsp;
                          </Col>
                        </>
                      )}
                    </Row>
                    }
                  </ListGroup.Item>
                </ListGroup>
              </Row>


              <ProductDescription product={product} />
            </Col>
          </Row>
        </Col>
      </Row >

      < Modal
        show={show}
        onHide={handleClose}
        className="edite_product_short_infor"
      >
        <EditProductShortInforComponent
          categories={categories}
          fetchProduct={fetchProduct}
          updateProductApiRequest={updateProductApiRequest}
          productChanged={productChanged}
          refreshAfterEdit={refreshAfterEdit}
        />
      </Modal >
      <Modal show={showLoginModal} onHide={handleCloseLoginModal} className="login_preview_items">
        <LoginRegisterPage modalType={modalType} />
      </Modal>
    </Container >
  </>);
};

export default connect()(ProductDetailsPageComponent);
