import styles from "../ContactSection/ContactSection.module.css"

const Acknowledgement = () => {
     return <div className={styles.contactsAcknowledgementWrapper} >
        <h1 className={styles.title}>Acknowledgement of Country</h1> 
      <div className={styles.contactsAcknowledgement}>
     {/* <div className={styles.logoTaglineWrapper}>
         <img src="/svg/PrimaryLogoColour.svg" alt="Miina Group Logo" className={styles.logo} />
         <div className={styles.tagline}>Walking and Working on Country, safely</div>
     </div> */}
     <p className={styles.acknowledgement}>
         Miina Group acknowledges the traditional owners and custodians of country throughout Australia and acknowledges their continuing connection to land, waters and community. We pay our respects to the people, the cultures and the elders past, present and emerging.
     </p>
 </div></div>
}
export default Acknowledgement;