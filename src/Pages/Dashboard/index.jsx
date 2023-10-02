import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Avatar, Layout, Menu, Button } from "antd";
import { BiSolidDashboard } from "react-icons/bi";
import { FaBox } from "react-icons/fa";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaMoneyBills } from "react-icons/fa6";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { HiOutlineLogout } from "react-icons/hi";
import { BiSolidUser } from "react-icons/bi";
import { auth } from "../../../firebaseConfig";
import { getUser, setActiveUser } from "../LoginPage/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { CiPill } from "react-icons/ci";
import Swal from "sweetalert2";
import { getCategories } from "../CategoriesPage/categoriesSlice";
const { Header, Sider, Content } = Layout;

const Index = () => {
  const [avatarImage, setAvatarImage] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const categoriesData = useSelector((state) => state.category);
  const userData = useSelector((state) => state.login);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userData.user && userData.user.length > 0) {
      setAvatarImage(userData.user[0].url);
    }
  }, [userData.user]);
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setActiveUser({
            uid: user.uid,
            email: user.email,
          })
        );
        dispatch(getCategories(user.uid));
        dispatch(getUser(user.uid));
      } else {
        dispatch(
          setActiveUser({
            uid: null,
            email: null,
          })
        );
      }
    });
    return () => {
      listen();
    };
  }, [dispatch]);
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname.split("/").pop();
  const decodedPageName = decodeURIComponent(pageName);
  const capitalizePageName =
    decodedPageName.charAt(0).toUpperCase() + decodedPageName.slice(1);
  const isValidPath = categoriesData.categories.some(
    (category) => category.category === decodedPageName
  );
  const handleLogOut = () => {
    try {
      signOut(auth).then(() => {
        window.localStorage.removeItem("isLoggedin");
        Swal.fire({
          icon: "success",
          title: "Logout Successful",
          text: "You have successfully logged out!",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: error.message,
      });
    }
  };

  return (
    <div>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="bg-white"
          width={180}
        >
          <Menu
            mode="inline"
            className={`h-screen font-poppins text-md pt-16 text-gray-700`}
            defaultSelectedKeys={["1"]}
            selectedKeys={[location.pathname]}
            items={[
              {
                key: "/dashboard",
                icon: (
                  <Link to="/dashboard">
                    <BiSolidDashboard />
                  </Link>
                ),
                className: `${
                  location.pathname === "/dashboard"
                    ? "bg-secondary-green text-black hover:text-black hover:bg-secondary-green"
                    : "hover:text-primary-green hover:bg-transparent"
                } `,
                label: <Link to="/dashboard">Dashboard</Link>,
              },
              {
                key: "/categories",
                icon: (
                  <Link to="/categories">
                    <CiPill />
                  </Link>
                ),
                className: `${
                  location.pathname === "/categories" ||
                  location.pathname.startsWith("/categories/")
                    ? "bg-secondary-green text-black hover:text-black hover:bg-secondary-green"
                    : "hover:text-primary-green hover:bg-transparent"
                } `,
                label: <Link to="/categories">Categories</Link>,
              },
              {
                key: "/products",
                icon: (
                  <Link to="/products">
                    <FaBox />
                  </Link>
                ),
                className: `${
                  location.pathname === "/products"
                    ? "bg-secondary-green text-black hover:text-black hover:bg-secondary-green"
                    : "hover:text-primary-green hover:bg-transparent"
                } `,
                label: <Link to="/products">Products</Link>,
              },
              {
                key: "/sales",
                icon: (
                  <Link to="/sales">
                    <FaMoneyBills />
                  </Link>
                ),
                className: `${
                  location.pathname === "/sales"
                    ? "bg-secondary-green text-black hover:text-black hover:bg-secondary-green"
                    : "hover:text-primary-green hover:bg-transparent"
                } `,
                label: <Link to="/sales">Sales</Link>,
              },
              {
                key: "logout",
                icon: (
                  <HiOutlineLogout
                    className="text-[#EB5756] font-bold"
                    onClick={handleLogOut}
                  />
                ),
                className: "bg-[#FBDDDD]",
                label: (
                  <p
                    className="text-[#EB5756] font-bold "
                    onClick={handleLogOut}
                  >
                    Logout
                  </p>
                ),
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header className=" bg-primary-blue border-y-2 flex justify-between p-0 ">
            <div className="flex">
              <Button
                type="text"
                icon={
                  collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />
                }
                onClick={() => {
                  setCollapsed(!collapsed);
                }}
                className="md:text-4 md:w-16 h-16"
              />

              <p className="font-poppins text-xs min-[500px]:text-lg flex items-center">
                {!location.pathname.startsWith("/categories/")
                  ? capitalizePageName
                  : location.pathname.startsWith("/categories/") && isValidPath
                  ? capitalizePageName
                  : ""}
              </p>
            </div>
            <div className="flex justify-center items-center md:mr-5 w-9">
              <Link to="/profile">
                {userData.user &&
                userData.user.length > 0 &&
                userData.user[0]?.url ? (
                  <Avatar
                    src={avatarImage}
                    size={{
                      xs: 18,
                      md: 40,
                    }}
                    className="flex items-center justify-center"
                  />
                ) : (
                  <Avatar
                    icon={<BiSolidUser className="" />}
                    size={{
                      xs: 18,
                      md: 40,
                    }}
                    className="flex items-center justify-center "
                  />
                )}
              </Link>
            </div>
          </Header>
          <Content className="bg-primary-blue">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Index;
