import styles from "./TeamSection.module.css";

const teamData = [{
     name: "Howard Lockyer",
     role: "Proprietor",
     biography: [
          "Mechanical Fitter (Trade Certificate)", 
          "20+ years’ work experience in mining: Robe River and now Rio Tinto",
          "Fixed Plant Operations",
          "Plant Operator skills",
          "High Risk Certificate",
          "Cert IV TAE"
     ],
     email: "howard@miinagroup.com.au",
     phone: "+61 448 933 455",
     img: "/images/Howard.jpg"
},
{
     name: "Sherena Bin Hitam",
     role: "Business Manager",
     biography: [
          "Master Business Degree", 
          "Cert IV TAE",
          "10+ years’ work experience in mining",
          "Worked in Oil & Gas Operations",
          "25+ years in public administration and Aboriginal Affairs",
     ],
     email: "admin@miinagroup.com.au",
     phone: "+61 487 920 082",
     img: "/images/Sherena.jpg"
}

]

const TeamSection = () => {
     return <div className={styles.team} id="team">
          <h1 className={styles.title}>MIINA GROUP TEAM</h1>
          <div className={styles.teamInfo}>
               {
                    teamData.map((member, i) => {
                         return <div className={styles.card}>
                              <img src="/images/FamilyEmblemWhite.png" alt="Family Emblen White" className={styles.emblem} />
                         <div className={styles.name}>{member.name}</div>
                         <div className={styles.role}>{member.role}</div>
                         <div className={styles.info}>
                              <div className={styles.photo}><img src={member.img} alt={member.name}/></div>
                              <div className={styles.infoWrapper}>
                                   <div className={styles.biographyItems}>
                                        {member.biography.map((item, index) => {
                                             return <div key={index} className={styles.biographyItem}>
                                                  <img src="/svg/PrimaryLogoColour.svg" alt="Miina Group Logo" className={styles.logoTag} /><div>{item}</div>
                                             </div>
                                        })}
                                   </div>
                              </div>
                         </div>
                         <div>
                         <div className={styles.contactEmail}><img src="/svg/email_icon.svg" alt="Email" className={styles.icon} /> {member.email}</div>
                              <div><img src="/svg/phone_icon.svg" alt="Email" className={styles.icon}/>{member.phone}</div>
                         </div>
                         </div>
                    })
               }
          </div>

     </div>
}

export default TeamSection;
