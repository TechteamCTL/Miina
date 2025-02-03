import styles from "./PartnersSection.module.css";

const PartnersSection = () => {
     return <div className={styles.partners}>
        <h1 className={styles.title}>Miina Group Affiliations</h1>
        <div className={styles.partnersLogoWRapper}>
            <div className={styles.imgOne}><img src="./images/ABDWA.png" alt="ABDWA LOGO" /></div>
            <div className={styles.imgTwo}><img src="./images/SN_Registered_ART.png" alt="SN REGISTERED ART" /></div>
            <div className={styles.imgThree}><img src="./images/ICN.png" alt="ICN LOGO" /></div>
        </div>
        </div>
}

export default PartnersSection;