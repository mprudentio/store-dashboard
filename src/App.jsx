import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./Pages/ProtectedRoute";
import Login from "./Pages/LoginPage/Login";
import Register from "./Pages/RegisterPage/Register";
import ForgotPassword from "./Pages/ForgotPasswordPage/ForgotPassword";
import { Provider } from "react-redux";

import LoggedinProtectedRoute from "./Pages/LoggedinProtectedRoute";
import store from "./app/store.js";
import Dashboard from "./Pages/Dashboard/index";
import Stocks from "./Pages/Stocks/Stocks";
import OverviewPage from "./Pages/OverviewPage/OverviewPage";
import Revenue from "./Pages/RevenuePage/Revenue";
import Categories from "./Pages/CategoriesPage/Categories";
import DetailCategoryPage from "./Pages/DetailCategoryPage/DetailCategoryPage";
import Profile from "./Pages/ProfilePage/Profile";
// import OverviewPage from "./Pages/OverviewPage/OverviewPage";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route
            index
            path={"/dashboard"}
            element={
              <ProtectedRoute>
                <OverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Stocks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Revenue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:category"
            element={
              <ProtectedRoute>
                <DetailCategoryPage />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* <Route path="/login"element={ isAuthorize ? <Navigate to="/dashboard" /> : <Login />} ></Route>
      <Route path="/register" element={ isAuthorize?<Navigate to="/dashboard" />:<Register/>}></Route>
      <Route path="/forgot-password" element={ isAuthorize?<Navigate to="/dashboard" />:<ForgotPassword/>}></Route> */}
        <Route
          path="/login"
          element={
            <LoggedinProtectedRoute>
              <Login />
            </LoggedinProtectedRoute>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <LoggedinProtectedRoute>
              <Register />
            </LoggedinProtectedRoute>
          }
        ></Route>
        <Route
          path="/forgot-password"
          element={
            <LoggedinProtectedRoute>
              <ForgotPassword />
            </LoggedinProtectedRoute>
          }
        ></Route>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" />
            </ProtectedRoute>
          }
        />
      </>
    )
    // {
    //   path: '/',
    //   element: <ProtectedRoute><Dashboard/></ProtectedRoute>,
    //   children:[
    //     {
    //       path:'/stocks',
    //       element:  <ProtectedRoute><Stocks/></ProtectedRoute>,
    //     }
    //   ]
    // },{
    //   path: "/login",
    //   element: <Login />,
    // },
    // {
    //   path: "/register",
    //   element: <Register />,
    // },
    // {
    //   path: "/forgot-password",
    //   element: <ForgotPassword />,
    // },
  );
  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
}

export default App;
