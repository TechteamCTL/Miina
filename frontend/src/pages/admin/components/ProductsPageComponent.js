import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { TableHeader, Pagination, Search } from "../../../components/DataTable";
import React, { useEffect, useState, useMemo } from "react";
import "../../../pages/general.css";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { useSelector } from "react-redux";
import styles from "../AdminPagesStyles.module.css";

const ProductsPageComponent = ({
  fetchProducts,
  deleteProduct,
  productReplenishment,
  productStockTake,
  getOrders,
}) => {
  const [products, setProducts] = useState([]);
  const [productDeleted, setProductDeleted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "category", order: "asc" });
  const [filterValue, setFilterValue] = useState("");
  // items per page
  const ITEMS_PER_PAGE_OPTIONS = [40, 60, 100, 200];
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[2]);

  const ITEMS_PER_PAGE = itemsPerPage;

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
  };

  const { userInfo } = useSelector((state) => state.userRegisterLogin);

  const accessRoles = ["isAdmin"];

  const hasAnyRole = (userInfo, accessRoles) => {
    return accessRoles.some((role) => {
      return (
        userInfo.hasOwnProperty(role.trim()) && Boolean(userInfo[role.trim()])
      );
    });
  };

  const headers = [
    { name: "No#", field: "index", sortable: false },
    { name: "Product Name", field: "name", sortable: true },
    { name: "Product Attrs", field: "attrs", sortable: true },
    { name: "P.Price", field: "purchasePrice", sortable: true },
    { name: "Price", field: "price", sortable: true },
    { name: "Margin", field: "margin", sortable: true },
    { name: "Stock", field: "count", sortable: true },
    { name: "MNAsku", field: "mnasku", sortable: true },
    { name: "Supplier sku", field: "suppliersku", sortable: true },
    { name: "Category", field: "category", sortable: true },
    { name: "View/Edit/Delete", field: "", sortable: false },
  ];

  const productsData = useMemo(() => {
    let computedProducts = products;
    if (filterValue === "withNoPricing") {
      computedProducts = computedProducts.filter((product) => product.displayPrice === 0)
    } else if (filterValue === "withPricing") {
      computedProducts = computedProducts.filter((product) => product.displayPrice !== 0)
    }

    if (search) {
      computedProducts = computedProducts.filter(
        (products) =>
          products.name?.toLowerCase().includes(search.toLowerCase()) ||
          products.category?.toLowerCase().includes(search.toLowerCase()) ||
          products.supplier?.toLowerCase().includes(search.toLowerCase()) ||
          products.stock.some(
            (stockItem) =>
              stockItem.mnasku?.toLowerCase().includes(search.toLowerCase()) ||
              stockItem.slrsku?.toLowerCase().includes(search.toLowerCase()) ||
              stockItem.suppliersku
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
              stockItem.barcode?.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    setTotalItems(computedProducts.length);

    //Sorting products
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedProducts = computedProducts.sort((a, b) => {
        const fieldA = a[sorting.field];
        const fieldB = b[sorting.field];

        if (typeof fieldA === "number" && typeof fieldB === "number") {
          return reversed * (fieldA - fieldB);
        } else if (typeof fieldA === "string" && typeof fieldB === "string") {
          return reversed * fieldA.localeCompare(fieldB);
        } else {
          // If field types are different, compare their string representations
          return reversed * String(fieldA).localeCompare(String(fieldB));
        }
      });
    }

    //Current Page slice
    return computedProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [products, currentPage, search, sorting, filterValue]);

  const deleteHandler = async (productId) => {
    if (window.confirm("Are you sure?")) {
      const data = await deleteProduct(productId);
      if (data.message === "product removed") {
        setProductDeleted(!productDeleted);
      }
    }
  };

  useEffect(() => {
    const abctrl = new AbortController();
    fetchProducts(abctrl)
      .then((res) => setProducts(res))
      .catch((er) => {
        if (er.code === "ERR_CANCELED") {
        } else if (er.response) {
          console.log(
            er.response.data.message
              ? er.response.data.message
              : er.response.data
          );
        } else {
          console.log(er);
        }
      });
    return () => abctrl.abort();
  }, [productDeleted, itemsPerPage]);

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res))
      .catch((er) => {
        if (er.code === "ERR_CANCELED") {
        } else if (er.response) {
          console.log(
            er.response.data.message
              ? er.response.data.message
              : er.response.data
          );
        } else {
          console.log(er);
        }
      })
  }, [productDeleted])

  const [productsCount, setProductsCount] = useState([])

  useEffect(() => {
    if (products) {
      // Initialize counters
      let productsWithPriceCount = 0;
      let productsWithoutPriceCount = 0;
      let productsWithoutImageCount = 0;
      let productsWithoutDownloadsCount = 0;
      let productsWithoutImageInOrdersCount = 0;

      // Iterate through products
      products.forEach((product) => {
        // Count products with and without price
        if (product.displayPrice === 0 || product.displayPrice === null) {
          productsWithoutPriceCount++;
        } else {
          productsWithPriceCount++;
        }

        // Count products without images
        if (product.images) {
          product.images.forEach((image) => {
            if (image.path.includes("Image_Coming_Soon.jpg")) {
              productsWithoutImageCount++;
            }
          });
        }

        // Count products without downloads
        if (!product.pdfs || product.pdfs.length === 0) {
          productsWithoutDownloadsCount++;
        }
      });

      // Count products without images that appear in orders
      products.forEach((product) => {
        if (product.images?.some((image) => image.path.includes("Image_Coming_Soon.jpg"))) {
          orders?.forEach((order) => {
            order.cartItems?.forEach((cartItem) => {
              if (cartItem.productId === product._id) {
                productsWithoutImageInOrdersCount++;
              }
            });
          });
        }
      });

      // Set the counts
      setProductsCount([
        {
          totalProductsCount: products.length,
          productsWithPriceCount,
          productsWithoutPriceCount,
          productsWithoutImage: productsWithoutImageCount,
          productsWithoutImageInOrders: productsWithoutImageInOrdersCount,
          productsWithoutDownloads: productsWithoutDownloadsCount,
        },
      ]);
    }
  }, [products, orders]);

  const pullStockItemsOut = (products) => {
    return products.map((product) => {
      const stockDataPullOut = {};

      product.stock.forEach((stockItem, index) => {
        const prefix = `stock[${index}].`;

        Object.keys(stockItem).forEach((name) => {
          const newName = `${prefix}${name}`;
          stockDataPullOut[newName] = stockItem[name];
        });
      });

      const rebuiltProduct = {
        ...product,
        ...stockDataPullOut,
      };

      delete rebuiltProduct.stock;

      return rebuiltProduct;
    });
  };

  const newProductsData = pullStockItemsOut(productsData);

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async (fileName) => {
    const ws = XLSX.utils.json_to_sheet(newProductsData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <div className={styles.adminProductsWrapper}>
      <Col md={2}>
        <AdminLinksComponent />
      </Col>
      <Col md={10}>
        <h1 className={styles.title}>
          PRODUCTS
        </h1>
        <div className="row">
          <div className="col-md-4">
            <Pagination
              total={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />

          </div>
          <div className="col-md-4">
            <select
              className="ms-4 mt-1 fs-6"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 mb-2" style={{ marginLeft: "auto", display: "flex", justifyContent: "flex-end" }}>
            <Search
              onSearch={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        <table className="table table-striped">
          <TableHeader
            headers={headers}
            onSorting={(field, order) => setSorting({ field, order })}
          />
          <tbody>
            {productsData.map((item, idx) => (
              <tr key={idx} id="product-row">
                <td>{idx + 1}</td>
                <td>
                  <a href={`/product-details/${item._id}`}>
                    <text className="text-uppercase" style={{ color: "black" }}>
                      {item.name}
                    </text>
                  </a>
                </td>
                <td>
                  {item.stock.map((stockItem) => (
                    <div key={stockItem.mnasku}>{stockItem.attrs}</div>
                  ))}
                </td>
                <td>
                  {item.stock.map((stockItem) => (
                    <div key={stockItem.mnasku}>
                      ${stockItem.purchaseprice?.toFixed(2)}
                    </div>
                  ))}
                </td>
                <td>
                  {item.stock.map((stockItem) => (
                    <div key={stockItem.mnasku}>
                      ${stockItem.price?.toFixed(2)}
                    </div>
                  ))}
                </td>
                <td>
                  {item.stock.map((stockItem) => (
                    <div key={stockItem.mnasku}>
                      {(
                        (100 * (stockItem.price - stockItem.purchaseprice)) /
                        stockItem.purchaseprice
                      ).toFixed(2)}
                      %
                    </div>
                  ))}
                </td>
                <td>
                  {item.stock.map((stockItem) => (
                    <div key={stockItem.mnasku}>{stockItem.count}</div>
                  ))}
                </td>
                <td>
                  {item.stock.map((stockItem) => (
                    <div key={stockItem.mnasku}>{stockItem.mnasku}</div>
                  ))}
                </td>
                <td>
                  {item.stock.map((stockItem) => (
                    <div key={stockItem.mnasku}>{stockItem.suppliersku}</div>
                  ))}
                </td>
                <td>{item.category}</td>
                <td>
                  <Link to={`/product-details/${item._id}`} target="_blank">
                    <Button className="btn-sm btn-light">
                      <i className="bi bi-box-arrow-up-right"></i>
                    </Button>
                  </Link>
                  {" / "}
                  <LinkContainer to={`/admin/edit-product/${item._id}`}>
                    <Button className="btn-sm btn-light" disabled={!hasAnyRole(userInfo, accessRoles)}>
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </LinkContainer>
                  {" / "}
                  <Button
                    variant="danger"
                    className="btn-sm btn-light"
                    onClick={() => deleteHandler(item._id)}
                    disabled={!hasAnyRole(userInfo, accessRoles)}
                  >
                    <i className="bi bi-x-circle"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row">
          <div className="col-md-6">
            <Pagination
              total={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
          <div className="col-md-6 d-flex flex-row-reverse mb-1">
            <Button
              onClick={(e) => exportToExcel("products_List")}
              style={{ cursor: "pointer", fontSize: 14 }}
              className={styles.btnGreenColor}
            >
              Excel Export
            </Button>
          </div>
        </div>
      </Col>
    </div>
  );
};

export default ProductsPageComponent;
