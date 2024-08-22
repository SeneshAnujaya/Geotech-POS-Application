import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ToastNotification from "./components/ToastNotification";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";
import Products from "./pages/Products";

const App = () => {
  return (
    <BrowserRouter>
      <ToastNotification />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/categories" element={<Category/>}/>
          <Route path="/products" element={<Products/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
