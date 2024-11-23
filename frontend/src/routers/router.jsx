import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import CategoryPage from "../pages/category/CategoryPage";
import Search from "../pages/search/Search";
import ShopPage from "../pages/shop/ShopPage";
import SingleProduct from "../pages/shop/productDetails/SingleProduct";
import Login from "../components/Login";
import Register from "../components/Register";
import ForgotPass from "../components/ForgotPass";
import PaymentSuccess from "../components/PaymentSuccess";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import UserDMain from "../pages/dashboard/user/dashboard/UserDMain";
import UserOrders from "../pages/dashboard/user/UserOrders";
import OrderDetails from "../pages/dashboard/user/OrderDetails";
import UserPayments from "../pages/dashboard/user/UserPayments";
import UserReviews from "../pages/dashboard/user/UserReviews";
import UserProfile from "../pages/dashboard/user/UserProfile";
import AdminDMain from "../pages/dashboard/admin/dashboard/AdminDMain";
import AddProduct from "../pages/dashboard/admin/addProduct/AddProduct";
import ManageProduct from "../pages/dashboard/admin/manageProduct/ManageProduct";
import UpdateProduct from "../pages/dashboard/admin/manageProduct/UpdateProduct";
import ManageUser from "../pages/dashboard/admin/users/ManageUser";
import ManageOrders from "../pages/dashboard/admin/manageOrders/ManageOrders";
import Aboutpage from "../pages/about/About";
import Contactpage from "../pages/contact/Contact";
import AddCategory from "../pages/dashboard/admin/addProduct/AddCategory";
import ManageCategory from "../pages/dashboard/admin/manageProduct/ManageCategory";
import UpdateCategory from "../pages/dashboard/admin/manageProduct/UpdateCategory";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/categories/:categoryName", element: <CategoryPage /> },
            { path: "/about", element: <Aboutpage /> },
            { path: "/contact", element: <Contactpage /> },
            { path: "/search", element: <Search /> },
            { path: "/shop", element: <ShopPage /> },
            { path: "/shop/:id", element: <SingleProduct /> },
            {
                path: "/success",
                element: <PaymentSuccess />
            },
            {
                path: "/orders/:orderId",
                element: <OrderDetails/>
            }

        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/forgotpass",
        element: <ForgotPass />
    },
    // dashboard routes start here
    {
        path: "/dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            // user routes
            { path: '', element: <UserDMain/>},
            { path: 'orders', element: <UserOrders/> },
            { path: 'payments', element: <UserPayments/> },
            { path: 'profile', element: <UserProfile/> },
            { path: 'reviews', element: <UserReviews/> },


            // admin routes (only accessible by admin) Todo: private routes with role field
            {
                path: "admin",
                element: <PrivateRoute role="admin"><AdminDMain/></PrivateRoute>
            },
            {
                path: "add-product",

                element: <PrivateRoute role="admin"><AddProduct/></PrivateRoute>
            },
            {
                path: "add-category",

                element: <PrivateRoute role="admin"><AddCategory/></PrivateRoute>
            },
            {
                path: "manage-products",
                element: <PrivateRoute role="admin"><ManageProduct/></PrivateRoute>

            },
            {
                path: "manage-categories",
                element: <PrivateRoute role="admin"><ManageCategory/></PrivateRoute>

            },
            {
                path: "update-product/:id",
                element: <PrivateRoute role="admin"><UpdateProduct/></PrivateRoute>
            },
            {
                path: "update-category/:id",
                element: <PrivateRoute role="admin"><UpdateCategory/></PrivateRoute>
            },
            { path: "users", element: <PrivateRoute role="admin"><ManageUser/></PrivateRoute> },
            { path: "manage-orders", 
              element: <PrivateRoute role="admin"><ManageOrders/></PrivateRoute> 
            },
        ]
    }

]
);

export default router;