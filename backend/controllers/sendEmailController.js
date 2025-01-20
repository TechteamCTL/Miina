const nodemailer = require("nodemailer");
const Order = require("../models/OrderModel");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.CTLEMAIL,
    pass: process.env.CTLEMAILPASSWORD,
  },
});

const testTransporter = nodemailer.createTransport({
  host: "mail.problematic.com.au",
  port: 465,
  secure: true,
  auth: {
    user: process.env.PMEMAIL,
    pass: process.env.PMEMAILPASSWORD,
  },
});

const managementApproval = async (req, res, next) => {
  try {
    // 因为 后面可能要改动 base64data 所以要用 let，不能用 const
    let { from, managerEmail, totalPrice, description, base64data } = req.body;

    const base64prefix = "data:application/pdf;base64,";
    if (base64data.startsWith(base64prefix)) {
      base64data = base64data.slice(base64prefix.length);
    }

    const message = {
      from: `"no-reply Miina Group " <${process.env.CTLEMAIL}>`,
      to: `${managerEmail}`,
      subject: `My shopping cart of $${totalPrice}`,
      text: `
    The email is from: ${from},

    This is my current purchase of: $${totalPrice},
    
    Please find the more details in attached PDF.`,

      attachments: [
        {
          filename: "Cart.pdf",
          content: Buffer.from(base64data, "base64"),
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    await transporter.sendMail(message);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    next(error);
  }
};

const sendInvoice = async (req, res, next) => {
  try {
    // 因为 后面可能要改动 base64data 所以要用 let，不能用 const
    let {
      totalPrice,
      billingEmail,
      invoiceNumber,
      base64data,
      purchaseNumber,
      orderID,
    } = req.body;
    const order = await Order.findById(orderID);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.invHasSent) order.invHasSent = 0;
    order.invHasSent++;

    await order.save();

    const base64prefix = "data:application/pdf;base64,";
    if (base64data.startsWith(base64prefix)) {
      base64data = base64data.slice(base64prefix.length);
    }

    const message = {
      from: `"no-reply Miina Group" <${process.env.CTLEMAIL}>`,
      to: `${billingEmail}`,
      subject: `Invoice ${invoiceNumber} from Miina Group`,
      text: `
  Hi There,

  Please find the attached invoice for $${totalPrice}, with the INV#: ${invoiceNumber} corresponding to your P/O#: ${purchaseNumber}.
      
  If you have any inquiries, please do not hesitate to contact us at: admin@miinagroup.com.au
      
  Kind Regards,
  The Miina Group Team
    `,

      attachments: [
        {
          filename: "Invoice.pdf",
          content: Buffer.from(base64data, "base64"),
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    await transporter.sendMail(message);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    next(error);
  }
};

const sendProformaInvoice = async (req, res, next) => {
  try {
    // 因为 后面可能要改动 base64data 所以要用 let，不能用 const
    let {
      totalPrice,
      billingEmail,
      invoiceNumber,
      base64data,
      purchaseNumber,
      orderID,
    } = req.body;
    const order = await Order.findById(orderID);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.proformaInvHasSent) order.proformaInvHasSent = 0;
    order.proformaInvHasSent++;

    await order.save();

    const base64prefix = "data:application/pdf;base64,";
    if (base64data.startsWith(base64prefix)) {
      base64data = base64data.slice(base64prefix.length);
    }

    const message = {
      from: `"no-reply Miina Group" <${process.env.CTLEMAIL}>`,
      to: `${billingEmail}`,
      subject: `Proforma Invoice ${invoiceNumber} from Miina Group`,
      text: `
  Hi There,

  Please find the attached proforma invoice for $${totalPrice}, with the INV#: ${invoiceNumber} corresponding to your P/O#: ${purchaseNumber}.
      
  If you have any inquiries, please do not hesitate to contact us at: admin@miinagroup.com.au
      
  Kind Regards,
  The Miina Group Team
    `,

      attachments: [
        {
          filename: "ProformaInvoice.pdf",
          content: Buffer.from(base64data, "base64"),
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    await transporter.sendMail(message);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    next(error);
  }
};

const newOrderRemind = async (req, res, next) => {
  if (process.env.NODE_ENV !== "development") {
    try {
      const { from, PO, price } = req.body;

      message = {
        from: `"no-reply Miina Group" <${process.env.CTLEMAIL}>`,
        to: process.env.QTEMAIL,
        subject: `A new order has been placed by ${from}`,
        text: `${from} has just placed an order for $${price}, PO#: ${PO}

please check that <https://www.miinagroup.com.au/admin/orders>.`,
      };

      // Send email
      await transporter.sendMail(message);

      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      next(error);
    }
  } else {
    res.json({ message: "Development Env !!!" });
  }
};

const deliveryNotice = async (req, res, next) => {
  if (process.env.NODE_ENV !== "development") {
    try {
      const { userEmail, purchaseNumber, trackLink } = req.body;

      const message = {
        from: `"no-reply Miina Group" <${process.env.CTLEMAIL}>`,
        to: userEmail,
        subject: `P0#:${purchaseNumber} has been shipped`,
        text: purchaseNumber,
        html: `
      <div style="margin:0;padding:0">
  <div style="background-color:#f1f2ed">
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background-color:#f1f2ed"
    >
      <tbody>
        <tr>
          <td width="17">&nbsp;</td>
          <td valign="top" align="center">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <td valign="top" align="center">
                    <table
                      align="center"
                      width="594"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tbody>
                        <tr>
                          <td width="17">&nbsp;</td>
                          <td width="560" valign="top" align="center">
                            <table
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              border="0"
                              style="padding-top:10px"
                            >
                              <tbody>
                                <tr></tr>

                                <tr>
                                  <td width="100%" height="62">
                                    &nbsp;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td width="17">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td valign="top" align="center">
                    <table
                      align="center"
                      width="594"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="background-color:#ffffff"
                    >
                      <tbody>
                        <tr>
                          <td width="17">&nbsp;</td>
                          <td width="560" valign="top" align="center">
                            <table
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td width="100%" valign="top" align="center">
                                  <br />
                                      <img
                                        src="https://ctladmin.b-cdn.net/CTL%20Brand%20Images/letterhead1.png"
                                        align="center"
                                        border="0"
                                        width="500"
                                        height="100"
                                        alt="Miina Group"
                                        style="outline:none;text-decoration:none;display:block;font-size:8px;line-height:100%"
                                        class="CToWUd"
                                        data-bit="iit"
                                      />
                                  </td>
                                </tr>

                                <tr>
                                  <td width="17">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td width="17">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td width="100%" valign="top" align="left">
                                    <div style="font-family:'Helvetica Light',Helvetica,Arial,sans-serif;font-size:14px;color:#000000;line-height:20px">
                                      <span style="font-size:14px;font-weight:normal;color:#000000">
                                        <b>
                                        <br />
                                        Your order for P/O#: ${purchaseNumber} has been shipped,
                                        <br />
                                        </b>
                                        <br />
                                        <br />
                                        Please click on the following button to track your shipping:
                                        <br />
                                        <br />
                                        <br />
                                        <a href="${trackLink}" style="padding:8px 15px; color: white; background: #1e4881; text-decoration:none;">Track Shipping</a>
                                        <br />
                                        <br />
                                        <br />
                                        If you have any other inquiries, please don't hesitate to contact
                                        <a
                                          href="mailto:admin@miinagroup.com.au"
                                          target="_blank"
                                        >
                                          admin@miinagroup.com.au
                                        </a>.
                                        <br />
                                        <br />
                                        <b>
                                            Thank you,
                                            <br />
                                            The Miina Group Team
                                            <br />
                                            <br />
                                            <br />
                                        </b>
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>

    <font face="arial,helvetica,sans-serif" size="2">
      <hr>
        CAUTION: This <span class="il">email</span> and files included in its
        transmission are solely intended for the use of the addressee(s) and may
        contain information that is confidential and privileged. If you receive
        this <span class="il">email</span> in error, please advise us
        immediately and delete it without copying the contents contained within.
        Miina Group (including its group of companies) do not accept
        liability for the views expressed within or the consequences of any
        computer viruses that may be transmitted with this email. The contents are also subject to copyright. No part of it should be reproduced, adapted or transmitted
        without the written consent of the copyright owner.
      </hr>
    </font>
    <div class="yj6qo"></div>
  </div>
</div>;`,
      };

      await transporter.sendMail(message);

      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      res.json(error);
    }
  } else {
    res.status(200).json({ message: "Skipping send email in Dev" });
    console.log("Skipping send email in Dev");
  }
};

const newUserNoticeToMiina = async ({
  email,
  name,
  lastName,
  company,
  location,
}) => {
  if (process.env.NODE_ENV !== "development") {
    try {
      console.log(
        "newUserNoticeToJosh req.body",
        email,
        name,
        lastName,
        company,
        location
      );
      console.log("I am here send out new user notice to Josh");

      const message = {
        from: `"New User - Miina Group" <${process.env.CTLEMAIL}>`,
        to: `${process.env.JOSHEMAIL}`,
        subject: `A New User ${email} from ${company} just Registered`,
        text: email,
        html: `
    <div style="margin:0;padding:0">
<div style="background-color:#f1f2ed">
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color:#f1f2ed"
  >
    <tbody>
      <tr>
        <td width="17">&nbsp;</td>
        <td valign="top" align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tbody>
              <tr>
                <td valign="top" align="center">
                  <table
                    align="center"
                    width="594"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                  >
                    <tbody>
                      <tr>
                        <td width="17">&nbsp;</td>
                        <td width="560" valign="top" align="center">
                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="padding-top:10px"
                          >
                            <tbody>
                              <tr></tr>
                            </tbody>
                          </table>
                        </td>
                        <td width="17">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td valign="top" align="center">
                  <table
                    align="center"
                    width="594"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="background-color:#ffffff"
                  >
                    <tbody>
                      <tr>
                        <td width="17">&nbsp;</td>
                        <td width="560" valign="top" align="center">
                          <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                          >
                            <tbody>
                              <tr>
                                <td width="100%" valign="top" align="center">
                                <br />
                                    <img
                                      src="https://ctladmin.b-cdn.net/CTL%20Brand%20Images/letterhead1.png"
                                      align="center"
                                      border="0"
                                      width="500"
                                      height="100"
                                      alt="Miina Group"
                                      style="outline:none;text-decoration:none;display:block;font-size:8px;line-height:100%"
                                      class="CToWUd"
                                      data-bit="iit"
                                    />
                                </td>
                              </tr>

                              <tr>
                                <td width="17">&nbsp;</td>
                              </tr>
                              <tr>
                                <td width="17">&nbsp;</td>
                              </tr>
                              <tr>
                                <td width="100%" valign="top" align="left">
                                  <div style="font-family:'Helvetica Light',Helvetica,Arial,sans-serif;font-size:14px;color:#000000;line-height:20px">
                                    <span style="font-size:14px;font-weight:normal;color:#000000">
                                      <b>
                                      Hi Admin,
                                      <br />
                                      </b>
                                      <br />
                                      A new user just registered with us:
                                      <br />
                                      <br />
                                      <span style="font-weight: bold;">Name:</span> ${name} ${lastName}
                                      <br />
                                      <br />
                                      <span style="font-weight: bold;">Email:</span>${email}
                                      <br />
                                      <br />
                                      <span style="font-weight: bold;">Company:</span>${company}
                                      <br />
                                      <br />
                                      <span style="font-weight: bold;">Location:</span>${location}
                                      <br />
                                      <br />
                                      Please click on the following button to check the user details:
                                      <br />
                                      <br />
                                      <a href="https://www.miinagroup.com.au/admin/users" style="padding:8px 15px; color: white; background: #1e4881; text-decoration:none;">Check User</a>
                                      <br />
                                      <br />
                                      <b>
                                          Kind Regards,
                                          <br />
                                          TechTeam
                                          <br />
                                          <br />
                                      </b>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>

  <font face="arial,helvetica,sans-serif" size="2">
    <hr>
      CAUTION: This <span class="il">email</span> and files included in its
      transmission are solely intended for the use of the addressee(s) and may
      contain information that is confidential and privileged. If you receive
      this <span class="il">email</span> in error, please advise us
      immediately and delete it without copying the contents contained within.
      Miina Group (including its group of companies) do not accept
      liability for the views expressed within or the consequences of any
      computer viruses that may be transmitted with this email. The contents are also subject to copyright. No part of it should be reproduced, adapted or transmitted
      without the written consent of the copyright owner.
    </hr>
  </font>
  <div class="yj6qo"></div>
</div>
</div>`,
      };

      await transporter.sendMail(message);

      console.log("Email sent successfully");
    } catch (error) {
      console.error(error);
    }
  }
};


const sendRequest = async (req, res, next) => {
  try {
    if (req.body.categoryTypeSelectId === "quote") {
      let file = null;
      if (req.files && req.files.file) {
        file = req.files.file[0];
      }

      message = {
        from: `"no-reply Miina Group" <${process.env.CTLEMAIL}>`,
        to: process.env.QTEMAIL,
        subject: `Enquiry : Quote New Products: ${req.body.productName}`,
        text: `
      We received an Enquiry from, 
      ${req.body.name} :  ${req.body.email},

      Product : ${req.body.productName},
      Product Brand / Product code / SKU: ${req.body.brand}
      Product Description: ${req.body.description}`,
      };

      if (file) {
        message.attachments = [
          {
            filename: file.name,
            content: file.data,
          },
        ];
      }

      await transporter.sendMail(message);
      res.status(200).json({ message: "Email sent successfully" });

    } else {
      message = {
        from: `"no-reply Miina Group" <${process.env.CTLEMAIL}>`,
        to: process.env.QTEMAIL,
        subject: "Enquiry : General request",
        text: `
      We received an Enquiry from,
      ${req.body.name} :  ${req.body.email},

      ${req.body.textarea}`,
      };

      await transporter.sendMail(message);
    }

    res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    next(error)
  }
}

const sendNotification = async (receivingEmail, backOrderList) => {
  try {
    const message = {
      from: `"no-reply Miina Group" <${process.env.CTLEMAIL}>`,
      to: `${receivingEmail}`,
      subject: `Miina Group Overdue Orders List`,
      text: `
  Hi Admin,

  Please note that the following orders are overdue by more than 7 days: 
 
  ${backOrderList}

  Could you please follow up with our suppliers and provide an update to our client?

  Kind Regards,
  The Miina Group Team
    `
    };

    // Send email
    await transporter.sendMail(message);

  } catch (err) {
    console.error("Error in sending notification:", err);
  }
};

module.exports = {
  managementApproval,
  newOrderRemind,
  sendInvoice,
  sendProformaInvoice,
  deliveryNotice,
  newUserNoticeToMiina,
  sendRequest,
  sendNotification
};
