import { ThemeProvider, createTheme } from '@mui/material/styles';

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
import Users from './pages/Users';

const theme = createTheme({
  palette: {
    mode: 'dark', // Set the theme to dark mode
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
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
          <Route path="/users" element={<Users/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
