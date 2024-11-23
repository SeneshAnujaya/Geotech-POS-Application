import React, { useEffect, useState } from "react";
import { showErrorToast } from "./ToastNotification";

const DuePayModal = ({ isOpen, onClose, saleDetails, onCreate }) => {
  const [formData, setFormData] = useState({
    payAmount: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const amountToPay = parseFloat(formData.payAmount);

    if (!formData.payAmount) {
      showErrorToast("Paid amount cannot be empty.");
      return;
    }

    // Check if the parsed amount is valid
    if (isNaN(amountToPay)) {
      showErrorToast("Paid amount must be a number.");
      return;
    }

    if (amountToPay > saleDetails.dueBalance) {
      showErrorToast("Paid amount exceeds remaining balance!.");
      return;
    }

    onCreate({
      saleId: saleDetails.saleId,
      bulkBuyerId: saleDetails.bulkBuyerId,
      payAmount: amountToPay,
    });
    onClose();
    setFormData({ payAmount: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-70 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-6 border border-slate-600 w-96 shadow-lg rounded-md bg-blue-950">
        <h1 className="text-2xl font-semibold text-slate-300">
          Pay Outstanding Amount
        </h1>
        <div className="mt-6 text-[1rem] leading-6">
          <p>Invoice Number: {saleDetails.invoiceNumber}</p>
          <p>Total Amount: LKR {saleDetails.totalAmount} </p>
          <p>Paid Amount: LKR {saleDetails.paidAmount} </p>
          <p>Total Due Balance: LKR {saleDetails.dueBalance} </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5">
          <label
            htmlFor="payAmount"
            className="block text-sm font-medium text-gray-300"
          >
            Pay Amount
          </label>
          <input
            type="number"
            name="payAmount"
            placeholder="pay Amount..."
            value={formData.value}
            className="block w-full mb-2 p-2 border-gray-600 border rounded-md text-gray-900"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="mt-6 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Pay Now
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-1 bg-red-700 text-white rounded hover:bg-red-800"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default DuePayModal;
