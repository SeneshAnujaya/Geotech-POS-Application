import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
// import  pdfFonts from "pdfmake/build/vfs_fonts";
// import { pdfMake as pdfFonts } from "pdfmake/build/vfs_fonts";
import { showWarningToast, showErrorToast } from "./ToastNotification";
import { clearCart } from "../redux/cart/cartSlice";

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generatePDF = (
  cartItems,
  total,
  currentUserName,
  billingName,
  phoneNumber,
  dispatch = null,
  discount,
  grandTotal,
  paidAmount,
  invoiceNumber
) => {
  const currentDate = new Date().toLocaleDateString("en-GB");

  const tableBody = [
    [
      { text: "Code", style: "tableHeader" },
      { text: "Description", style: "tableHeader" },
      { text: "Warranty", style: "tableHeader" },
      { text: "Qty", style: "tableHeader" },
      { text: "Unit Price", style: "tableHeader" },
      { text: "Amount", style: "tableHeader" },
    ],
  ];

  // Populate table rows with cart items
  cartItems.forEach((item) => {
    tableBody.push([
      item.sku || "", // Handle potential undefined values
      item.name || "",
      item.warrantyPeriod,
      item.cartQuantity || 0,
      ` ${parseFloat(item.price || 0).toFixed(2)}`,
      ` ${(item.cartQuantity * parseFloat(item.price || 0)).toFixed(2)}`,
    ]);
  });

  const restBalance =
    paidAmount < grandTotal ? (grandTotal - paidAmount).toFixed(2) : null;

  const docDefinition = {
    content: [
      {
        columns: [
          {
            width: "50%",
            stack: [
              { text: "GEOTECH COMPUTERS", style: "header", alignment: "left" },
              {
                text: "Specialized in all types of desktop/laptop computer & accessories",
                style: "subheader",
                alignment: "left",
              },
              {
                text: "No11, New Shopping Complex, Wanduramba Galle. Tele: 074 1411556",
                style: "subheader",
                alignment: "left",
              },
            ],
            alignment: "left",
          },
          {
            width: "50%",
            stack: [
              { text: "INVOICE", style: "invoiceTitle", alignment: "right" },
              {
                text: [
                  { text: "Date: ", bold: true },
                  `${currentDate}\n`,
                  { text: "Invoice No: ", bold: true },
                  `${invoiceNumber ? invoiceNumber : "N/A"}\n`,
                  { text: "Sales Rep: ", bold: true },
                  `${currentUserName}\n`,
                ],
                alignment: "right",
              },
            ],
            alignment: "right",
          },
        ],
        columnGap: 10,
      },
      {
        text: `\n\nCustomer: ${billingName}`,
        style: "subheader",
        alignment: "left",
      },
      {
        text: `Telephone Number: ${phoneNumber ? phoneNumber : "N/A"}`,
        style: "subheader",
        alignment: "left",
        marginBottom: 8,
      },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto", "auto", "auto"],
          body: tableBody,
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 2 : 1; // Width for horizontal lines
          },
          vLineWidth: function (i, node) {
            return 1; // Width for vertical lines
          },
          hLineColor: function (i, node) {
            return "#000000"; // Color for horizontal lines
          },
          vLineColor: function (i, node) {
            return "#000000"; // Color for vertical lines
          },
          paddingLeft: function (i, node) {
            return 4;
          },
          paddingRight: function (i, node) {
            return 4;
          },
          paddingTop: function (i, node) {
            return 4;
          },
          paddingBottom: function (i, node) {
            return 4;
          },
        },
      },
      {
        columns: [
          {
            width: "70%",
            stack: [
              {
                text: "\nPlease submit the original invoice for warranty claims\nNo warranty for keyboards, mouse, ink cartridges, and other no-warranty items.\nNo warranty for burn marks, physical damages, corrosion, power fluctuation, and lightning.\n1 year warranty less than 14 working days (-350 days/2 years -700/3 years -1050 days).",
                style: "warranty",
              },
            ],
            alignment: "left",
          },

          {
            width: "30%",
            stack: [
              {
                text: `\n AMOUNT: LKR ${total}`,
                alignment: "right",
                bold: true,
              },
              {
                text: `DISCOUNT: LKR ${discount ? discount : "N/A"}`,
                alignment: "right",
                bold: true,
              },
              {
                text: `TOTAL: LKR ${grandTotal ? grandTotal : "0"}`,
                style: "total",
                alignment: "right",
                bold: true,
              },
              {
                text: `PAID: LKR ${paidAmount ? paidAmount : "0"}`,
                style: "total",
                alignment: "right",
                bold: true,
              },
              ...(restBalance
                ? [
                    {
                      text: `DUE: LKR ${restBalance}`,
                      alignment: "right",
                      bold: true,
                    },
                  ]
                : []),
            ],
            alignment: "right",
          },
        ],
        columnGap: 10,
      },

      {
        columns: [
          {
            width: "50%",
            stack: [
              {
                text: "----------------------",
                style: "line",
                alignment: "left",
                marginTop: 30,
                paddingTop: 0,
              },
              {
                text: "\n\nAuthorized By",
                style: "authorized",
                alignment: "left",
                marginTop: -20,
                paddingTop: 0,
              },
            ],
          },

          {
            width: "50%",
            stack: [
              {
                text: "----------------------",
                style: "right",
                alignment: "right",
                marginTop: 30,
                paddingTop: 0,
              },
              {
                text: "\n\nReceived By",
                style: "authorized",
                alignment: "right",
                marginTop: -20,
                paddingTop: 0,
              },
            ],
          },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        marginBottom: 4,
      },
      subheader: {
        fontSize: 12,
        alignment: "center",
        marginBottom: 4,
      },
      invoiceTitle: {
        fontSize: 16,
        bold: true,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        alignment: "center",
      },
      total: {
        fontSize: 14,
        bold: true,
      },
      warranty: {
        fontSize: 9,
        italics: true,
        alignment: "left",
      },
      authorized: {
        fontSize: 10,
        bold: true,
        marginTop: 0,
        paddingTop: 0,
      },
    },
  };

  pdfMake.createPdf(docDefinition).print();

  if (dispatch) {
    dispatch(clearCart());
  }

  return true;
};

export default generatePDF;
