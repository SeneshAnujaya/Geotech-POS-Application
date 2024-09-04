import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ToastNotification from "./components/ToastNotification";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Sales from "./pages/Sales";

const App = () => {
  return (
    <BrowserRouter>
      <ToastNotification />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/orders" element={<Orders/>}/>
          <Route path="/categories" element={<Category/>}/>
          <Route path="/products" element={<Products/>}/>
          <Route path="/sales" element={<Sales/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
