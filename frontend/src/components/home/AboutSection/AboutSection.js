import styles from "./AboutSection.module.css";

const AboutSection = () => {
    return <div className={styles.about} >
        <img className={styles.aboutImage} src="/svg/FamilyEmblemRed.svg" alt="Family Emblem Red" />
        <img className={styles.aboutImageArrow} src="/svg/arrow_narrow.svg" alt="Arrow" />
        <div className={styles.aboutImageText}>#Marni is a Family emblem is our symbol, our identity and our strong connection to Kuruma country, continuing and maintaining cultural practices is our responsibility to the Ngurra</div>
        <div className={styles.aboutWrapper}>
            <div className={styles.aboutInfo} id="about">
                <h1 className={styles.title}>WHO MIINA GROUP IS</h1>
                <p className={styles.text}>
                    Founded in 2021, Miina Group was created to capitalize on opportunities for Aboriginal people to do business on country working and/or providing supplies and services to Industry, Corporates, Government and other sectors including Aboriginal Businesses and Corporations in the Pilbara region and extending to neighbouring regions north in the Kimberley and south in the Midwest.<br /> <br />
                    Led by Howard Lockyer and Sherena Bin Hitam, the company aims to become a trusted provider of mining & construction safety supplies, machinery, equipment and small-scale rehabilitation services in the West Pilbara, working alongside other Aboriginal suppliers to meet industry demand.<br /> <br />
                    With deep cultural ties to the Pilbara region, Howard Lockyer, a descendant of the Kuruma, Yindjibarndi and Marthudunera people, brings a rich heritage of stewardship and cultural responsibility to the business. His partner, Sherena Bin Hitam, heritage is of Bardi Jawi, of the Dampier Peninsula and Yawuru peoples of Broome in the Kimberley.  She too brings her strong cultural responsibilities, business acumen and commitment.  Miina Group integrates these values into its operations, ensuring respect for traditional practices whilst pursuing business ventures<br /> <br />
                    The name “Miina”, derived from the Kuruma and Yindjibarndi word for the soft spinifex grass, symbolizes strength and resilience—traits the company aspires to embody. Miina’s mission is to steadily grow into a strong, dependable business that enriches and strengthens the community and land it serves.<br /> <br />
                    Miina's future includes staged development, starting in 2024/2025, with a focus on business development, building relations and supply with industry, corporates, government and other sectors through direct buy local engagement – with a responsible execution of supply operations through On-line procurement. The company’s strong foundation of mining knowledge and plant operations ensures its commitment to delivering reliable and culturally respectful services on Kuruma country and beyond.
                </p>
            </div>
            <div className={styles.aboutImages} >
                <div className={styles.aboutImagesOne}><img src="/images/image_about_2.jpg" alt="The Pannawonica area" /></div>
                <div className={styles.aboutImagesTwo}><img src="/images/image_about_1.jpg" alt="The Pannawonica area" /></div>
            </div>
        </div>
        <img className={styles.aboutImageBottom} src="/images/SubmarkGreen.png" alt="Submark Green" />
        <img className={styles.aboutImageArrowBottom} src="/svg/arrow_narrow_green.svg" alt="Arrow" />
        <div className={styles.aboutImageTextBottom}>Miina is named after the hardy perennial grass - Triodia Epactia, found throughout the Pilbara</div>
    </div>
}

export default AboutSection;