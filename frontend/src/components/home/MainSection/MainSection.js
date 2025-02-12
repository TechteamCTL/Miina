import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "./MainSection.module.css";

import { Navigation, Pagination, Scrollbar, A11y, Grid } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

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
    label: "TRANSIT",
    link: "TRANSIT",
    image: "/images/categoriesIcons/HAND_TOOLS.png",
    disabled: false
  }
];



const MainSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("PPE");
  const subcategories = useSelector((state) => state.getCategories.subcategories);

  return <div className={styles.main}>
    <img src="/images/FamilyEmblemCream.png" alt="Family Emblem White" className={styles.FamilyEmblemWhite} />
    <h1 className={styles.title}> Welcome to Miina Group!</h1>
    <p className={styles.text}>
      Wanthiwa, as a local Aboriginal business, we specialise in the supply of PPE and site safety related equipment, <strong>branded merchandise and a bespoke cultural transit service.</strong><br />

      Miina Group is <strong>establishing and building</strong> its client base and supplier network by collaborating with businesses that share our unwavering commitment to quality, reliability, and exceptional customer care.<br />
      
      We carefully select every supplier who align with our core values, ensuring we consistently deliver the highest level of service and products to clients across the Pilbara and surrounding regions. We are committed to work with and support fellow Aboriginal businesses in our supply chain.<br />
    </p>
    <div>
    <div className="green-line"></div>
      <div className={styles.categories}>
        <ul className={styles.categoriesList}>
          {mainCategories.map(category => {
            return <li
              key={category.label}
              className={selectedCategory === category.link ? styles.highlighted : styles.categoryItem}
              onClick={() => setSelectedCategory(category.link)}
            >
              <img src="/svg/SubmarkGreen.svg" alt="Miina Plant" className={`${styles.mark} ${styles.desktop}`} />
              <span>{category.label}</span>
            </li>
          })}
        </ul> 

        {subcategories[selectedCategory] ? <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Grid]}
          className={styles.swiper}
          navigation
          breakpoints={{
            320: {
              slidesPerView: 2,
              grid: {
                rows: 2,
              },
              spaceBetween: 25,
              navigate: false
            },
            1024: {
              slidesPerView:3 ,
          grid: {
            rows: 2,
           },
           spaceBetween: 25,
           
            }
          }}
        >
          {subcategories[selectedCategory].sort().map((subcategory, index) => (
            <SwiperSlide key={index}>
              <a href={`/product-list?categoryPath=${selectedCategory}/${subcategory}`}>
                <div className={styles.card}>
                  <img src="/svg/SubmarkWhite.svg" alt="Miina Plant" className={styles.logoPlant} />
                  <div>{subcategory.replace(/[-_]/g, ' ')}</div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
          : <div className={styles.defaultDescription}>
          <h4>This section is currently under development</h4>
            If you have any questions, please, <a href="#request">contact us</a></div>}
      </div>
      <div className="green-line"></div>
    </div>

  </div>
}

export default MainSection;