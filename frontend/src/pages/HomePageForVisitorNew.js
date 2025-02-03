import MainSection from "../components/home/MainSection/MainSection.js";
import AboutSection from "../components/home/AboutSection/AboutSection.js";
import TeamSection from "../components/home/TeamSection/TeamSection.js";
import ContactSection from "../components/home/ContactSection/ContactSection.js";
import PartnersSection from "../components/home/PartnersSection/PartnersSection.js";
import Acknowledgement from "../components/home/Acknowledgement/Acknowledgement.js";

const HomePageForVisitorNew = () => {   
  return <div style={{position: "relative"}}>
    <MainSection />
    <AboutSection />
    <TeamSection />
    <ContactSection />
    <PartnersSection />
    <Acknowledgement />
    </div>
  }

export default HomePageForVisitorNew;
