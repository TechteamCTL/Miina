import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//fonts
import "./fonts/GloriaHallelujahRegular.ttf";
import "./fonts/HelveticaNeueRoman.otf";


// publicly available pages:
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductListPage from "./pages/ProductListPage";

/* import LoginRegisterPage from "./pages/LoginRegisterPage"; */
import SplashPage from "./pages/splash/SplashPage";
import CartPage from "./pages/CartPage";
import FaqPage from "./pages/FaqPage";
import TermsConditions from "./pages/user/components/FooterComponents.js/TermsConditions.js";
import PrivacyPolicy from "./pages/user/components/FooterComponents.js/privacypolicy.js";
import GoodsReturnForm from "./pages/user/components/FooterComponents.js/GoodsReturnForm.js";
import SupplierStatement from "./pages/user/components/FooterComponents.js/SupplierStatement.js"
import ProtectedRoutesComponent from "./components/Routes/ProtectedRoutesComponent";

// protected user pages:
import UserProfilePage from "./pages/user/UserProfilePage";
import UserOrdersPage from "./pages/user/UserOrdersPage";
import UserCartDetailsPage from "./pages/user/UserCartDetailsPage";
import UserOrderDetailsPage from "./pages/user/UserOrderDetailsPage";
import UserPasswordPage from "./pages/user/UserPasswordPage";
import EmailVerify from "./components/user/EmailVerify.js";
import ResetPassword from "./components/user/ResetPassword.js";

// protected admin pages:
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminDeliveryBook from "./pages/admin/AdminDeliveryBook";
import AdminCartDetailsPage from "./pages/admin/AdminCartDetailsPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminCreateProductPage from "./pages/admin/AdminCreateProductPage";
import AdminCreateDeliveryBookPage from "./pages/admin/AdminCreateDeliveryBookPage";
import AdminEditProductPage from "./pages/admin/AdminEditProductPage";
import AdminEditUserPage from "./pages/admin/AdminEditUserPage";
import AdminEditDeliveryBook from "./pages/admin/AdminEditDeliveryBook";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import ScrollToTop from "./utils/ScrollToTop";

//components
import PDFPreviewForVisitor from "./pages/user/components/HomePageForVisitors/PDFPreviewForVisitor.js";
import HomePageForVisitorNew from "./pages/HomePageForVisitorNew.js";
import ProtectedRoutesFilterComponent from "./components/Routes/ProtectedRoutesFilterComponent.js";


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<SplashPage />} />
        <Route path="/register" element={<SplashPage />} />
        <Route path="/pdfpreview" element={<PDFPreviewForVisitor />} />
        <Route path="/user/:id/verify/:token" element={<EmailVerify />} />
        <Route path="/user/:id/resetPassword/:token" element={<ResetPassword />} />

        <Route element={<ProtectedRoutesComponent role="visitor" />}>
          <Route path="/FaqPage" element={<FaqPage />} />
          <Route path="/TermsConditions" element={<TermsConditions />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/supplierstatement" element={<SupplierStatement />} />
          <Route path="/goodsreturnform" element={<GoodsReturnForm />} />
          <Route path="/" element={<HomePageForVisitorNew />} />
          <Route path="/product-list" element={<ProductListPage />} />
          <Route path="/product-details/:id" element={<ProductDetailsPage />} />
        </Route>


        {/* publicly available routes: */}
        <Route element={<ProtectedRoutesComponent role="user" />}>
          <Route path="/" element={<HomePageForVisitorNew />} />
          <Route path="/product-list" element={<ProductListPage />} />
          <Route path="/product-details/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element="Page not exists 404" />
        </Route>

        {/* user protected routes: */}
        <Route element={<ProtectedRoutesComponent admin={false} />}>
          <Route path="/user" element={<UserProfilePage />} />
          <Route path="/user/password" element={<UserPasswordPage />} />
          <Route path="/user/my-orders" element={<UserOrdersPage />} />
          <Route path="/user/cart-details" element={<UserCartDetailsPage />} />
          <Route path="/user/order-details/:id" element={<UserOrderDetailsPage />} />
        </Route>

        {/* admin protected routes: */}
        <Route
          element={
            <ProtectedRoutesComponent admin={true} userPrevent={true} />
          }
        >
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route
            path="/admin/edit-user/:id"
            element={<AdminEditUserPage />}
          />
          <Route
            path="/admin/cart-details"
            element={<AdminCartDetailsPage />}
          />
          <Route
            path="/admin/deliveryBooks"
            element={<AdminDeliveryBook />}
          />
          <Route
            path="/admin/edit-deliveryBook/:id"
            element={<AdminEditDeliveryBook />}
          />
          <Route
            path="/admin/create-new-deliveryBook"
            element={<AdminCreateDeliveryBookPage />}
          />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route
            path="/admin/create-new-product"
            element={<AdminCreateProductPage />}
          />
          <Route
            path="/admin/edit-product/:id"
            element={<AdminEditProductPage />}
          />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoutesFilterComponent
                permissionKey="isSales"
                route={AdminOrdersPage}
              />
            }
          />
          <Route
            path="/admin/order-details/:id"
            element={<AdminOrderDetailsPage />}
          />
        </Route>

        <Route path="*" element="Page not exists 404" />
      </Routes>
    </Router>
  );
}

export default App;
