import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import LoginRegisterPage from "../../pages/LoginRegisterPage";
import styles from "./Header.module.css";

const mainCategories = [
  {
    label: "PPE",
    link: "PPE",
    image: "/images/categoriesIcons/PPE.png",
    disabled: false
  },
  {
    label: "SITE SAFETY",
    link: "SITE-SAFETY",
    image: "/images/categoriesIcons/SITE_SAFETY.png",
    disabled: false

  },
  {
    label: "MERCHANDISING",
    link: "MERCHANDISING",
    image: "/images/categoriesIcons/POWER.png",
    disabled: false

  },
  {
    label: "TRAVEL",
    link: "TRAVEL",
    image: "/images/categoriesIcons/HAND_TOOLS.png",
    disabled: false
  }
];

const Header = ({ goToAboutSection, goToTeamSection, goToContactSection }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState("LoginForm");
  const navigate = useNavigate();

  const subcategories = useSelector((state) => state.getCategories.subcategories);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (type) => {
    setShow(true);
    setModalType(type)
  };

  const submitHandler = (e) => {
    if (e.keyCode && e.keyCode !== 13) return;
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product-list?searchQuery=${searchQuery}`);
    }
  };

  return <div className={styles.header}>
    <div className={styles.headerWrapper}>
      <div className={styles.menu}>
        <div className={styles.menuItem}>
          <span className={styles.catalogueMenuItem}>CATALOGUE</span>
          <div className={styles.catalogueDropdown}>
            {mainCategories.map((category) => {
              const hasSubcategories = subcategories[category.link]?.length > 0;
              return (
                <div className={styles.category} key={category.link}>
                  <a href={`/product-list?categoryPath=${category.link}`} className={styles.categoryPath}>
                    <img src="/images/SubmarkGreen.png" alt="Miina Group Logo" className={styles.logoTag} />
                    <div>{category.label}</div>
                  </a>
                  {hasSubcategories && (
                    <>
                      <div className={styles.arrow}>
                        <svg width="27" height="16" viewBox="0 0 27 16" xmlns="http://www.w3.org/2000/svg">
                          <path fill="currentColor" d="M0.991804 7.20499C0.439537 7.20952 -0.00449316 7.66089 3.3617e-05 8.21315C0.00456039 8.76542 0.45593 9.20945 1.0082 9.20492L0.991804 7.20499ZM26.712 8.70133C27.0993 8.30762 27.0942 7.67448 26.7004 7.28717L20.2845 0.975581C19.8908 0.588271 19.2577 0.59346 18.8704 0.987172C18.4831 1.38088 18.4883 2.01403 18.882 2.40134L24.585 8.01164L18.9747 13.7147C18.5874 14.1084 18.5926 14.7415 18.9863 15.1288C19.38 15.5161 20.0131 15.511 20.4005 15.1172L26.712 8.70133ZM1.0082 9.20492L26.0074 9.00001L25.991 7.00008L0.991804 7.20499L1.0082 9.20492Z" />
                        </svg>
                      </div>
                      <div className={styles.subcategories}>
                        {subcategories[category.link]?.sort().map((subcategory, index) => (
                          <a
                            href={`/product-list?categoryPath=${category.link}/${subcategory}`}
                            key={index}
                            className={styles.subcategoryItem}
                          >
                            {/* <img src="/images/SubmarkPurple.png" alt="Miina Group Logo" className={styles.logoTag} /> */}
                            {/* <img src="/svg/SubmarkPurple.svg" alt="Miina Group Logo" className={styles.logoTag} /> */}
                            <div className={styles.logoTagSubcategory}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 637.2 528.26"><path fill="currentColor" d="M221.88,488.64c-.35-.26-.69-.56-1.06-.77-15.37-8.86-31.47-16.01-48.73-20.31-13.36-3.33-26.98-4.19-40.71-3.34-11.34.71-22.61,2.01-33.85,3.61-2.29.33-4.56.82-6.84,1.22-2.14.38-3.5-.1-3.93-1.35-.41-1.17.39-2.88,2.19-3.56,2.68-1.01,5.45-1.89,8.26-2.38,15.92-2.78,31.92-4.93,48.15-4.54,10.19.25,20.22,1.63,30.11,4.06.39.1.77.2,1.16.27.14.02.3-.05.75-.14-.72-.33-1.21-.6-1.74-.78-14.45-5-29.22-8.84-44.35-11.04-15.49-2.25-31.04-4.12-46.57-6.12-3.17-.41-6.36-.65-9.54-.99-.71-.08-1.42-.22-2.11-.4-.91-.23-1.81-.77-1.68-1.74.11-.75.7-1.71,1.35-2.05.94-.49,2.14-.71,3.22-.68,4.07.12,8.15.28,12.21.61,6.29.51,12.57,1.16,18.85,1.75,21.51,2.03,42.84,5.04,63.56,11.5,21.34,6.65,41.11,16.31,58.77,30.11,2.95,2.3,5.78,4.75,8.87,6.97-.7-.81-1.39-1.62-2.1-2.42-22.6-25.63-49.54-45.38-80.58-59.6-13.65-6.25-27.33-12.45-40.99-18.69-1.23-.56-2.47-1.15-3.58-1.92-1.27-.88-1.59-2.1-1.09-3.1.51-1.04,1.54-1.44,3.11-.88,3.46,1.23,6.94,2.44,10.29,3.93,13.96,6.16,27.96,12.22,41.77,18.71,15.38,7.23,29.69,16.31,43.19,26.64.5.38,1.02.75,1.86.86-.52-.59-1.02-1.18-1.55-1.75-9.07-9.72-18.93-18.6-29.25-26.98-9.25-7.51-18.4-15.14-27.59-22.72-.99-.81-1.97-1.64-2.86-2.56-.55-.56-1.03-1.24-1.33-1.96-.38-.91-.36-1.92.41-2.68.8-.79,1.8-1.12,2.85-.6,1.07.52,2.15,1.08,3.09,1.8,6.7,5.19,13.39,10.39,20.02,15.67,12.58,10.02,24.85,20.39,35.98,32.04,12.8,13.39,24.13,27.95,34.56,43.23.48.71.98,1.41,1.76,1.97-.12-.35-.21-.71-.36-1.04-7.51-16.61-16.42-32.36-28.38-46.23-21.27-24.68-46.79-43.66-76.59-56.83-9.93-4.39-20.03-8.42-30.04-12.64-1.1-.46-2.21-.95-3.22-1.58-.91-.58-1.52-1.48-1.12-2.65.4-1.14,1.38-1.59,2.48-1.48,1.18.12,2.39.32,3.49.73,8.74,3.3,17.48,6.59,26.17,10.03,19.16,7.58,36.76,17.92,52.98,30.59,17.84,13.95,33.33,30.09,45.41,49.35,1.01,1.61,1.99,3.23,3.29,4.69-.34-.77-.68-1.54-1.04-2.3-12.92-28.02-30.86-52.41-53.38-73.46-10.17-9.5-20.3-19.04-30.44-28.57-.87-.82-1.75-1.66-2.46-2.61-1.03-1.39-1-2.8-.14-3.76.73-.81,2.21-1.1,3.56-.31,1.78,1.05,3.51,2.25,5.06,3.6,6.87,5.99,13.74,11.98,20.48,18.12,10.83,9.86,21.31,20.06,30.71,31.32,16.88,20.21,29.44,42.91,38.9,67.4,1.37,3.55,2.66,7.14,4.34,10.62-.66-3.19-1.25-6.39-1.98-9.56-3.15-13.53-6.3-27.06-9.54-40.58-2.61-10.92-7.41-20.9-13.43-30.33-9.47-14.84-19.7-29.13-30.51-43.02-2.36-3.03-4.68-6.08-6.98-9.15-.66-.88-1.4-1.33-2.53-1.53-3.2-.57-6.11-1.99-8.59-4.05-4.05-3.38-7.95-6.93-11.91-10.42-.3-.26-.71-.59-.74-.92-.18-1.91-1.74-2.76-2.87-3.94-1.38-1.45-2.78-2.87-4.11-4.36-.9-1-1.27-2.13-.8-3.54.19-.56-.06-1.35-.32-1.95-.75-1.76-1.68-3.45-2.39-5.22-.41-1.02-.51-2.15-.79-3.22-.19-.76-.34-1.55-.69-2.24-1.41-2.78-2.91-5.51-4.34-8.29-.47-.92-1.13-1.89-1.17-2.86-.06-1.82-1.15-2.61-2.47-3.47-9.11-5.96-17.77-12.54-26.04-19.61-1.5-1.28-2.75-2.87-4.04-4.38-.45-.53-.91-1.39-.11-1.88.49-.3,1.41-.29,1.95-.03,1,.47,1.89,1.18,2.78,1.85,8.94,6.73,17.7,13.72,26.86,20.14,9.25,6.49,16.52,14.79,23.37,23.56,5.78,7.4,10.58,15.42,14.94,23.71,1.72,3.28,3.83,6.25,6.14,9.12,10.6,13.12,21.25,26.22,30.65,40.25,5.07,7.57,10.26,15.05,14.86,22.93,4.89,8.38,8.32,17.17,10.1,26.75,1.4,7.53,3.55,14.91,5.36,22.36.32,1.31.6,2.64,1.14,3.94-.17-1.64-.32-3.29-.53-4.93-2.66-21.58-6.39-42.99-10.04-64.41-2.32-13.64-6-26.97-9.71-40.29-3-10.77-6.11-21.52-9.16-32.28-.35-1.23-.6-2.48-.87-3.73-.09-.39-.18-.8-.14-1.19.12-1.18.15-2.46,1.49-3.03.89-.38,2.05.14,2.9,1.59.85,1.43,1.6,2.97,2.11,4.55,3.5,10.95,7.04,21.9,10.36,32.91,3.58,11.86,6.95,23.78,9.09,36,1.46,8.34,2.74,16.71,4.01,25.08,1.28,8.37,2.45,16.76,3.67,25.14.28,1.96.55,3.92,1.04,5.85v-9.49c0-7.75,0-15.5,0-23.25,0-.64.09-1.28.09-1.91.06-14.39.18-28.79.15-43.18-.05-21.64-2.27-43.07-6.76-64.24-2.46-11.59-7.06-22.18-14.42-31.55-5.09-6.48-10.11-13-15.88-18.9-4.9-5.01-6.99-11.33-8.13-18.07-1.31-7.78-1.78-15.72-4.32-23.28-1.45-4.32-2.83-8.65-4.22-12.99-.31-.98-.5-2.01-.76-3.01-.2-.78-.04-1.41.79-1.85,1.04.24,1.52,1.09,1.81,1.99,2.4,7.44,4.88,14.87,7.06,22.38.53,1.84,1.29,3.36,2.43,4.76.86,0,1.82-.25,2.51.07.73.33,1.31,1.15,1.78,1.87,1.42,2.21,2.76,4.48,4.11,6.71.78-.11,1.69-.5,2.38-.26.74.27,1.43,1.04,1.86,1.76.88,1.51,1.59,3.13,2.34,4.71.33.71.6,1.45.92,2.24,2.33-.86,3.55.45,4.55,2.12,2.38,3.96,3.69,8.32,4.57,12.8.96,4.86,1.58,9.77,1.47,14.75,0,.65.23,1.44.63,1.96,8.63,11.31,12.7,24.42,15.12,38.18,2.06,11.73,3.62,23.54,4.34,35.43.35,5.74.53,11.5.62,17.25.15,9.99.24,19.98.23,29.97-.02,15.43-.14,30.86-.22,46.29,0,.64,0,1.27.24,1.95,2.34-10.91,4.44-21.88,7.1-32.71,2.69-10.93,5.66-21.8,9.02-32.54,3.34-10.67,7.07-21.23,11.07-31.66,4.03-10.51,8.59-20.8,12.99-31.35-1.23-.37-1.98-1.41-1.99-2.9-.07-7.43-.06-14.87,1.42-22.19.31-1.54.96-3.04,1.63-4.49.74-1.62,1.69-3.14,3.6-2.97.79-3.05,1.41-5.93,2.3-8.74.76-2.42,2.25-4.35,4.54-5.66.59-.33.94-1.18,1.26-1.86,1.17-2.44,2.16-4.98,3.47-7.34,1.05-1.89,2.62-3.28,4.64-2.79,1.69-1.57,3.19-2.85,4.53-4.29.48-.51.66-1.37.8-2.1,1.15-6.12,2.23-12.25,3.38-18.37.21-1.09.57-2.17.98-3.2.38-.96.84-1.91,1.41-2.76.51-.77,1.13-1.76,2.29-1.25,1.03.45.63,1.52.63,2.36,0,.47-.11.95-.23,1.41-2.73,10.47-4.04,21.15-5.16,31.89-.45,4.34-1.66,8.6-2.58,12.89-.15.68-.59,1.31-.91,1.95-7.74,15.34-15.84,30.5-23.14,46.05-15.13,32.23-26.29,65.86-33.67,100.69-2.6,12.26-4.49,24.67-6.7,37.01,0,.07.04.15.12.46.42-.4.79-.72,1.1-1.08.42-.48.74-1.06,1.19-1.5,3.21-3.17,4.94-7.11,6.46-11.29,6.22-17.14,15.04-32.97,24.85-48.3,10.12-15.81,21.89-30.33,34.1-44.52,5.22-6.06,10.63-11.94,16-17.87.85-.94,1.85-1.76,2.89-2.49.73-.52,1.68-.68,2.41.09.79.83.28,1.65-.23,2.38-.46.65-1.02,1.23-1.53,1.85-8.66,10.37-17.6,20.52-25.93,31.16-15.66,20.01-29.28,41.35-40.22,64.33-1.4,2.93-2.65,5.93-3.98,8.9.13.1.25.2.38.29,1.27-1.03,2.47-2.15,3.81-3.08,3.34-2.32,5.78-5.36,7.96-8.78,8.13-12.75,17.38-24.72,26.38-36.85,5.19-7,10.45-13.95,15.69-20.91.38-.51.79-1.02,1.27-1.43.78-.68,1.69-.9,2.66-.35,1.03.58,1.48,1.54,1.19,2.63-.27.98-.71,1.96-1.28,2.81-2.24,3.31-4.53,6.58-6.87,9.82-8.8,12.18-17.63,24.35-26.44,36.53-.46.63-.87,1.29-1.08,2.23.44-.25.89-.48,1.31-.75,9.05-5.75,18.47-10.83,28.15-15.44,1.33-.63,2.37-1.48,3.29-2.66,7.26-9.34,14.58-18.64,21.91-27.92.76-.97,1.12-1.92,1.28-3.2,1.29-10.05,4.12-19.53,10.81-27.46,1.04-1.23,2.11-2.36,3.76-2.84.57-.17,1.05-.85,1.45-1.39,1.34-1.79,2.59-3.65,3.95-5.42,1.04-1.35,2.21-2.57,3.77-2.45,2.21-3.49,4.19-6.77,6.33-9.93,1.15-1.7,2.39-3.51,5.01-2.92.37.08.9-.53,1.35-.84,2.68-1.87,5.3-3.84,8.06-5.57,1.03-.65,1.65-1.32,2.01-2.45,2.28-7.01,5.24-13.74,8.71-20.23,1.2-2.25,2.63-4.39,4.17-6.42.84-1.11,2.07-1.97,3.25-2.76.38-.26,1.28-.11,1.7.18.28.2.32,1.04.17,1.5-.23.75-.62,1.48-1.07,2.13-5.67,8.25-9.35,17.45-12.52,26.85-3.4,10.11-8.48,19.29-14.88,27.75-2.6,3.44-5.17,7.01-8.31,9.91-4.55,4.2-8.4,8.98-12.54,13.53-9.9,10.89-19.45,22.08-28.23,33.91-.71.96-1.42,1.91-1.93,3.26.74-.29,1.5-.55,2.23-.87,13.9-6.09,27.8-12.18,41.71-18.27.95-.42,1.92-.8,2.89-1.17.52-.2,1.06-.4,1.6-.47.79-.1,1.7-.17,2.04.79.32.9-.18,1.55-.96,1.95-.78.41-1.58.77-2.38,1.14-11.48,5.24-22.99,10.42-34.45,15.72-5.73,2.65-11.34,5.54-17.03,8.27-1.41.68-2.47,1.63-3.37,2.93-9.73,14.07-19.5,28.12-29.27,42.16-1.87,2.68-3.79,5.33-5.51,8.25.27-.16.57-.28.8-.47,15.23-13.03,32.16-23.43,50.11-32.17,12.78-6.22,25.74-12.09,38.64-18.08,1.59-.74,3.27-1.29,4.93-1.83.66-.21,1.43-.32,2.11-.21,1.81.29,2.51,2.03,1.24,3.37-.85.89-2.02,1.55-3.15,2.1-11.54,5.68-23.15,11.22-34.65,16.98-12.51,6.27-24.64,13.22-36.31,20.98-12.51,8.33-23.61,18.33-34.4,28.7-4.78,4.6-9.34,9.43-13.99,14.17-.32.33-.59.7-.71,1.32.24-.11.52-.17.72-.34,16.18-13.15,34.22-23.22,53.01-32.06,18.53-8.72,37.42-16.48,57.18-22.04,12.72-3.58,25.63-6.18,38.71-7.93,13.86-1.85,27.76-3.45,41.64-5.13,1.82-.22,3.67-.3,5.5-.4.55-.03,1.17-.07,1.65.14.53.24,1.26.72,1.3,1.17.06.59-.29,1.49-.76,1.79-.77.5-1.76.76-2.69.89-7.6,1.02-15.23,1.89-22.82,2.99-20.79,3.01-41.65,5.58-61.93,11.45-18.16,5.26-35.62,12.32-52.67,20.41-13.51,6.41-26.78,13.27-39.27,21.55-.6.4-1.18.82-1.76,1.24-.09.06-.08.25-.2.64.79-.33,1.43-.55,2.04-.85,29.51-14.62,60.4-25.25,92.64-31.92,14-2.9,28.05-5.61,42.08-8.37,1.17-.23,2.38-.29,3.57-.29,1.05,0,1.84.57,2.12,1.62.31,1.16-.15,2.1-1.17,2.63-.91.47-1.91.81-2.92,1.04-12.24,2.74-24.47,5.51-36.72,8.17-19.61,4.25-39.05,9.11-57.96,15.9-.89.32-1.76.68-2.58,1.32.48-.05.98-.05,1.45-.16,20.38-4.88,41.04-7.49,62-7.42,14.23.05,28.46.45,42.7.75,7.2.15,14.39.4,21.58.66,1.18.04,2.39.23,3.52.57,1.05.32,1.73,1.17,1.73,2.35s-.77,1.95-1.82,2.27c-.98.29-2.04.44-3.07.48-2.64.09-5.28.12-7.92.11-16.31-.06-32.63-.13-48.94-.21-12.08-.07-24.15.33-36.16,1.71-30.86,3.52-60.26,12-87.97,26.12-4.06,2.07-8.06,4.24-12.09,6.37-.69.36-1.34.8-1.82,1.63.88-.3,1.76-.58,2.63-.89,10.83-3.92,21.88-7.06,33.19-9.32,14.93-2.98,30-3.2,45.14-2.65,13.38.49,26.58,2.43,39.78,4.39,4.03.6,8.04,1.3,12.06,1.98.7.12,1.41.31,2.07.56.86.33,1.61.93,1.47,1.94-.14,1.01-1.01,1.42-1.94,1.45-1.36.04-2.72.05-4.07-.1-2.94-.32-5.87-.72-8.8-1.12-20.63-2.82-41.33-4.55-62.17-3.55-11.05.53-21.9,2.48-32.65,5.02-2.33.55-4.67,1.07-6.98,1.71-9.07,2.51-17.31,6.53-24,13.34-1.18,1.2-2.37,2.39-3.68,3.44-4.13,3.31-8.78,3.17-12.57-.48-1.42-1.37-2.61-3-3.78-4.61-2.54-3.49-4.81-7.18-7.56-10.49-1.64-1.98-3.78-3.73-6.02-5.02-11.2-6.51-23.26-10.56-36.22-11.58-10.28-.81-20.57-1.4-30.86-2.1-3.03-.21-6.06-.4-9.08-.73-2.41-.26-3.8-1.6-3.74-3.3.06-1.69,1.48-2.92,3.96-3.03,4.71-.2,9.44-.45,14.14-.3,9.51.3,19.01.79,28.5,1.35,4.95.29,9.81,1.33,14.59,2.66.83.23,1.67.42,2.51.64.03-.08.07-.16.1-.24h.11ZM335.18,409.37c-.72.29-1.13.4-1.49.6-10.69,5.95-21.11,12.33-30.78,19.86-1.1.86-2.15,1.96-2.82,3.18-3.6,6.49-7.42,12.89-10.51,19.63-5.77,12.54-11.09,25.29-16.59,37.96-.13.3-.14.67-.18.88,22.4-25.94,42.09-53.97,62.36-82.1h0ZM381.15,341.97l-.61-.25c-4.81,6.42-7.69,13.71-9.36,21.57,2.56-2.7,5.46-5.07,6.36-8.98.57-2.48,1.57-4.85,2.3-7.29.5-1.66.87-3.36,1.3-5.05h.01ZM410.81,313.63c-.15-.15-.31-.29-.46-.44-2.26,1.56-4.53,3.1-6.75,4.72-.3.22-.41.84-.45,1.28-.33,3.76-1.3,7.35-2.66,10.86-.21.54-.34,1.11-.5,1.67,4.35-5.64,7.7-11.8,10.82-18.09ZM390.92,341.8c.37-.27.74-.4.85-.65,2.1-4.81,4.26-9.59,6.21-14.46.86-2.16,1.28-4.49,1.9-6.75-.19-.09-.38-.18-.58-.27-1.27,1.89-2.54,3.78-3.81,5.67-1.6,2.37-2.81,4.74-2.83,7.84-.01,2.78-1.07,5.55-1.74,8.62h0ZM222.56,223.55c-.18.53-.3.69-.26.81.15.53.32,1.06.52,1.58,2.35,5.94,4.33,11.99,4.61,18.43.07,1.7.8,2.56,2.34,3.15-.1-8.7-2.91-16.4-7.2-23.97h-.01ZM332.81,252.28c-3.16,3.73-5.47,13.41-4.54,16.96,1.01-1.53,2.06-3.01,3-4.57.31-.51.37-1.19.46-1.81.26-1.73.53-3.45.7-5.19.18-1.79.25-3.59.37-5.38h.01ZM162.74,311.12c-.17.12-.33.23-.5.35.8,1.78,1.65,3.54,2.39,5.35.4.99,1.07,1.42,2.05,1.76,2.4.84,4.75,1.84,7.13,2.76.37.14.75.22,1.67.48-4.03-4.45-8.2-7.8-12.74-10.7ZM181.48,331.26c-4.39-4.26-8.97-7.78-14.88-9.15,1.51,2.01,3.12,3.88,4.77,5.71.25.28.65.47,1.01.59,2.94.94,5.88,1.85,9.09,2.85h0ZM286.64,444.52c-.14-.08-.27-.17-.41-.25-2.1,2.27-4.65,4.1-5.54,7.44-1.11,4.15-2.57,8.21-3.88,12.32-.07.23-.18.45-.21.68-.03.23.03.46.09,1.16,3.46-7.42,6.71-14.38,9.95-21.34h0ZM389.09,332.43c-1.95,1.69-3.44,3.71-4.77,5.85-.19.3-.25.78-.17,1.13.72,3.02-.22,5.82-1.01,8.65-.2.71-.36,1.42-.54,2.13.17.05.33.09.5.14,2.41-5.81,5.11-11.52,6-17.91h0ZM325.01,260.09c-2.37,3.73-3.64,16.59-3.47,21.82,1.32-2.54,2.81-4.49,2.5-7.34-.24-2.26.18-4.6.35-6.9.18-2.53.41-5.06.62-7.58ZM158.02,299.15c.77,1.81,1.59,3.59,2.29,5.43.46,1.19,1.21,1.89,2.35,2.49,2.04,1.08,3.93,2.43,5.89,3.67.5.32,1,.64,1.49.96-3.22-4.94-7.34-8.96-12.02-12.55ZM309.67,304.75c.61-1.18,1.3-2.33,1.79-3.55.32-.78.49-1.67.48-2.5-.04-3.35-.21-6.69-.27-10.04-.05-2.43,0-4.86,0-7.28-2,7.62-1.69,15.48-2,23.38h0ZM318.07,269.09c-1.59,3.13-2.96,19.41-1.84,22.84.84-1.59,1.6-3.04,2.37-4.49-.77-1.29-1.33-2.57-1.3-3.83.14-4.78.48-9.55.76-14.52h.01ZM237.34,240.82c1.05,5.48,1.59,10.99,1.89,16.54.06,1.08.53,2.09,2.03,2.64-.94-6.65-.85-13.22-3.92-19.18ZM219.62,225.55c.86,5.66,1.72,11.34,4.28,16.56-.18-5.84-1.84-11.3-4.28-16.56ZM231.58,236.12c.96,4.89,2.3,9.74,1.24,14.94.71.6,1.47,1.26,2.39,2.04-.14-5.96-1.18-11.61-3.63-16.98ZM186.21,341.3c.18-.19.36-.37.54-.56-2.78-2.66-5.27-5.67-8.93-7.25-.12.14-.23.28-.35.42l8.74,7.38h0ZM269.91,466.41c-2.49,2.72-3.07,5.99-2.54,9.54.85-3.18,1.69-6.36,2.54-9.54Z" /></svg>
                            </div>
                            {subcategory}
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

        </div>
        <div className={styles.menuItem}>
          <span className={styles.aboutMenuItem}>ABOUT US</span>
          <div className={styles.dropdown}>
            <button onClick={goToAboutSection}>
              <div className={styles.aboutMenu}><img src="/svg/SubmarkGreen.svg" alt="Miina Group Logo" className={styles.logoTag} />Who Miina Group is</div>
            </button>
            <button onClick={goToTeamSection}>
              <div className={styles.aboutMenu}><img src="/svg/SubmarkGreen.svg" alt="Miina Group Logo" className={styles.logoTag} />Miina Group Team</div>
            </button>
          </div>
        </div>
        <button onClick={goToContactSection}><div className={styles.menuItem}>CONTACT</div></button>
      </div>
      <div className={styles.logoTaglineWrapper} onClick={() => { navigate("/") }}>
        <img src="/svg/PrimaryLogoColour.svg" alt="Miina Group Logo" className={styles.logo} />
        <div className={styles.tagline}>
          Walking and Working on Country, safely
        </div>
      </div>

      <div className={styles.logRegNew}>
        <div className={`${styles.search}`}>
          <input
            placeholder="Search 1000+ products"
            className={styles.inputSearch}
            onKeyUp={submitHandler}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className={styles.iconNew}
            onClick={submitHandler}
          >
            <i class="bi bi-search fs-4"></i></button>
        </div>
        <i class="bi bi-person-circle fs-4"></i>
        <button
          onClick={() => handleShow("LoginForm")}
        >LogIn</button>
        <span>/</span>
        <button
          onClick={() => handleShow("RegisterForm")}
        >Register</button>
      </div>
    </div>

    <Modal show={show} onHide={handleClose} className="login_preview_items">
      <LoginRegisterPage modalType={modalType} />
    </Modal>
  </div>
}

export default Header;