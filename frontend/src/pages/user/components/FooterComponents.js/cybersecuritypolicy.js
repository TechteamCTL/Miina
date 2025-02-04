import React from 'react'
import "../../../../App.css";

const CybersecurityPolicy = () => {
  return (
    <div className="container privatepolicy"><br />
      <h3>Miina Group Cybersecurity Policy</h3><br />

      <h5>Purpose</h5>
      <p>The purpose of this policy is to establish a framework for cybersecurity within Miina Group, ensuring the confidentiality, integrity, and availability of information and technology systems. This policy applies to all employees, contractors, and third-party suppliers who interact with Miina Group’s IT infrastructure.</p>
      <p></p>
      <h5>Scope</h5>
      <p>This policy applies to all Miina Group’s information systems, including enterprise, industrial, and operational technology systems. It sets requirements for Miina Group personnel and suppliers to mitigate cybersecurity risks.</p>
      <p></p>
      <h5>General Security Requirements</h5>
      <p>(a) All technology systems and services used or provided must not expose Miina Group to material cybersecurity risk.</p>
      <p>(b) Miina Group must conduct cybersecurity risk assessments on its own systems and any third-party systems, ensuring:</p>
      <ul className="terms-ul">
        <li>Identification of key technical and compliance measures for confidentiality, integrity, and availability of data.</li>
        <li>Implementation of control measures proportional to identified risks.</li>
      </ul>
      <p>(c) Critical technology systems must have response and recovery plans, with periodic testing to ensure rapid restoration of services.</p>
      <p>(d) Upon termination of a contract or relationship with Miina Group, suppliers and personnel must:</p>
      <ul className="terms-ul">
        <li>Return or destroy any Miina Group information.</li>
        <li>Terminate all access to Miina Group’s systems.</li>
        <li>Transfer intellectual property back to Miina Group as appropriate.</li>
      </ul>
      <p></p>
      <h5>Access Controls</h5>
      <p>(a) System access must be restricted to only those personnel who require it for business purposes.</p>
      <p>(b) Access procedures must include identification, authentication, authorization, and auditing measures.</p>
      <p>(c) Every user identity accessing Miina Group systems must be uniquely identifiable.</p>
      <p>(d) Multi-factor authentication (MFA) must be implemented for user access, especially for remote access.</p>
      <p>(e) All access-related information must be documented and retained for audit purposes.</p>
      <p></p>
      <h5>Remote Access Controls</h5>
      <p>(a) Remote access to Miina Group’s systems must be securely designed and strictly managed.</p>
      <p>(b) Only authorized personnel may access Miina Group’s network remotely, and access must be revoked once it is no longer required.</p>
      <p>(c) Miina Group will follow minimum technical controls for secure remote operations, including encrypted VPN connections and endpoint security measures.</p>
      <p>(d) Periodic reviews of remote access permissions must be conducted to ensure security compliance.</p>
      <p></p>
      <h5>Network Security and Integrity</h5>
      <p>(a) Miina Group must implement effective Network Segregation and Segmentation to protect critical assets.</p>
      <p>(b) A “deny by default” approach must be enforced, allowing communication only through explicitly approved rules.</p>
      <p>(c) Network zones must be protected with firewalls and intrusion detection systems to monitor and block unauthorized access.</p>
      <p></p>
      <h5>Information Protection</h5>
      <p>(a) Miina Group must establish change control processes, including:</p>
      <ul className="terms-ul">
        <li>Assessing the security impact of system changes.</li>
        <li>Documenting all configuration changes.</li>
        <li>omplying with Miina Group’s change management policies.</li>
      </ul>
      <p>(b) Response and recovery plans must incorporate:</p>
      <ul className="terms-ul">
        <li>Disaster Recovery Plans (DRP) for critical systems.</li>
        <li>Periodic testing to ensure rapid restoration in the event of cyber incidents.</li>
      </ul>
      <p></p>
      <h5>Data Security</h5>
      <p>(a) Information classified as Confidential or Highly Confidential must be encrypted when stored or transmitted over networks.</p>
      <p>(b) All internet-based data exchanges, regardless of classification, must utilize secure protocols such as TLS/SSL encryption.</p>
      <p>(c) Miina Group must implement secure backup solutions to ensure data integrity and availability.</p>
      <p></p>
      <h5>Removable Media Controls</h5>
      <p>(a) The use of removable media (USBs, external hard drives, optical discs) must be restricted to authorized personnel only.</p>
      <p>(b) Miina Group must maintain documented procedures for the handling and disposal of removable media.</p>
      <p>(c) Any removable media used must be encrypted and scanned for malware before being connected to Miina Group systems.</p>
      <p></p>
      <h5>Incident Response & Compliance</h5>
      <p>(a) Miina Group must establish an Incident Response Plan (IRP) for cybersecurity incidents, including reporting procedures and containment measures.</p>
      <p>(b) All employees and suppliers must report any suspected cybersecurity breaches immediately.</p>
      <p>(c) Compliance with this policy will be monitored through audits and cybersecurity assessments.</p>
      <p></p>
      <h5>Policy Review & Enforcement</h5>
      <p>This cybersecurity policy will be reviewed annually or after significant cybersecurity incidents. Non-compliance with this policy may result in disciplinary action, termination of supplier contracts, or legal action where applicable.</p>
      <p></p>
      <p></p>
      <p></p>
      <p>By adhering to this policy, Miina Group ensures a robust cybersecurity posture, protecting its systems, data, and reputation from cyber threats.</p>
    </div>
  )
}

export default CybersecurityPolicy