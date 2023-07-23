import { Home } from "./components/Home";
import { CustomerList } from "./components/MVP/CustomerList";
import { ProductList } from "./components/MVP/ProductList";
import { StoreList } from "./components/MVP/StoreList";
import { SaleList } from "./components/MVP/SaleList";


const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/mvp/salelist',
        element: <SaleList />
    },
    {
        path: '/mvp/storelist',
        element: <StoreList />
    },
    {
        path: '/mvp/productlist',
        element: <ProductList />
    },
    {
        path: '/mvp/customerlist',
        element: <CustomerList />
    }
];

export default AppRoutes;
