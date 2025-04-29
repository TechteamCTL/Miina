import React from "react";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const OrderToCtl = (invPrintData) => {
  const styles = StyleSheet.create({
    page: {
      padding: 50,
      paddingTop: 70,
    },
    pageNumbers: {
      position: "absolute",
      width: "50%",
      bottom: "5px",
      left: "50%",
      fontSize: 10,
    },
    container: {
      display: "flex",
      flexDirection: "row",
      width: "90%",
      marginBottom: 5,
    },
    image: {
      position: "absolute",
      top: 0,
      width: "45%",
    },

    table: {
      paddingLeft: 50,
      paddingRight: 50,
      paddingTop: 10,
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 0,
    },
    tableItem: {
      paddingLeft: 50,
      paddingBottom: 5,
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 0,
    },

    tableItemChunk: {
      paddingLeft: 50,
      paddingBottom: 5,
      paddingTop: 30,
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 0,
    },

    tableBorder: {
      display: "table",
      width: "95%",
      borderStyle: "solid",
      borderWidth: 1,
      borderTop: 0,
      borderRight: 0,
    },
    tableBorderBottom: {
      flexDirection: "row",
      display: "table",
      width: "40%",
      borderStyle: "solid",
      borderWidth: 1,
      marginLeft: "55%",
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
      height: "auto",
      width: "100%",
    },
    tableRow1: {
      margin: "auto",
      flexDirection: "row",
      height: "auto",
      backgroundColor: "#cccccc",
      width: "100%",
      borderBottomWidth: 1,
      borderTopWidth: 1,
    },
    tableRow2: {
      flexDirection: "row",
      height: "auto",
      width: "100%",
      borderBottom: 1,
    },
    tableRow3: {
      flexDirection: "row",
      height: "auto",
      width: "104%",
      borderBottom: 1,
      borderTopWidth: 1,
      borderRight: 1,
      marginLeft: -5,
      marginTop: 5,
      backgroundColor: "#cccccc",
    },
    tableRowProducts: {
      flexDirection: "row",
      height: "18px",
      width: "100%",
    },
    tableRowProducts1: {
      flexDirection: "row",
      height: "18px",
      width: "100%",
      backgroundColor: "#e6e6e6",
    },
    tableOrder: {
      padding: 10,
      marginLeft: 30,
      display: "table",
      width: "90%",
      borderStyle: "solid",
      borderWidth: 1,
    },
    tableColHeader1: {
      width: "40%",
      borderStyle: "solid",
      textAlign: "right",
      marginTop: 0,
      borderWidth: 0,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      fontSize: 10,
    },
    tableColHeader: {
      width: "20%",
      borderStyle: "solid",
      textAlign: "right",
      marginTop: 0,
      borderWidth: 0,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      fontSize: 10,
    },
    tableColImageHeader: {
      width: "50%",
      height: "80px",
      borderStyle: "solid",
      marginTop: 0,
      marginRight: 10,
      paddingRight: 10,
      borderWidth: 0,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      fontSize: 20,
    },
    tableColHeaderSideHead: {
      float: "left",
      width: "40%",
      borderStyle: "solid",
      borderRightWidth: 1,
      fontSize: 10,
      fontWeight: "bold",
      paddingLeft: 5,
    },
    tableColHeaderSide: {
      float: "left",
      width: "40%",
      borderStyle: "solid",
      borderRightWidth: 1,
      fontSize: 10,
      fontWeight: "bold",
      paddingLeft: 5,
      paddingBottom: 5,
      paddingTop: 5,
      textTransform: "uppercase",
    },
    tableColHeaderSide1: {
      float: "left",
      width: "30%",
      borderStyle: "solid",
      borderRightWidth: 1,
      fontSize: 10,
      fontWeight: "bold",
      paddingLeft: 5,
      paddingBottom: 5,
      paddingTop: 5,
    },
    tableColHeaderSideTotal: {
      float: "left",
      width: "20%",
      borderStyle: "solid",
      borderRightWidth: 1,
      fontSize: 10,
      fontWeight: "bold",
      paddingLeft: 5,
      paddingRight: 15,
    },
    tableColHeaderCenter: {
      float: "left",
      width: "60%",
      borderStyle: "solid",
      borderRightWidth: 1,
      fontSize: 10,
      fontWeight: "bold",
      paddingLeft: 0,
    },
    tableColHeaderShort: {
      float: "left",
      width: "12%",
      borderStyle: "solid",
      borderRightWidth: 1,
      fontSize: 10,
      fontWeight: "bold",
      paddingLeft: 0,
    },
    tableColHeaderMedium: {
      float: "left",
      width: "15%",
      borderStyle: "solid",
      borderRightWidth: 1,
      fontSize: 10,
      fontWeight: "bold",
      paddingLeft: 0,
    },

    tableColBill: {
      width: "100%",
      borderStyle: "solid",
      textAlign: "center",
      borderWidth: 0,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      fontSize: 10,
    },
    tableColBillItem: {
      borderStyle: "solid",
      borderWidth: 0,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      fontSize: 8,
      textAlign: "center",
      paddingTop: 5,
    },
    tableColBillItemRight: {
      borderStyle: "solid",
      borderWidth: 0,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      fontSize: 8,
      textAlign: "right",
      paddingTop: 5,
      paddingRight: 15,
    },
    tableColBillItemHeader: {
      borderStyle: "solid",
      borderWidth: 0,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      fontSize: 10,
      textAlign: "center",
      paddingTop: 5,
    },

    tableCellHeader: {
      width: "22%",
      paddingLeft: 5,
      fontSize: 10,
      borderRight: 1,
    },
    tableCellHeaderSide: {
      width: "22%",
      paddingLeft: 5,
      fontSize: 10,
      borderRight: 1,
    },

    tableCellBottom: {
      width: "30%",
      paddingLeft: 5,
      fontSize: 10,
      borderRight: 0,
    },
    tableCellHeaderSales: {
      width: "50%",
      paddingLeft: 5,
      fontSize: 10,
      borderRight: 0,
    },
    tableCellHeaderLeft: {
      width: "50%",
      paddingLeft: 5,
      fontSize: 10,
      borderRight: 1,
    },
    tableCellHeaderLeftBottom: {
      width: "75%",
      paddingLeft: 5,
      fontSize: 10,
      borderRight: 1,
    },
    tableCellBill: {
      paddingLeft: 5,
      marginTop: 0,
      fontSize: 10,
    },
    tableCellBillHeader: {
      paddingLeft: 0,
      marginTop: 10,
      fontSize: 20,
      color: "red",
    },
    tableCellBillBox: {
      paddingLeft: 5,
      marginTop: 5,
      fontSize: 10,
      height: "15px",
      textAlign: "center",
    },
    tableCellBillBoxExtra: {
      paddingLeft: 5,
      marginTop: 5,
      fontSize: 10,
      textAlign: "left",
    },
    tableCellBillBoxRight: {
      paddingLeft: 5,
      paddingRight: 25,
      marginTop: 5,
      fontSize: 10,
      height: "15px",
      textAlign: "right",
    },
    tableColOrderName: {
      width: "40%",
      borderStyle: "solid",
      borderWidth: 0,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColOrder: {
      width: "20%",
      borderStyle: "solid",
      borderBottomWidth: 1,
    },
    tableCellOrderName: {
      margin: "auto",
      marginTop: 5,
      fontSize: 10,
    },
    tableCellOrder: {
      margin: "auto",
      marginTop: 5,
      fontSize: 10,
    },
    tableCell7day: {
      margin: 5,
      justifyContent: "right",
    },
  });

  const InvinvPrintData = invPrintData.cartItems;
  const InvUserInfo = invPrintData.userInfo;
  const dueDays = invPrintData.dueDays;
  const deliverySite = invPrintData.selectedDeliverySite;
  const companyAccount = invPrintData.companyAccount;
  let counter = 0;

  const formatNumber = (number) =>
    new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);

  const rawTaxAmount = parseFloat(invPrintData?.taxAmount);
  const rawTotalAmount = parseFloat(invPrintData?.cartSubtotal);
  const netTotalAmountCalculation = rawTotalAmount - rawTaxAmount;
  const taxAmount = formatNumber(rawTaxAmount);
  const totalAmount = formatNumber(rawTotalAmount);
  const netTotalAmount = formatNumber(netTotalAmountCalculation);

  function splitArrayIntoChunks(arr, chunkSize) {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  function splitinvPrintData(InvinvPrintData) {
    const firstChunk = InvinvPrintData.slice(0, 15);
    const remainingItems = InvinvPrintData.slice(15);
    const chunks = splitArrayIntoChunks(remainingItems, 25);
    return [firstChunk, ...chunks];
  }

  const [firstItems, ...otherChunks] = splitinvPrintData(InvinvPrintData);

  const invPrintDate = new Date(invPrintData.invoiceDate).toLocaleString(
    "en-AU",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
  );

  const deliverDate = new Date(invPrintData.invoiceDate);
  deliverDate.setDate(deliverDate.getDate() + dueDays);

  const deliveryDate = new Date(deliverDate).toLocaleString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <Document id={invPrintData.invoiceNumber}>
      <Page style={styles.body} size="A4" orientation="landscape">
        {/* ******* header ******* */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColImageHeader}>
              <Image
                style={styles.image}
                src="/images/miina_logo.png"
              />
            </View>
            <View style={styles.tableColHeader}></View>
            <View style={styles.tableColHeader1}>
              <Text style={styles.tableCellBillHeader}>ORDER</Text>
              <Text style={styles.tableCellBill}>Miina Group</Text>
              <Text style={styles.tableCellBill}>
                E : Admin@miinagroup.com.au
              </Text>
              <Text style={styles.tableCellBill}>W : www.miinagroup.com.au</Text>
              <Text style={styles.tableCellBill}>ABN :  16 668 637 072</Text>
            </View>
          </View>
        </View>
        <br />
        {/* ******* header ******* */}
        <View style={styles.tableItem}>
          <View style={styles.tableBorder}>
            <View style={styles.tableRow1}>
              <View style={styles.tableColHeaderSideHead}>
                <Text>Order To :</Text>
              </View>
              <View style={styles.tableColHeaderCenter}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCellHeaderLeft}>
                    {/* <Text>Please Remit Payments To : </Text> */}
                  </View>
                  <View style={styles.tableCellHeaderSales}>
                    {/* <Text>Payment Terms :</Text> */}
                  </View>
                </View>
              </View>
              <View style={styles.tableColHeaderSideHead}>
                <Text>Delivered To :</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableColHeaderSide}>
                <Text style={styles.tableCellBill}>
                  {/* {deliverySite?.billingAddress.replaceAll(",", "\n")} */}
                  CTL Australia Pty Ltd
                </Text>
              </View>
              <View style={styles.tableColHeaderSide1}>
                {/* <Text>CTL Australia Pty Ltd</Text>
                <Text>BSB : 036-231</Text>
                <Text>ACC : 585602</Text>
                <Text>Westpac Bank</Text> */}
              </View>
              <View style={styles.tableColHeaderSide1}>
                <View style={styles.tableCellBillBox}>
                  {/* {<Text>3 Days from INV Date</Text>} */}
                </View>
                <View style={styles.tableRow3}>
                  {/* <Text> Dispatch From :</Text> */}
                </View>
                <View style={styles.tableCellBillBox}>
                  {/* <Text>Perth Warehouse</Text> */}
                </View>
              </View>
              <View style={styles.tableColHeaderSide}>
                <Text style={styles.tableCellBill}>{deliverySite?.name}</Text>
                <Text style={styles.tableCellBill}>
                  {deliverySite?.deliveryAddress.replaceAll(",", "\n")}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow1}>
              <View style={styles.tableCellHeaderSide}>
                <Text style={styles.tableColBill}>Account</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.tableColBill}>Invoice Number</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.tableColBill}>Invoice Date</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.tableColBill}>Due Date</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.tableColBill}>Purchase Order No.</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.tableColBill}>Page #</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCellHeaderSide}>
                <Text style={styles.tableCellBillBox}>{companyAccount}</Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.tableCellBillBox}>
                  {invPrintData.invoiceNumber}
                </Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.tableCellBillBox}>
                  {invPrintDate.split("at")[0]}
                </Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.tableCellBillBox}>
                  {deliveryDate === "Invalid Date"
                    ? "7 days"
                    : deliveryDate.split("at")[0]}
                </Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text style={styles.tableCellBillBox}>
                  {invPrintData.purchaseNumber}
                </Text>
              </View>
              <View style={styles.tableCellHeader}>
                <Text
                  style={styles.pageNumbers}
                  render={({ pageNumber, totalPages }) =>
                    `${pageNumber} / ${totalPages}`
                  }
                />
              </View>
            </View>
          </View>
        </View>
        {/* ******* Product List (first page) ******* */}
        <View style={styles.tableItem}>
          <View style={styles.tableBorder}>
            <View style={styles.tableRow1}>
              <View style={styles.tableColHeaderMedium}>
                <Text style={styles.tableColBillItemHeader}>Item Code</Text>
              </View>
              <View style={styles.tableColHeaderCenter}>
                <Text style={styles.tableColBillItemHeader}>
                  Item Description
                </Text>
              </View>
              <View style={styles.tableColHeaderShort}>
                <Text style={styles.tableColBillItemHeader}>Qty Order</Text>
              </View>
              <View style={styles.tableColHeaderShort}>
                <Text style={styles.tableColBillItemHeader}>Qty Supply</Text>
              </View>
              <View style={styles.tableColHeaderShort}>
                <Text style={styles.tableColBillItemHeader}>
                  Back Order
                </Text>
              </View>
              <View style={styles.tableColHeaderShort}>
                <Text style={styles.tableColBillItemHeader}>Unit Price</Text>
              </View>
              <View style={styles.tableColHeaderShort}>
                <Text style={styles.tableColBillItemHeader}>
                  {" "}
                  Net Amount{" "}
                </Text>
              </View>
              <View style={styles.tableColHeaderShort}>
                <Text style={styles.tableColBillItemHeader}>GST</Text>
              </View>
            </View>
            {firstItems.map((item, idx) => {
              return idx % 2 == 0 ? (
                <>
                  <View style={styles.tableRowProducts} key={idx}>
                    <View style={styles.tableColHeaderMedium}>
                      <Text style={styles.tableColBillItem}>
                        {item.cartProducts[0].suppliersku}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderCenter}>
                      <Text style={styles.tableColBillItem}>
                        {item.name.toUpperCase() +
                          ` (${item?.cartProducts[0].attrs})`}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItem}>
                        {item.cartProducts[0].quantity}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItem}>
                        {item.cartProducts[0].suppliedQty}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItem}>
                        {item.cartProducts[0].backOrder}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemRight}>
                        ${" "}
                        {item.cartProducts[0].price
                          ? item.cartProducts[0].price
                            .toFixed(2)
                            .toLocaleString()
                          : ""}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemRight}>
                        ${" "}
                        {item.cartProducts[0].price
                          ? (
                            item.cartProducts[0].price *
                            item.cartProducts[0].suppliedQty
                          )
                            .toFixed(2)
                            .toLocaleString()
                          : ""}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemRight}>10% </Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.tableRowProducts1} key={idx}>
                    <View style={styles.tableColHeaderMedium}>
                      <Text style={styles.tableColBillItem}>
                        {item.cartProducts[0].mnasku}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderCenter}>
                      <Text style={styles.tableColBillItem}>
                        {item.name.toUpperCase() +
                          ` (${item?.cartProducts[0].attrs})`}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItem}>
                        {item.cartProducts[0].quantity}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItem}>
                        {item.cartProducts[0].suppliedQty}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItem}>
                        {item.cartProducts[0].backOrder}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemRight}>
                        ${" "}
                        {item.cartProducts[0].price
                          ? item.cartProducts[0].price
                            .toFixed(2)
                            .toLocaleString()
                          : ""}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemRight}>
                        ${" "}
                        {item.cartProducts[0].price
                          ? (
                            item.cartProducts[0].price *
                            item.cartProducts[0].suppliedQty
                          )
                            .toFixed(2)
                            .toLocaleString()
                          : ""}
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemRight}>10% </Text>
                    </View>
                  </View>
                </>
              );
            })}
          </View>
        </View>
        <Text
          style={styles.pageNumbers}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />

        {/* bottom total price */}
        {otherChunks[0] ? (
          ""
        ) : (
          <>
            {" "}
            <View style={styles.tableBorderBottom}>
              <View style={styles.tableCellHeaderLeftBottom}>
                <Text style={styles.tableCellBillBox}>
                  Inv. Amount Excl. Tax
                </Text>
              </View>
              <View style={styles.tableCellBottom}>
                <Text style={styles.tableCellBillBoxRight}>
                  ${" "}
                  {Number.isNaN(rawTaxAmount) ||
                    rawTaxAmount === null ||
                    rawTaxAmount === undefined
                    ? formatNumber(
                      invPrintData.cartSubtotal / 1.1
                    ).toLocaleString()
                    : netTotalAmount}
                </Text>
              </View>
            </View>
            <View style={styles.tableBorderBottom}>
              <View style={styles.tableCellHeaderLeftBottom}>
                <Text style={styles.tableCellBillBox}>Total GST</Text>
              </View>
              <View style={styles.tableCellBottom}>
                <Text style={styles.tableCellBillBoxRight}>
                  ${" "}
                  {!Number.isNaN(rawTaxAmount) &&
                    rawTaxAmount !== null &&
                    rawTaxAmount !== undefined
                    ? taxAmount
                    : formatNumber(
                      (invPrintData.cartSubtotal / 1.1) * 0.1
                    ).toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={styles.tableBorderBottom}>
              <View style={styles.tableCellHeaderLeftBottom}>
                <Text style={styles.tableCellBillBox}>Invoice Amount</Text>
              </View>
              <View style={styles.tableCellBottom}>
                <Text style={styles.tableCellBillBoxRight}>
                  $ {totalAmount}
                </Text>
              </View>
            </View>
          </>
        )}
      </Page>

      {/* ******* Product List (other pages) ******* */}
      {otherChunks.map((chunk, index) => (
        <React.Fragment key={index}>
          {chunk.length > 0 && (
            <Page style={styles.body} size="A4" orientation="landscape">
              <View style={styles.tableItemChunk}>
                <View style={styles.tableBorder}>
                  <View style={styles.tableRow1}>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemHeader}>
                        Item Code
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderCenter}>
                      <Text style={styles.tableColBillItemHeader}>
                        Item Description
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemHeader}>
                        Qty Order
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemHeader}>
                        Qty Supply
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemHeader}>
                        Back Order
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemHeader}>
                        Unit Price
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemHeader}>
                        Net Amount
                      </Text>
                    </View>
                    <View style={styles.tableColHeaderShort}>
                      <Text style={styles.tableColBillItemHeader}>GST</Text>
                    </View>
                  </View>
                  {chunk.map((item, idx) => {
                    return idx % 2 == 0 ? (
                      <>
                        <View style={styles.tableRowProducts} key={idx}>
                          <View style={styles.tableColHeaderShort}>
                            <Text style={styles.tableColBillItem}>
                              {item.cartProducts[0].mnasku}
                            </Text>
                          </View>
                          <View style={styles.tableColHeaderCenter}>
                            <Text style={styles.tableColBillItem}>
                              {item.name.toUpperCase() +
                                ` (${item?.cartProducts[0].attrs})`}
                            </Text>
                          </View>
                          <View style={styles.tableColHeaderShort}>
                            <Text style={styles.tableColBillItem}>
                              {item.cartProducts[0].quantity}
                            </Text>
                          </View>
                          <View style={styles.tableColHeaderShort}>
                            <Text style={styles.tableColBillItem}>
                              {item.cartProducts[0].suppliedQty}
                            </Text>
                          </View>
                          <View style={styles.tableColHeaderShort}>
                            <Text style={styles.tableColBillItem}>
                              {item.cartProducts[0].backOrder}
                            </Text>
                          </View>
                          <View style={styles.tableColHeaderShort}>
                            <Text style={styles.tableColBillItemRight}>
                              ${" "}
                              {item.cartProducts[0].price
                                ? item.cartProducts[0].price
                                  .toFixed(2)
                                  .toLocaleString()
                                : ""}
                            </Text>
                          </View>
                          <View style={styles.tableColHeaderShort}>
                            <Text style={styles.tableColBillItemRight}>
                              ${" "}
                              {item.cartProducts[0].price
                                ? (
                                  item.cartProducts[0].price *
                                  item.cartProducts[0].suppliedQty
                                )
                                  .toFixed(2)
                                  .toLocaleString()
                                : ""}
                            </Text>
                          </View>
                          <View style={styles.tableColHeaderShort}>
                            <Text style={styles.tableColBillItemRight}>
                              10%{" "}
                            </Text>
                          </View>
                        </View>
                      </>
                    ) : (
                      <View style={styles.tableRowProducts1} key={idx}>
                        <View style={styles.tableColHeaderShort}>
                          <Text style={styles.tableColBillItem}>
                            {item.cartProducts[0].mnasku}
                          </Text>
                        </View>
                        <View style={styles.tableColHeaderCenter}>
                          <Text style={styles.tableColBillItem}>
                            {item.name.toUpperCase() +
                              ` (${item?.cartProducts[0].attrs})`}
                          </Text>
                        </View>
                        <View style={styles.tableColHeaderShort}>
                          <Text style={styles.tableColBillItem}>
                            {item.cartProducts[0].quantity}
                          </Text>
                        </View>
                        <View style={styles.tableColHeaderShort}>
                          <Text style={styles.tableColBillItem}>
                            {item.cartProducts[0].suppliedQty}
                          </Text>
                        </View>
                        <View style={styles.tableColHeaderShort}>
                          <Text style={styles.tableColBillItem}>
                            {item.cartProducts[0].backOrder}
                          </Text>
                        </View>
                        <View style={styles.tableColHeaderShort}>
                          <Text style={styles.tableColBillItemRight}>
                            ${" "}
                            {item.cartProducts[0].price
                              ? item.cartProducts[0].price
                                .toFixed(2)
                                .toLocaleString()
                              : ""}
                          </Text>
                        </View>
                        <View style={styles.tableColHeaderShort}>
                          <Text style={styles.tableColBillItemRight}>
                            ${" "}
                            {item.cartProducts[0].price
                              ? (
                                item.cartProducts[0].price *
                                item.cartProducts[0].suppliedQty
                              )
                                .toFixed(2)
                                .toLocaleString()
                              : ""}
                          </Text>
                        </View>
                        <View style={styles.tableColHeaderShort}>
                          <Text style={styles.tableColBillItemRight}>
                            10%{" "}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
              <Text
                style={styles.pageNumbers}
                render={({ pageNumber, totalPages }) =>
                  `${pageNumber} / ${totalPages}`
                }
              />

              {/* show total price in last page */}
              {index === otherChunks.length - 1 && (
                <>
                  <View style={styles.tableBorderBottom}>
                    <View style={styles.tableCellHeaderLeftBottom}>
                      <Text style={styles.tableCellBillBox}>
                        Inv. Amount Excl. Tax
                      </Text>
                    </View>
                    <View style={styles.tableCellBottom}>
                      <Text style={styles.tableCellBillBoxRight}>
                        ${" "}
                        {Number.isNaN(rawTaxAmount) ||
                          rawTaxAmount === null ||
                          rawTaxAmount === undefined
                          ? formatNumber(
                            invPrintData.cartSubtotal / 1.1
                          ).toLocaleString()
                          : netTotalAmount}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableBorderBottom}>
                    <View style={styles.tableCellHeaderLeftBottom}>
                      <Text style={styles.tableCellBillBox}>Total GST</Text>
                    </View>
                    <View style={styles.tableCellBottom}>
                      <Text style={styles.tableCellBillBoxRight}>
                        ${" "}
                        {!Number.isNaN(rawTaxAmount) &&
                          rawTaxAmount !== null &&
                          rawTaxAmount !== undefined
                          ? taxAmount
                          : formatNumber(
                            (invPrintData.cartSubtotal / 1.1) * 0.1
                          ).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tableBorderBottom}>
                    <View style={styles.tableCellHeaderLeftBottom}>
                      <Text style={styles.tableCellBillBox}>
                        Invoice Amount
                      </Text>
                    </View>
                    <View style={styles.tableCellBottom}>
                      <Text style={styles.tableCellBillBoxRight}>
                        ${" "}
                        {totalAmount}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </Page>
          )}
        </React.Fragment>
      ))}
    </Document>
  );
};

export default OrderToCtl;
