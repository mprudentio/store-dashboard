import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../Pages/LoginPage/loginSlice";
import productReducer from '../Pages/Stocks/productSlice'
import revenueReducer from '../Pages/RevenuePage/revenueSlice'

const store = configureStore({
    reducer:{
        login:loginReducer,
        product:productReducer,
        revenue:revenueReducer
    }
})

export default store