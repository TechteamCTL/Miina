import { Row, Col, Container, ListGroup, Form, Spinner } from "react-bootstrap";
import PaginationComponent from "../../components/Pagination/PaginationComponent";
import ProductForListComponent from "../../components/Product/ProductForListComponent";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import FilterComponent from "../filterQueryResultOptions/FilterComponent.js";
import BreadcrumbComponent from "../filterQueryResultOptions/BreadcrumbComponent.js";
import ProductCategoriesComponent from "../../components/Product/ProductCategoriesComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import "../SharedPages.css";
import styles from "../home/MainSection/MainSection.module.css";
import CategoryMenu from "../CategoryMenu/CategoryMenu";

const ProductListPageComponent = ({
  getProducts,
  categories,
  categoryPath,
  getProductCategories,
  getUser,
  createQuote,
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
  const [paginationLinksNumber, setPaginationLinksNumber] = useState(null);
  const [pageNum, setPageNum] = useState(null);
  const [userNameEmail, setUserNameEmail] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");

  var [params] = useSearchParams();
  var categoryPath = params.get("categoryPath") || "";
  var pageNumParam = params.get("pageNum") || 1;
  var searchQuery = params.get("searchQuery") || "";
  var brandName = params.get("brandName") || "";
  var sortOrder = params.get("sortOrder") || 1;

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      setLoading(true);
      try {
        if (!searchQuery && !brandName) {
          const categories = await getProductCategories(
            categoryPath
          );
          setProductCategories(categories.map((item) => item.name));

          if (categories.length < 2) {
            const products = await getProducts(
              categoryPath,
              pageNumParam,
              searchQuery,
              sortOrder,
              brandName,
              userInfo
            );
            setProducts(products.products);
            setPaginationLinksNumber(products.paginationLinksNumber);
            setPageNum(products.pageNum);
          }
        } else if (searchQuery.length > 0) {

        } else {
          const products = await getProducts(
            categoryPath,
            pageNumParam,
            searchQuery,
            sortOrder,
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
    categoryPath,
    pageNumParam,
    searchQuery,
  ]);

  useEffect(() => {
    if (categoryPath) {
      const firstPart = categoryPath.split('/')[0];
      setSelectedCategory(firstPart);
    } else {
      setSelectedCategory("PPE");
    }
  }, [categoryPath]);

  const [filteredCategories, setFilteredCategories] = useState([]);
  useEffect(() => {
    if (productCategories.length > 1) {
      let baseCategory = categoryPath;
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
  }, [productCategories, categoryPath]);

  useEffect(() => {
    getUser()
      .then((data) => {
        setUserNameEmail({ email: data.email, name: data.name });
        setIsAdmin(data.isAdmin);
      })
      .catch((err) => console.log(err));
  }, []);

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
    <Container className="content-container products-list-component" fluid>
      <CategoryMenu isMobile={true} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <div className={`green-line ${styles.mobile}`}></div>

      <BreadcrumbComponent />
      <Row>
        <Col xxl={2} xl={3} lg={3} md={3} className="desktop">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <FilterComponent />
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col xxl={10} xl={9} lg={9} md={9} className="product-list-page-products-layout">
          {products.length !== 0 ? (
            <Form className="m-2">

              <Row>
                <Col md={3}>
                  {paginationLinksNumber > 1 ? (
                    <PaginationComponent
                      categoryPath={categoryPath}
                      searchQuery={searchQuery}
                      brandName={brandName}
                      paginationLinksNumber={paginationLinksNumber}
                      pageNum={pageNum}
                    />
                  ) : null}
                </Col>
                <Col md={3}></Col>
                <Col md={3}></Col>
              </Row>
            </Form>
          ) : (
            ""
          )}

          {!searchQuery ? <><Row className="m-2 product-list-wrapper" xs={1} md={2} lg={3} xl={4} xxl={5}>
            {loading ? (
              <Spinner animation="border" role="status" variant="success" ></Spinner>
            ) : productCategories.length > 1 ? (
              filteredCategories.map((category) => (
                <ProductCategoriesComponent
                  key={category._id}
                  categoryPath={categoryPath}
                  category={category}
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
                    saleunit={product.saleunit}
                    stock={product.stock}
                    reduxDispatch={dispatch}
                    categories={categories}
                    sortOrder={product.sortOrder}
                    createQuote={createQuote}
                    mnasku={product.stock[0].mnasku}
                  />

                );
              })
            )}
          </Row>

            {paginationLinksNumber > 1 ? (
              <PaginationComponent
                categoryPath={categoryPath}
                searchQuery={searchQuery}
                brandName={brandName}
                paginationLinksNumber={paginationLinksNumber}
                pageNum={pageNum}
              />
            ) : null}</>
            :
              <InfiniteScroll dataLength={searchedData.length} next={fetchData} hasMore={hasMore}
                loader={<Spinner animation="border" role="status" variant="success" ></Spinner>} endMessage={<p className="mx-4"><b>No more products to load</b></p>}>
                <Row className="m-2 product-list-page-search" xs={1} md={2} lg={3} xl={4} xxl={5} >
                  {searchedData?.map((product, index) => {
                    return (
                      <ProductForListComponent
                        key={product._id}
                        images={product.images}
                        name={product.name}
                        price={product.displayPrice}
                        productId={product._id}
                        saleunit={product.saleunit}
                        stock={product.stock}
                        reduxDispatch={dispatch}
                        categories={categories}
                        sortOrder={product.sortOrder}
                        createQuote={createQuote}
                        mnasku={product.stock[0].mnasku}
                      />
                    );
                  })
                  }
                </Row>
              </InfiniteScroll>
          }
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPageComponent;



