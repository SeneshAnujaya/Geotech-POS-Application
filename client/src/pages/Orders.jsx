import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/categories/categorySlice";
import { MinusIcon, MinusSquare, Plus, PlusCircleIcon, Search, ShoppingBag, ShoppingBasket, ShoppingBasketIcon, ShoppingCart } from "lucide-react";
import CategoryModal from "../components/CategoryModal";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/ToastNotification";
import axios from "axios";
import MouseImage from '../assets/mouse.jpg';

const Orders = () => {
  // const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="px-0 md:px-8 py-4 flex flex-col  rounded-md">
        {/* Menu items side */}
        <div className="w-3/4 border border-slate-700 rounded-md bg-slate-800 p-4">
        <div className="flex justify-between py-2">
          <div className=" items-center mb-6">
            <h1 className="text-3xl font-semibold">Orders</h1>
            {/* <h4 className="text-base font-normal text-slate-300 mt-2">Menu Items (25)</h4> */}
          </div>
          {/* Search bar side */}
          <div className='relative'>
            <input type='search' placeholder='Start type to search' className='pl-10 pr-4 py-2 w-50 md:w-80 border border-slate-600 bg-slate-800 rounded-lg focus:outline-none focus:border-blue-500 '/>
            <div className='absolute inset-y-0 left-0 pl-3 pt-3 flex  pointer-events-none'>
                <Search className='text-gray-500' size={20}/>
            </div>
        </div>
        </div>
        {/* Bottom list wrap */}
        <div className="">
        <h4 className="text-base font-normal text-slate-300 mt-2">Menu Items (25)</h4>
        <div className="flex gap-2 items-center mt-3">
          <div className="leading-none border border-blue-600  py-2 px-3 rounded-full text-base bg-blue-600">Mouse</div>
          <div className="leading-none border border-slate-600 bg-slate-900 py-2 px-3 rounded-full">Keyboard</div>
          <div className="leading-none border border-slate-600 bg-slate-900 py-2 px-3 rounded-full">VGA Card</div>
        </div>
        {/* Thinks about use flex and wrap can give card a minum width */}
        <div className="flex flex-wrap  gap-4 mt-6">
          <div className="border bg-slate-900 border-slate-700 rounded-md p-4 w-100 max-w-60">
            <img src={MouseImage} alt="product-pic"  className="w-100 h-100 rounded"/>
            <h4 className="font-medium mt-2">Razor gaming Mouse</h4>
            <div className="flex gap-5 justify-between mt-2">
            <p className="text-slate-300 text-[0.95rem]">Mouse</p>
            <p className="text-slate-300 text-[0.95rem]">LKR 2500.00</p>
          
            </div>
            <div className="flex mt-6 justify-between">
              <span className="bg-slate-700 p-2 rounded-md">
                <ShoppingCart className="w-5 h-5"/>
              </span>
              <div className=" flex items-center gap-3 px-2   rounded-md">
                <span className="bg-slate-900 border border-slate-500 rounded-md p-[2px] hover:bg-blue-600 hover:border-blue-600">
                <MinusIcon className="w-5 h-5 text-slate-100"/>
                </span>
                <p>1</p>
                <span className="border border-slate-500  rounded-md p-[2px] hover:bg-blue-600  hover:border-blue-600">
                <Plus className="w-5 h-5 text-slate-100"/>
                </span>
              </div>
            </div>
           
          </div>
         {/* --------------- */}
         <div className="border bg-slate-900 border-slate-700 rounded-md p-4 w-100 max-w-60">
            <img src={MouseImage} alt="product-pic"  className=" rounded"/>
            <h4 className="font-medium mt-2">Razor gaming Mouse</h4>
            <div className="flex gap-5 justify-between mt-2">
            <p className="text-slate-300 text-[0.95rem]">Mouse</p>
            <p className="text-slate-300 text-[0.95rem]">LKR 2500.00</p>
          
            </div>
            <div className="flex mt-6 justify-between">
              <span className="bg-slate-700 p-2 rounded-md">
                <ShoppingCart className="w-5 h-5"/>
              </span>
              <div className=" flex items-center gap-3 px-2   rounded-md">
                <span className="bg-slate-900 border border-slate-500 rounded-md p-[2px] hover:bg-blue-600 hover:border-blue-600">
                <MinusIcon className="w-5 h-5 text-slate-100"/>
                </span>
                <p>1</p>
                <span className="border border-slate-500  rounded-md p-[2px] hover:bg-blue-600  hover:border-blue-600">
                <Plus className="w-5 h-5 text-slate-100"/>
                </span>
              </div>
            </div>
           
          </div>
         {/* --------------- */}
         <div className="border bg-slate-900 border-slate-700 rounded-md p-4 w-100 max-w-60">
            <img src={MouseImage} alt="product-pic"  className="w-100 h-100 rounded"/>
            <h4 className="font-medium mt-2">Razor gaming Mouse</h4>
            <div className="flex gap-5 justify-between mt-2">
            <p className="text-slate-300 text-[0.95rem]">Mouse</p>
            <p className="text-slate-300 text-[0.95rem]">LKR 2500.00</p>
          
            </div>
            <div className="flex mt-6 justify-between">
              <span className="bg-slate-700 p-2 rounded-md">
                <ShoppingCart className="w-5 h-5"/>
              </span>
              <div className=" flex items-center gap-3 px-2   rounded-md">
                <span className="bg-slate-900 border border-slate-500 rounded-md p-[2px] hover:bg-blue-600 hover:border-blue-600">
                <MinusIcon className="w-5 h-5 text-slate-100"/>
                </span>
                <p>1</p>
                <span className="border border-slate-500  rounded-md p-[2px] hover:bg-blue-600  hover:border-blue-600">
                <Plus className="w-5 h-5 text-slate-100"/>
                </span>
              </div>
            </div>
           
          </div>
         {/* --------------- */}
         <div className="border bg-slate-900 border-slate-700 rounded-md p-4 w-100 max-w-60">
            <img src={MouseImage} alt="product-pic"  className="w-100 h-100 rounded"/>
            <h4 className="font-medium mt-2">Razor gaming Mouse</h4>
            <div className="flex gap-5 justify-between mt-2">
            <p className="text-slate-300 text-[0.95rem]">Mouse</p>
            <p className="text-slate-300 text-[0.95rem]">LKR 2500.00</p>
          
            </div>
            <div className="flex mt-6 justify-between">
              <span className="bg-slate-700 p-2 rounded-md">
                <ShoppingCart className="w-5 h-5"/>
              </span>
              <div className=" flex items-center gap-3 px-2   rounded-md">
                <span className="bg-slate-900 border border-slate-500 rounded-md p-[2px] hover:bg-blue-600 hover:border-blue-600">
                <MinusIcon className="w-5 h-5 text-slate-100"/>
                </span>
                <p>1</p>
                <span className="border border-slate-500  rounded-md p-[2px] hover:bg-blue-600  hover:border-blue-600">
                <Plus className="w-5 h-5 text-slate-100"/>
                </span>
              </div>
            </div>
           
          </div>
         {/* --------------- */}
         <div className="border bg-slate-900 border-slate-700 rounded-md p-4 w-100 max-w-60">
            <img src={MouseImage} alt="product-pic"  className="w-100 h-100 rounded"/>
            <h4 className="font-medium mt-2">Razor gaming Mouse</h4>
            <div className="flex gap-5 justify-between mt-2">
            <p className="text-slate-300 text-[0.95rem]">Mouse</p>
            <p className="text-slate-300 text-[0.95rem]">LKR 2500.00</p>
          
            </div>
            <div className="flex mt-6 justify-between">
              <span className="bg-slate-700 p-2 rounded-md">
                <ShoppingCart className="w-5 h-5"/>
              </span>
              <div className=" flex items-center gap-3 px-2   rounded-md">
                <span className="bg-slate-900 border border-slate-500 rounded-md p-[2px] hover:bg-blue-600 hover:border-blue-600">
                <MinusIcon className="w-5 h-5 text-slate-100"/>
                </span>
                <p>1</p>
                <span className="border border-slate-500  rounded-md p-[2px] hover:bg-blue-600  hover:border-blue-600">
                <Plus className="w-5 h-5 text-slate-100"/>
                </span>
              </div>
            </div>
           
          </div>
         {/* --------------- */}
         <div className="border bg-slate-900 border-slate-700 rounded-md p-4 w-100 max-w-60">
            <img src={MouseImage} alt="product-pic"  className="w-100 h-100 rounded"/>
            <h4 className="font-medium mt-2">Razor gaming Mouse</h4>
            <div className="flex gap-5 justify-between mt-2">
            <p className="text-slate-300 text-[0.95rem]">Mouse</p>
            <p className="text-slate-300 text-[0.95rem]">LKR 2500.00</p>
          
            </div>
            <div className="flex mt-6 justify-between">
              <span className="bg-slate-700 p-2 rounded-md">
                <ShoppingCart className="w-5 h-5"/>
              </span>
              <div className=" flex items-center gap-3 px-2   rounded-md">
                <span className="bg-slate-900 border border-slate-500 rounded-md p-[2px] hover:bg-blue-600 hover:border-blue-600">
                <MinusIcon className="w-5 h-5 text-slate-100"/>
                </span>
                <p>1</p>
                <span className="border border-slate-500  rounded-md p-[2px] hover:bg-blue-600  hover:border-blue-600">
                <Plus className="w-5 h-5 text-slate-100"/>
                </span>
              </div>
            </div>
           
          </div>
         {/* --------------- */}
        </div>
        </div>

       
        </div>
        {/* cart side */}

        {/* Header bar */}
      </div>
    </MainLayout>
  );
};

export default Orders;
