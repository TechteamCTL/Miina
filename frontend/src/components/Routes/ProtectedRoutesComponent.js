import { Outlet, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  useSelector, useDispatch
} from "react-redux";
import Spinner from 'react-bootstrap/Spinner';

import { getSubcategories } from "../../redux/actions/categoryActions.js";


import Header from "../Header/Header.js";
import Footer from "../Footer/Footer.js";
import ScrollButton from "../Buttons/ScrollButton ";

import NewHeaderComponentLoggedIn from "../Header/NewHeaderComponentLoggedIn.js";


const ProtectedRoutesComponent = ({ admin, userPrevent }) => {
  const [isAuth, setIsAuth] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [userLoggedin, setUerLoggedin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpenModalCatalogue, setIsOpenModalCatalogue] = useState(false);
  const [stopAnimation, setStopAnimation] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleShowSidebar = () => {
    setShowSidebar(!showSidebar)
  }
  const { userInfo } = useSelector((state) => state.userRegisterLogin);
  const dispatch = useDispatch();
  const location = useLocation();

  const goToAboutSection = () => {
    setShowSidebar(false);
    document.getElementById("about").scrollIntoView({ behavior: 'smooth' })
  };
  const goToTeamSection = () => {
    setShowSidebar(false);
    document.getElementById("team").scrollIntoView({ behavior: 'smooth' })
  };
  const goToContactSection = () => {
    setShowSidebar(false);
    document.getElementById("request").scrollIntoView({ behavior: 'smooth' })
  };

  const onClickBtn = () => {
    setStopAnimation(true)
    setShowSidebar(false);
    setIsOpenModalCatalogue(true);
  }

  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = () => {
    const aboutSection = document.getElementById('about');

    if (aboutSection) {
      const rect = aboutSection.getBoundingClientRect();
      const isPastSection = rect.bottom <= window.innerHeight;
      setIsVisible(!isPastSection);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length > 0) {
      setUerLoggedin(true);
    }
  }, [userInfo]);

  const openRoutes = [
    "/FaqPage",
    "/TermsConditions",
    "/privacypolicy",
    "/goodsreturnform",
    "/",
    "/product-list",
    "/product-details"
  ];

  const isOnOpenRoute = openRoutes.includes(window.location.pathname);

  useEffect(() => {
    dispatch(getSubcategories());
  }, []);


  const subcategories = useSelector((state) => state.getCategories.subcategories);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/get-token");
        setIsAdmin(response.data.isAdmin);
        if (response.data.isAdmin === true) {
          setIsAuth("admin");
        } else {
          setIsAuth(response.data.token);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuth) {
      localStorage.setItem("isAuth", isAuth);
    }
  }, [isAuth]);

  if (isLoading) {
    return (
      <Spinner animation="border" role="status" variant="success" ></Spinner>
    );
  }
  else if (isAuth === undefined || !isAuth) {
    return (
      <div
        style={{ position: "relative" }}
      >
        <Header goToAboutSection={goToAboutSection} goToTeamSection={goToTeamSection} goToContactSection={goToContactSection} />
        <div style={{ minHeight: "100vh" }}>
          <Outlet />
        </div>
        <ScrollButton />
        <Footer />
      </div>
    );
  } else {
    if (userPrevent && isAdmin !== admin) {
      return <Navigate to="/user/my-orders" replace />;
    } else {
      return (
        <div
          style={{ position: "relative" }}
        >
          <NewHeaderComponentLoggedIn
            setIsOpenModal={setIsOpenModalCatalogue}
            goToAboutSection={goToAboutSection}
            goToTeamSection={goToTeamSection}
            goToContactSection={goToContactSection}
            showSidebar={showSidebar}
            toggleShowSidebar={toggleShowSidebar}
            onClickBtn={onClickBtn} />
          <div style={{ minHeight: "100vh" }}>
            <Outlet />
          </div>
          <Footer />
          <ScrollButton />
        </div>
      );
    }
  }
};

export default ProtectedRoutesComponent;
