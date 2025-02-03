import Nav from "react-bootstrap/Nav";
import styles from "./Footer.module.css";

const Footer = () => {
    return <div className={`${styles.footer} footer `}>
        <div className={styles.footerWrapper}>
            {/* <img src="/images/SubmarkRed.png" alt="Miina Plant" className={styles.logoPlant} /> */}
            <div className={styles.footerContent}>
                <div className={styles.footerLinks}>
                    <div>
                        <h6>POLICIES</h6>
                        <Nav.Link
                            id="terms_conditions"
                            className="ft_c"
                            href="/TermsConditions"
                            target="_blank"
                        >
                            Terms and Conditions
                        </Nav.Link>
                        <Nav.Link
                            id="privacy_policy"
                            className="ft_c"
                            href="/privacypolicy"
                            target="_blank"
                        >
                            Privacy Policy
                        </Nav.Link>
                        <Nav.Link
                            id="indigenous-procurement"
                            href="/pdfpreview?/Indigenous%20Procurement%20Policy.pdf"
                            target="_blank"
                            className="ft_c"
                        >
                            Indigenous Procurement Policy
                            <i className="bi bi-file-earmark-pdf-fill"></i>
                        </Nav.Link>
                    </div>

                    <div>
                        <h6>SERVICES</h6>
                        <Nav.Link
                            id="goods_return"
                            className="ft_c"
                            // href="/goodsreturnform"
                            target="_blank"
                        >
                            Warranty
                        </Nav.Link>
                        <Nav.Link
                            id="goods_return"
                            className="ft_c"
                            href="/pdfpreview?/Miina_Credit-Application-Form.pdf"
                            target="_blank"
                        >
                            Credit Application form
                            <i className="bi bi-file-earmark-pdf-fill"></i>
                        </Nav.Link>
                        <Nav.Link
                            id="goods_return"
                            className="ft_c"
                            // href="/pdfpreview?/CTL_Australia_Supplier_Code_of_Conduct.pdf"
                            target="_blank"
                        >
                            Supplier Code of Conduct
                            <i className="bi bi-file-earmark-pdf-fill"></i>
                        </Nav.Link>
                    </div>

                    <div>
                        <h6>!!!</h6>
                        <Nav.Link
                            id="goods_return"
                            className="ft_c"
                            href="/supplierstatement"
                            target="_blank"
                        >
                            Supplier Commitment
                        </Nav.Link>
                    </div>

                    <div>
                        <h6>CONTACTS</h6>
                        <Nav.Link
                            id="contact_sales"
                            className="ft_c"
                            href="mailto:howard@miinagroup.com.au"
                        >
                            howard@miinagroup.com.au
                        </Nav.Link>
                        <Nav.Link
                            id="contact_accounts"
                            className="ft_c"
                            href="mailto:admin@miinagroup.com.au"
                        >
                            admin@miinagroup.com.au
                        </Nav.Link>
                    </div>
                </div>
            </div>
        </div>
        <div className={styles.copyright}>Copyright © Miina Group 2025</div>
    </div>
}

export default Footer;