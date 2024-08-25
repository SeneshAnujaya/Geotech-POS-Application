import { Archive,  BoxIcon,  BoxSelect,  BoxSelectIcon,  Clipboard,  ClipboardCheckIcon,  ClipboardList,  Icon,Menu, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setIsSidebarCollapsed } from "../redux/uiSetting/uiSettingsSlice";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SidebarLink = ({href, icon: Icon, label, isCollapsed}) => {
  const { pathname } = useLocation();
  const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link to={href}>
      <div className={`cursor-pointer flex items-center ${isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"} hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${isActive ? "bg-blue-900 text-white":"text-white"}`}>
        <Icon  className={`w-6 h-6`} />
        <span className={`${isCollapsed ? "hidden" : "block"} font-medium text-gray-300`}>{label}</span>
      </div>
    </Link>
  );
}


const Sidebar = () => {

  const { isSidebarCollapsed } = useSelector((state) => state.uisetting);
  
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  }

  const sidebarClassNames = `fixed flex flex-col ${isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:64"} bg-slate-900 transition-all duration-300 overflow-hidden h-full shadow-md z-40 border-r border-slate-700`;

  return (
    <div className={sidebarClassNames}>
        <div className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${isSidebarCollapsed ? "px-5" : "px-8"}`}>
            <div>logo</div>
            <h1 className={`${isSidebarCollapsed ? "hidden":"block"} font-semibold text-2xl`}>GEOTECH</h1>
            <button className="md:hidden px-3 py-3 bg-gray-600 rounded-full hover:bg-blue-100" onClick={toggleSidebar}>
                <Menu className="w-4 h-4"/>
            </button>
        </div>

        {/* links */}
        <div className="flex-grow mt-8">
          <SidebarLink href="/" icon={Archive} label="Dashboard" isCollapsed={isSidebarCollapsed}/>
          <SidebarLink href="/orders" icon={ShoppingBag} label="Orders" isCollapsed={isSidebarCollapsed}/>
          <SidebarLink href="/categories" icon={ClipboardList} label="Categories" isCollapsed={isSidebarCollapsed}/>
          <SidebarLink href="/products" icon={BoxIcon} label="Products" isCollapsed={isSidebarCollapsed}/>
        </div>

        {/* footer */}
        <div className={`${isSidebarCollapsed ? "hidden": "block"} mb-10`}>
            <p className="text-center text-xs text-gray-400">&copy; 2024 GEOTECH</p>
        </div>
    </div>
  )
}

export default Sidebar