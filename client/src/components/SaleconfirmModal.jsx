import React, { useEffect, useState } from "react";
import { showErrorToast } from "./ToastNotification";
import { useDispatch, useSelector } from "react-redux";
import { fetchWholesaleClients } from "../redux/wholesaleclients/wholesaleclientSlice";

const SaleconfirmModal = ({ isOpen, onClose, onCreate, isBulkBuyer, total }) => {
  

  const { wholesaleClients, loading, error } = useSelector((state) => state.wholesaleClients);
  
  const dispatch = useDispatch();

  useEffect(() => {
    isBulkBuyer ? dispatch(fetchWholesaleClients()) : "";
  }, [dispatch]);

  
 
  const [grandTotal, setGrandTotal ] = useState(total);

  const [formData, setFormData] = useState({
    clientName: '',
    phonenumber: '',
    discount: 0,
    paidAmount: isBulkBuyer ? 0 : grandTotal,
    selectedClientId: null,
  });



  useEffect(() => {
    const newTotal = (total - formData.discount).toFixed(2);
    const updatedGrandTotal = newTotal >= 0 ? parseFloat(newTotal) : 0;
    setGrandTotal(updatedGrandTotal);

  }, [formData.discount, total, isBulkBuyer]);

  useEffect(() => {
    if(isBulkBuyer) {
      setFormData((prevData) => ({...prevData, paidAmount : 0}));
    } else {
      setFormData((prevData) => ({...prevData, paidAmount: grandTotal}));
    }
  }, [isBulkBuyer, grandTotal,total])

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.phonenumber) {
   
      showErrorToast("Please fill in all required fields.");
      return;
    }

      // Validate select box when the sale is for a bulk buyer
  if (isBulkBuyer && !formData.selectedClientId) {
    showErrorToast("Please select a registered customer.");
    return;
  }
    
  if (isBulkBuyer && formData.paidAmount > grandTotal) {
    showErrorToast("Paid amount cannot exceed the total.");
    return;
  }

  if (formData.discount > total) {
    showErrorToast("Discount cannot exceed the total amount.");
    return;
  }


    const dataToSubmit = { ...formData, grandTotal, selectedClientId: isBulkBuyer ? formData.selectedClientId : null,  };
    
    onCreate(dataToSubmit);
    onClose();

    setFormData({
      clientName: '',
      phonenumber: '',
      discount: 0,
      paidAmount: isBulkBuyer ? 0 : total, // Reset to default based on isBulkBuyer
      selectedClientId: null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClientSelectChange = (e) => {
    const selectedClientId = e.target.value;
    setFormData({
      ...formData,
      selectedClientId, 
    });
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-70 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-7 border border-slate-600  max-w-md shadow-lg rounded-md bg-blue-950">
        <h1 className="text-2xl font-semibold text-slate-300">
          Order Information
        </h1>

        <form onSubmit={handleSubmit} className="mt-5">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Customer Name
          </label>
          <input
            type="text"
            name="clientName"
            placeholder="Customer Name..."
            value={formData.clientName}
            className="block w-full mb-2 p-2 border-gray-600 border rounded-md text-gray-900" 
            onChange={handleChange}
          
          />
          <label
            htmlFor="phonenumber"
            className="block text-sm font-medium text-gray-300"
          >
            Phone Number
          </label>
          <input
            type="text"
            name="phonenumber"
            placeholder="Phone Number..."
            value={formData.phonenumber}
            className="block w-full mb-2 p-2 border-gray-600 border rounded-md text-gray-900"
            onChange={handleChange}
          
          />

          {isBulkBuyer && (
            <>
             <label
             htmlFor="wholesaleClient"
             className="block text-sm font-medium text-gray-300"
           >
             Select Registered Customer
           </label>
           <select className="w-full p-2 rounded-md text-slate-800" onChange={handleClientSelectChange} >
            <option value="">Select a client...</option>
            {wholesaleClients.map((client) => {
              return  <option key={client.bulkBuyerId} value={client.bulkBuyerId}>{client.companyName}</option>
            })}
            
           </select>
           </>
          )}
         

          <label
            htmlFor="discount"
            className="block text-sm font-medium text-gray-300 mt-2"
          >
            Discount
          </label>
          <input
            type="number"
            name="discount"
            placeholder="Enter Discount..."
            value={formData.discount}
            className="block w-full mb-2 p-2 border-gray-600 border rounded-md text-gray-900"
            onChange={handleChange}
            min="0"
          
          />

{ isBulkBuyer && (
  <>
          <label
            htmlFor="paidAmount"
            className="block text-sm font-medium text-gray-300 mt-2"
          >
            Paid Amount
          </label>
          <input
            type="number"
            name="paidAmount"
            placeholder="Enter Paid Amount..."
            value={formData.paidAmount}
            className="block w-full mb-2 p-2 border-gray-600 border rounded-md text-gray-900"
            onChange={handleChange}
           
          />
          </>
          ) 
}

          <p className="text-[0.95rem] text-slate-200 font-semibold mt-6">
            Payment Summary
          </p>
          <div className="flex justify-between items-center gap-2 mt-2">
            <p className="text-slate-300 text-[0.95rem]">Discount</p>
            <p className="text-slate-300 text-[0.95rem]">{formData.discount ? formData.discount : 0.00 }</p>
          </div>
          { isBulkBuyer && (
          
          <div className="flex justify-between items-center gap-2 mt-2">
            <p className="text-slate-300 text-[0.95rem]">Paid Amount</p>
            <p className="text-slate-300 text-[0.95rem]">{formData.paidAmount ? formData.paidAmount : 0.00 }</p>
           
            
          
          </div>
          )
}
          <div className="w-full h-px bg-slate-700 mt-3 mb-2"></div>
          <div className="flex justify-between items-center gap-2 mt-2">
            <p className="text-slate-200 font-semibold text-[1.05rem]">Total</p>
            <p className="text-slate-200 font-semibold text-[1.1rem]">LKR {grandTotal.toFixed(2)}</p>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full mt-2 py-2 px-2 bg-blue-600 text-white rounded hover:bg-green-700"
            >
              Print Invoice
            </button>
            <button
              onClick={onClose}
              type="button"
              className=" w-full mt-3 py-2 px-2 bg-transparent border border-slate-600 text-white rounded hover:bg-red-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleconfirmModal;
