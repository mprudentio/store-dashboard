import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../Pages/LoginPage/loginSlice";
import productReducer from '../Pages/Stocks/productSlice'
import revenueReducer from '../Pages/RevenuePage/revenueSlice'
import categoriesReducer from "../Pages/CategoriesPage/categoriesSlice";

const store = configureStore({
    reducer:{
        login:loginReducer,
        product:productReducer,
        revenue:revenueReducer,
        category:categoriesReducer
    }
})

export default store