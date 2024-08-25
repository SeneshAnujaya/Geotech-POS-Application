import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/categories/categorySlice";
import { fetchProducts } from "../redux/products/productsSlice";
import {
  MinusIcon,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import {
  showErrorToast,
  showSuccessToast,
} from "../components/ToastNotification";
import axios from "axios";
import MouseImage from "../assets/mouse.jpg";

const Orders = () => {
  // const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    categories,
    loading: categoryLoading,
    error,
  } = useSelector((state) => state.categories);

  const { products, loading: productLoading } = useSelector(
    (state) => state.products
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) => product.categoryId === selectedCategory.categoryId
      )
    : products;

  console.log(filteredProducts);
  

  return (
    <MainLayout>
      <div className="px-0 md:px-8 py-4 flex gap-4 rounded-md">
        {/* Menu items side */}
        <div className="w-3/4 border border-slate-700 rounded-md bg-slate-900 p-4">
          <div className="flex justify-between py-2">
            <div className=" items-center mb-6">
              <h1 className="text-3xl font-semibold">Orders</h1>
            </div>
            {/* Search bar side */}
            <div className="relative">
              <input
                type="search"
                placeholder="Start type to search"
                className="pl-10 pr-4 py-2 w-50 md:w-80 border border-slate-600 bg-slate-800 rounded-lg focus:outline-none focus:border-blue-500 "
              />
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex  pointer-events-none">
                <Search className="text-gray-500" size={20} />
              </div>
            </div>
          </div>
          {/* Bottom list wrap */}
          <div className="">
            <h4 className="text-base font-normal text-slate-300 mt-2">
              Menu Items {filteredProducts.length}
            </h4>
            <div className="flex flex-wrap gap-2 items-center mt-3">
              <div
                className={`leading-none py-2 px-4 rounded-full hover:cursor-pointer ${
                  !selectedCategory
                    ? "bg-blue-600"
                    : "bg-slate-900 border-slate-600 border"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </div>
              {categoryLoading ? (
                <div>Loading...</div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.categoryId}
                    className={`leading-none   py-2 px-3 rounded-full text-base hover:cursor-pointer ${
                      selectedCategory &&
                      selectedCategory.categoryId === category.categoryId
                        ? "bg-blue-600"
                        : "bg-slate-900 border-slate-600 border"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.name}
                  </div>
                ))
              )}
            </div>
  

  

            {/* Thinks about use flex and wrap can give card a minum width */}
            <div className="flex flex-wrap  gap-4 mt-6">
              {productLoading ? (
                <div className="mt-3 mb-2">Loading products...</div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.sku}
                    className="border bg-slate-900 border-slate-700 rounded-md p-4 w-100 max-w-56 flex flex-col justify-between"
                  >
                    <img
                      src={MouseImage}
                      alt="product-pic"
                      className="w-100 h-100 rounded"
                    />
                    <h4 className="font-medium mt-2 leading-5">
                      {product.name}
                    </h4>
                    <div className="flex gap-5 justify-between mt-2">
                      <p className="text-slate-300 text-[0.95rem]">
                        {product.category.name}
                      </p>
                      <p className="text-slate-300 text-[0.95rem]">
                        LKR {parseFloat(product.retailPrice).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex mt-6 justify-between">
                      <span className="bg-slate-700 p-[6px] rounded-md">
                        <ShoppingCart className="w-4 h-4" />
                      </span>
                      {/* <div className=" flex items-center gap-3 px-2   rounded-md">
                        <span className="bg-slate-900 border border-slate-500 rounded-md p-[2px] hover:bg-blue-600 hover:border-blue-600">
                          <MinusIcon className="w-5 h-5 text-slate-100" />
                        </span>
                        <p>1</p>
                        <span className="border border-slate-500  rounded-md p-[2px] hover:bg-blue-600  hover:border-blue-600">
                          <Plus className="w-5 h-5 text-slate-100" />
                        </span>
                      </div> */}
                      <p className="leading-none text-[0.8rem] font-normal  flex items-center text-white bg-green-700 px-2 rounded-full">{product.quantity} Stock</p>
                    </div>
                  </div>
                  
                ))
              )}
           
              
            </div>
          </div>
        </div>
        {/* cart side */}
        <div className="w-1/4  border border-slate-700 rounded-md bg-slate-900 p-4">
          <h4 className="font-medium text-lg ">Order Detail</h4>
          {/*Cart items container*/}
          <div className="mt-2 flex justify-between items-center flex-wrap">
            <p className="text-[0.95rem] text-slate-300">
              {" "}
              Total items <span className="text-slate-200">(5)</span>{" "}
            </p>
            <p className="text-[0.9rem] text-white bg-red-500 px-2 rounded-full">
              Clear All
            </p>
          </div>

          <div className="border mt-4 border-slate-700 rounded-md bg-slate-900 p-2 w-full">
            <div className="flex items-center gap-2 w-full">
              <div className="">
              <img
                src={MouseImage}
                alt="product-pic"
                className="w-24 h-auto rounded-md"
              />
              </div>
              <div className="w-full p-1">
                <div className="flex justify-between min-w-full">
                  <p>
                    <h4 className="text-[0.9rem] text-slate-200">
                      Wireless Gaming Mouse
                    </h4>
                    <p className="text-[0.9rem] text-slate-300 mt-1">LKR 3000.00</p>
                  </p>
                  <div className="bg-slate-700 h-8 p-2 rounded-full">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </div>
                </div>
                <div className="flex items-center justify-end w-full flex-wrap mt-2">
                  <div className=" flex items-center gap-3 rounded-md">
                    <span className="bg-slate-900 border border-slate-500 rounded-md p-[1px] hover:bg-blue-600 hover:border-blue-600">
                      <MinusIcon className="w-4 h-4 text-slate-200" />
                    </span>
                    <p>1</p>
                    <span className="border border-slate-500  rounded-md p-[1px] hover:bg-blue-600  hover:border-blue-600">
                      <Plus className="w-4 h-4 text-slate-200" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Header bar */}
      </div>
    </MainLayout>
  );
};

export default Orders;
