import { Row, Col, Container, ListGroup, Form, Button } from "react-bootstrap";
import PaginationComponent from "../../components/PaginationComponent";
import ProductForListComponent from "../../components/ProductForListComponent";

import { useCallback, useEffect, useState, useMemo, useRef, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import FilterComponent from "../../components/filterQueryResultOptions/FilterComponent";
import BreadcrumbComponent from "../../components/filterQueryResultOptions/BreadcrumbComponent";
import QuoteComponent from "../../components/SendEmail/QuoteComponent";
import ProductCategoriesComponent from "../../components/ProductCategoriesComponent";
import axios from "axios";
import { useTrackEvents } from "../trackEvents/useTrackEvents";
import QuoteSubmitComponent from "../user/components/QuoteSubmitComponent";
import UserQuoteSubmitPage from "../user/UserQuoteSubmitPage";
import InfiniteScroll from "react-infinite-scroll-component";
import "./SharedPages.css";

// import ReactGA from "react-ga";

const ProductListPage = ({
  getProducts,
  categories,
  getProductCategories,
  getUser,
  createQuote,
  subCat = "",
  childCat = "",
  fourCat = "",
  fiveCat = "",
  sixCat = "",
  sevenCat = "",
  brandName = "",
  userInfo,
  getProductsBySearch,
  getProductsBySearchForVisitor
}) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attrsFilter, setAttrsFilter] = useState([]);
  const [attrsFromFilter, setAttrsFromFilter] = useState([]);
  const [showResetFiltersButton, setShowResetFiltersButton] = useState(false);

  const [filters, setFilters] = useState({});
  const [categoriesFromFilter, setCategoriesFromFilter] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [paginationLinksNumber, setPaginationLinksNumber] = useState(null);
  const [pageNum, setPageNum] = useState(null);
  const [userNameEmail, setUserNameEmail] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [categoryList, setCategoryList] = useState([]);

  // const [materialList, setMaterialList] = useState([]);
  // const [lengthList, setLengthList] = useState([]);
  // const [widthList, setWidthList] = useState([]);
  // const [thicknessList, setThicknessList] = useState([]);
  // const [materialFilter, setMaterialFilter] = useState("");
  // const [lengthFilter, setLengthFilter] = useState("");
  // const [widthFilter, setWidthFilter] = useState("");
  // const [thicknessFilter, setThicknessFilter] = useState("");
  const sortList = [
    { id: "1", text: "Length (Low To High)" },
    { id: "-1", text: "Length (High To Low)" },
    { id: "1", text: "Width (Low To High)" },
    { id: "-1", text: "Width (High to Low)" },
    { id: "1", text: "Thickness (Low to High)" },
    { id: "-1", text: "Thickness (High To Low)" },
  ];
  const [sortFilter, setSortFilter] = useState();
  var [params] = useSearchParams();
  var categoryName = params.get("categoryName") || "";
  var pageNumParam = params.get("pageNum") || 1;
  var searchQuery = params.get("searchQuery") || "";
  var brandName = params.get("brandName") || "";
  var sortOrder = params.get("sortOrder") || 1;

  // const location = useLocation();
  // const navigate = useNavigate();
  /*   useEffect(() => {
      categoryList.length = 0
      //var categoryItem = "ELECTRICAL/BORE-PUMPS";
      var categoryItem = categories && categories[0];
      categories?.map((category) => {
        category.name.includes(categoryItem.name) ? (
          categoryItem = category
        ) : (
          categoryList.push(categoryItem)
        )
        categoryItem = category
      })
    }); */

  // console.log("categoryList", categoryList);
  // console.log("categories", categories);

  // useEffect(() => {
  //   ReactGA.pageview(window.location)
  // }, [])

  //Tracking user Interactions
  useTrackEvents();
  // var trackData = localStorage.getItem("trackData")
  // console.log("trackData", trackData);

  useEffect(() => {
    if (categoryName) {
      let categoryAllData = categories?.find(
        (item) => item.name === categoryName.replaceAll(",", "/")
      );
      if (categoryAllData) {
        let mainCategory = categoryAllData.name.split("/")[0];
        let index = categories.findIndex((item) => item.name === mainCategory);
        setAttrsFilter(categories[index].attrs);
      }
    } else {
      setAttrsFilter([]);
    }
  }, [categoryName, categories]);

  useEffect(() => {
    if (Object.entries(categoriesFromFilter).length > 0) {
      setAttrsFilter([]);
      var cat = [];
      var count;
      Object.entries(categoriesFromFilter).forEach(([category, checked]) => {
        if (checked) {
          var name = category.split("/")[0];
          cat.push(name);
          count = cat.filter((x) => x === name).length;
          if (count === 1) {
            var index = categories.findIndex((item) => item.name === name);
            setAttrsFilter((attrs) => [...attrs, ...categories[index].attrs]);
          }
        }
      });
    }
  }, [categoriesFromFilter, categories]);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      setLoading(true);
      try {
        if (!searchQuery && !brandName) {
          const categories = await getProductCategories(
            categoryName,
            subCat,
            childCat,
            fourCat,
            fiveCat,
            sixCat,
            sevenCat
          );
          setProductCategories(categories.map((item) => item.name));

          if (categories.length < 2) {
            const products = await getProducts(
              categoryName,
              pageNumParam,
              searchQuery,
              sortOrder,
              subCat,
              childCat,
              fourCat,
              fiveCat,
              sixCat,
              sevenCat,
              brandName,
              userInfo
            );
            setProducts(products.products);
            setPaginationLinksNumber(products.paginationLinksNumber);
            setPageNum(products.pageNum);
            //console.log("products", products);
          }
        } else if (searchQuery.length > 0) {
          //   console.log(searchQuery);
          // fetchData()

          //   const res = await getProductsBySearch(offset, limit, searchQuery);
          // console.log(res);
          //   setSearchedData(res.data.products)
        } else {
          //console.log("Am I here, brandName", brandName);
          const products = await getProducts(
            categoryName,
            pageNumParam,
            searchQuery,
            sortOrder,
            subCat,
            childCat,
            fourCat,
            fiveCat,
            sixCat,
            sevenCat,
            brandName,
            userInfo
          );
          setProductCategories([]);
          setProducts(products.products);
          setPaginationLinksNumber(products.paginationLinksNumber);
          setPageNum(products.pageNum);
        }
      } catch (er) {
        console.log(er);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();

  }, [
    categoryName,
    subCat,
    childCat,
    fourCat,
    fiveCat,
    sixCat,
    sevenCat,
    pageNumParam,
    searchQuery,
  ]);

  // console.log('====================================');
  // console.log(products);
  // console.log('====================================');

  const [filteredCategories, setFilteredCategories] = useState([]);
  useEffect(() => {
    if (productCategories.length > 1) {
      let baseCategory = categoryName;
      if (subCat) baseCategory += `/${subCat}`;
      if (childCat) baseCategory += `/${childCat}`;
      if (fourCat) baseCategory += `/${fourCat}`;
      if (fiveCat) baseCategory += `/${fiveCat}`;
      if (sixCat) baseCategory += `/${sixCat}`;
      if (sevenCat) baseCategory += `/${sevenCat}`;

      const baseDepth = baseCategory.split("/").length;

      setFilteredCategories(
        productCategories
          .filter((category) => {
            const parts = category.split("/");
            return parts.length === baseDepth + 1;
          })
          .map((item) => item.split("/")[baseDepth])
      );
    }
  }, [productCategories, categoryName, subCat, childCat, fourCat, fiveCat, sixCat, sevenCat]);


  // console.log("products ", products);
  // function removeDuplicates(arr) {
  //   return arr.filter((item,
  //     index) => arr.indexOf(item) === index);
  // }

  // useEffect(() => {
  //   if (products && products.length > 0) {

  //     const materialList = [
  //       ...new Set(
  //         products.map((product) => product.material !== "NONE" ? product.material.toUpperCase() : "")
  //       ),
  //     ].sort();
  //     setMaterialList(materialList);
  //     const lengthList = [
  //       ...new Set(
  //         products.map((product) => product.length !== 0 ? product.length : "")
  //       ),
  //     ].sort();
  //     setLengthList(lengthList);
  //     const widthList = [
  //       ...new Set(
  //         products.map((product) => product.width !== 0 ? product.width : "")
  //       ),
  //     ].sort();
  //     setWidthList(widthList);
  //     const thicknessList = [
  //       ...new Set(
  //         products.map((product) => product.thickness !== 0 ? product.thickness : "")
  //       ),
  //     ].sort();
  //     setThicknessList(thicknessList);
  //   }
  // }, [products]);

  // console.log("material list", materialList)
  // console.log("lengthList", lengthList)
  // console.log("widthList", widthList)
  // console.log("thicknessList", thicknessList)

  useEffect(() => {
    getUser()
      .then((data) => {
        setUserNameEmail({ email: data.email, name: data.name });
        setIsAdmin(data.isAdmin);
      })
      .catch((err) => console.log(err));
  }, []);

  // const resetFilters = () => {
  //   setMaterialFilter("");
  //   setLengthFilter("");
  //   setWidthFilter("");
  //   setThicknessFilter("");
  // };

  const [loadingTwo, setLoadingTwo] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchedData, setSearchedData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [previousQuery, setPreviousQuery] = useState("");
  const limit = 24;

  const fetchData = useCallback(async () => {
    setLoadingTwo(true);
    try {
      let response;
      if (searchQuery !== previousQuery) {
        //  setSearchedData([]);
        if (Object.keys(userInfo).length === 0) {
          response = await getProductsBySearchForVisitor(0, limit, searchQuery);
        } else {
          response = await getProductsBySearch(0, limit, searchQuery);
        }
      } else {
        if (Object.keys(userInfo).length === 0) {
          response = await getProductsBySearchForVisitor(offset, limit, searchQuery);
        } else {
          response = await getProductsBySearch(offset, limit, searchQuery);
        }
      }

      const newData = response.data.products;
      const hasMore = response.data.hasMore;

      if (searchedData.length === 0) {
        setSearchedData(newData)
        setOffset(prevOffset => prevOffset + limit);
        setHasMore(hasMore);
      } else if (newData.length > 0) {
        setHasMore(hasMore);
        setSearchedData(prevData => [...prevData, ...newData]);
        setOffset(prevOffset => prevOffset + limit);
      } else {
        setHasMore(hasMore);
        setOffset(0)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoadingTwo(false);
  }, [offset, searchQuery, previousQuery]);

  useEffect(() => {
    if (searchQuery && searchQuery !== previousQuery) {
      setProductCategories([]);
      setProducts([]);
      setOffset(0)
      setSearchedData([]);
      setHasMore(true);
      fetchData();
    }
    setPreviousQuery(searchQuery);
  }, [searchQuery, previousQuery, fetchData]);


  return (
    <Container className="content-container" fluid>
      <BreadcrumbComponent />
      <Row>
        <Col xxl={2} xl={3} lg={3} md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <FilterComponent />
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col xxl={10} xl={9} lg={9} md={9}>
          {products.length !== 0 ? (
            <Form className="m-2">

              <Row>
                <Col md={3}>
                  {paginationLinksNumber > 1 ? (
                    <PaginationComponent
                      categoryName={categoryName}
                      searchQuery={searchQuery}
                      subCategoryName={subCat}
                      childCategoryName={childCat}
                      fourCategoryName={fourCat}
                      fiveCategoryName={fiveCat}
                      sixCategoryName={sixCat}
                      sevenCategoryName={sevenCat}
                      brandName={brandName}
                      paginationLinksNumber={paginationLinksNumber}
                      pageNum={pageNum}
                    />
                  ) : null}
                </Col>
                <Col md={3}></Col>
                <Col md={3}></Col>
              </Row>
              {/* <Row>
                <Col className="ms-4" md={5}>Search Results : 0 - {paginationLinksNumber * 24} products found, displayed across {paginationLinksNumber} pages</Col>
              </Row> */}
            </Form>
          ) : (
            ""
          )}

          {!searchQuery ? <><Row className="m-2 product-list-wrapper" xs={1} md={2} lg={3} xl={4} xxl={5}>
            {loading ? (
              <img className="loading-spinner" src="./loading-gif.gif"></img>
            ) : productCategories.length > 1 ? (
              filteredCategories.map((category) => (
                <ProductCategoriesComponent
                  key={category._id}
                  categoryName={categoryName}
                  category={category}
                  subCat={subCat}
                  childCat={childCat}
                  fourCat={fourCat}
                  fiveCat={fiveCat}
                  sixCat={sixCat}
                  sevenCat={sevenCat}
                />
              ))
            ) : productCategories.length < 2 && products.length === 0 ? null : (
              products.map((product) => {
                return (
                  <ProductForListComponent
                    key={product._id}
                    images={product.images}
                    name={product.name}
                    price={product.displayPrice}
                    productId={product._id}
                    slrsku={product.slrsku}
                    saleunit={product.saleunit}
                    stock={product.stock}
                    reduxDispatch={dispatch}
                    categories={categories}
                    sortOrder={product.sortOrder}
                    createQuote={createQuote}
                    ctlsku={product.stock[0].ctlsku}
                  />

                );
              })
            )}
          </Row>
            {!loading && productCategories.length < 2 && products.length === 0 ? (
              <div className="w-50 m-2 p-3 border rounded product-list-page-wrapper">
                <UserQuoteSubmitPage fromProductList={true} />
              </div>
            ) : null}

            {paginationLinksNumber > 1 ? (
              <PaginationComponent
                categoryName={categoryName}
                searchQuery={searchQuery}
                subCategoryName={subCat}
                childCategoryName={childCat}
                fourCategoryName={fourCat}
                fiveCategoryName={fiveCat}
                sixCategoryName={sixCat}
                sevenCategoryName={sevenCat}
                brandName={brandName}
                paginationLinksNumber={paginationLinksNumber}
                pageNum={pageNum}
              />
            ) : null}</>
            :
            <>
              <InfiniteScroll dataLength={searchedData.length} next={fetchData} hasMore={hasMore} loader={<img alt="Loading..." className="loading-spinner" src="./loading-gif.gif" />} endMessage={<p className="mx-4"><b>No more products to load</b></p>}>
                <Row className="m-2" xs={1} md={2} lg={3} xl={4} xxl={5}>
                  {searchedData?.map((product, index) => {
                    return (
                      <ProductForListComponent
                        key={product._id}
                        images={product.images}
                        name={product.name}
                        price={product.displayPrice}
                        productId={product._id}
                        slrsku={product.slrsku}
                        saleunit={product.saleunit}
                        stock={product.stock}
                        reduxDispatch={dispatch}
                        categories={categories}
                        sortOrder={product.sortOrder}
                        createQuote={createQuote}
                        ctlsku={product.stock[0].ctlsku}
                      />
                    );
                  })
                  }
                </Row>
              </InfiniteScroll>

              {searchedData.length === 0 && !loadingTwo && <div className="w-50 m-2 p-3 border rounded product-list-page-wrapper">
                <UserQuoteSubmitPage fromProductList={true} />
              </div>}
            </>
          }
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPage;



