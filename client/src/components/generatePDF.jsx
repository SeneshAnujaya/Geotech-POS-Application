import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { showWarningToast, showErrorToast } from "./ToastNotification";
import { clearCart } from "../redux/cart/cartSlice";



pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generatePDF = (cartItems, subtotal, total, currentUserName, billingName, dispatch, setBillingName) => {



  const currentDate = new Date().toLocaleDateString('en-GB');

  const tableBody = [
    [
      { text: 'Code', style: 'tableHeader' },
      { text: 'Description', style: 'tableHeader' },
      { text: 'Warranty', style: 'tableHeader' },
      { text: 'Qty', style: 'tableHeader' },
      { text: 'Unit Price', style: 'tableHeader' },
      { text: 'Amount', style: 'tableHeader' }
    ]
  ];

  // Populate table rows with cart items
  cartItems.forEach(item => {
    tableBody.push([
      item.sku || '', // Handle potential undefined values
      item.name || '',
      item.warrantyPeriod, 
      item.cartQuantity || 0,
      ` ${parseFloat(item.retailPrice || 0).toFixed(2)}`,
      ` ${(item.cartQuantity * parseFloat(item.retailPrice || 0)).toFixed(2)}`
    ]);
  });

  const docDefinition = {
    content: [
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: "GEOTECH", style: "header", alignment: "left" },
              { text: "Specialized in all types of desktop/laptop computer & accessories", style: "subheader", alignment: "left"  },
              { text: "No11, New Shopping Complex, Wanduramba Galle. Tele: 074 1411556", style: "subheader", alignment:"left" }
            ],
            alignment: "left"
          },
          {
            width: '50%',
            stack: [
              { text: 'INVOICE', style: 'invoiceTitle', alignment: 'right' },
              {
                text: [
                  { text: 'Date: ', bold: true },
                  `${currentDate}\n`,
                  { text: 'Invoice No: ', bold: true },
                  'UN00036563\n',
                  { text: 'Sales Rep: ', bold: true },
                  `${currentUserName}\n`,
                ],
                alignment: 'right',
              },
            ],
            alignment: 'right'
          }
        ],
        columnGap: 10 // Add some space between the columns
      },
      {
        text: `\n\nCustomer: ${billingName}`,
        style: 'subheader',
        alignment: "left"
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
          body: tableBody
        },
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 2 : 1;  // Width for horizontal lines
          },
          vLineWidth: function (i, node) {
            return 1;  // Width for vertical lines
          },
          hLineColor: function (i, node) {
            return '#000000';  // Color for horizontal lines
          },
          vLineColor: function (i, node) {
            return '#000000';  // Color for vertical lines
          },
          paddingLeft: function (i, node) { return 4; },  // Padding for left side of the cell
          paddingRight: function (i, node) { return 4; },  // Padding for right side of the cell
          paddingTop: function (i, node) { return 4; },  // Padding for top of the cell
          paddingBottom: function (i, node) { return 4; }  // Padding for bottom of the cell
        },
      },
      // Subtotal and Total
      { text: `\nDiscount: N/A`, alignment:"right", bold: true},
      {
        text: `Total: ${total}`,
        style: 'total',
        alignment: 'right',
      },
     
      {
        text: '\nWarranty period less 14 working days.\n No warranty for key boards, mouse, speakers, ink Cartridge.\nNo warranty for burn marks, physical damages and corrosion.',
        style: 'warranty',
      },
      {
        text: '--------------------',
        style: 'line',
        alignment: 'right',
        marginTop: 0, // Reduces top margin
        paddingTop: 0 
      },
      {
        text: '\n\nAuthorized By',
        style: 'authorized',
        alignment: 'right',
        marginTop: -20, // Reduces top margin
        paddingTop: 0 
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        marginBottom: 4
      },
      subheader: {
        fontSize: 12,
        alignment: 'center',
        marginBottom: 4
      },
      invoiceTitle: {
        fontSize: 16,
        bold: true,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        alignment: 'center',
      },
      total: {
        fontSize: 14,
        bold: true,
      },
      warranty: {
        fontSize: 9,
        italics: true,
        alignment: 'left',
      },
      authorized: {
        fontSize: 10,
        bold: true,
        marginTop: 0,
        paddingTop: 0
      },
    },
  };

  pdfMake.createPdf(docDefinition).print(); // Open print dialog

  dispatch(clearCart());
  setBillingName('');

  return true;

};

export default generatePDF;
