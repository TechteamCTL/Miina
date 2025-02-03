import { useState } from "react";
import styles from "./ContactSection.module.css";
import axios from "axios";

const ContactSection = () => {
    const [isSent, setIsSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [phoneNum, setPhoneNum] = useState('');
    const limit = 12;
    const handlePhoneNumberChange = event => {
        setPhoneNum(event.target.value.slice(0, limit));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
        setIsSending(true)
        const form = e.target;
        const formData = new FormData(form);

        const res = await axios.post(
            "/api/sendemail/sendRequest",
            formData,
            config
        );

        if (res.status === 200) {
            setIsSent(true)
        }
    }

    const sendNewRequest = () => {
        setIsSent(false);
        setIsSending(false)
    }

    return <div className={styles.contacts}>
        <img src="/images/FamilyEmblemCream.png" alt="Family Emblem" className={styles.backgroundEmblem} />
        {/* <div className={styles.contactsAcknowledgement}>
            <div className={styles.logoTaglineWrapper}>
                <img src="/svg/PrimaryLogoColour.svg" alt="Miina Group Logo" className={styles.logo} />
                <div className={styles.tagline}>Walking and Working on Country, safely</div>
            </div>
            <p className={styles.acknowledgement}>
                Miina Group acknowledges the traditional owners and custodians of country throughout Australia and acknowledges their continuing connection to land, waters and community. We pay our respects to the people, the cultures and the elders past, present and emerging.
            </p>
        </div> */}
        <h1 className={styles.title} id="request">Contact us</h1>
        <div className={styles.subtitle}>
            Didn’t find what you’re looking for?<br />
            <strong>Buy Local - Give us an opportunity to address your query and source what you need.</strong>
        </div>

        {!isSent ? <form className={styles.requestForm} method="post"
            onSubmit={handleSubmit}
        >
            <div>
                <label>Name</label>
                <input name="name" required placeholder="Full Name"></input>
            </div>

            <div>
                <label>Email address</label>
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email address"
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    title="Please enter a valid email address"
                ></input>
            </div>

            <div>
                <label>Phone</label>
                <input 
                name="phone"
                type="number" 
                required 
                placeholder="(+61) 400 000 000"
                onChange={handlePhoneNumberChange}
                value={phoneNum}
                />
            </div>

            <div>
                <label>Message</label>
                <textarea name="enquiry" placeholder="Please enter your message"></textarea>
            </div>

            <button className={styles.newRequestFormBtn} type="submit">{!isSending ? "Send Enquiry" : "Sending..."}</button>
        </form>
            : <div className={styles.newRequestSent}>
                <p>Your request has been sent. We will contact you within 24 hours.</p>
                <button
                    onClick={() => sendNewRequest()}
                    className={styles.newRequestFormBtn}>Send another request</button>
            </div>}

    </div>
}

export default ContactSection;