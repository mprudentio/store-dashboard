import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"
import { Layout, Menu, Button } from 'antd';
import {BiSolidDashboard} from 'react-icons/bi'
import {FaBox} from 'react-icons/fa'
import { useLocation,Link, useNavigate } from "react-router-dom";
import {FaMoneyBills} from 'react-icons/fa6'
import {AiOutlineMenuFold, AiOutlineMenuUnfold} from 'react-icons/ai'
import {HiOutlineLogout} from 'react-icons/hi'
import Swal from "sweetalert2";
const { Header, Sider, Content } = Layout;
const Index = () => {
  // const [collapsed, setCollapsed] = useState(false);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [isButtonDisabled, setIsButtonDisabled] = useState(window.innerWidth < 780); 
  // const [activeMenuItem, setActiveMenuItem] = useState('satu');
  // const handleMenu = (e) =>{
  //   setActiveMenuItem(e.key)
  //   console.log(e.key)
  // }
  const handleResize = () => {
    // Update the collapsed state when the window is resized
    setCollapsed(window.innerWidth < 768);
    setIsButtonDisabled(window.innerWidth < 780);
  };

  useEffect(() => {
    // Add a window resize event listener
    window.addEventListener("resize", handleResize);
   
    
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const location = useLocation()
  const navigate = useNavigate()
  const pageName = location.pathname.split('/').pop()
  const capitalizePageName = pageName.charAt(0).toUpperCase()+pageName.slice(1)
  const handleLogOut = () => {
    try {
      window.localStorage.removeItem("isLoggedin");
      Swal.fire({
        icon: "success",
        title: "Logout Successful",
        text: "You have successfully logged out!",
        timer: 2000,
        showConfirmButton: false,
      });
  
      // Move the navigate call outside of the try block
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: error.message,
      });
    }
    
    navigate('/login'); // Only call navigate after the try-catch block
  };
  

  return (
    <div >
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} className="bg-white">
          <Menu
            mode="inline"
            className={`h-screen font-poppins text-md pt-16 text-gray-700 `}
            defaultSelectedKeys={['1']}
            selectedKeys={[location.pathname]}
            // onClick={handleMenu}
            items={[
              {
                key: '/dashboard',
                icon: <BiSolidDashboard />,
                className:`${location.pathname==='/dashboard'?'bg-secondary-green text-black hover:text-black hover:bg-secondary-green' : 'hover:text-primary-green hover:bg-transparent'} `,
                label: <Link to="/dashboard">Dashboard</Link>

              },
              {
                key: '/sales',
                icon: <FaMoneyBills />,
                className:`${location.pathname==='/sales'?'bg-secondary-green text-black hover:text-black hover:bg-secondary-green' : 'hover:text-primary-green hover:bg-transparent'} `,
                label: <Link to="/sales">Sales</Link>
              },
              {
                key: '/products',
                icon: <FaBox />,
                className:`${location.pathname==='/products'?'bg-secondary-green text-black hover:text-black hover:bg-secondary-green' : 'hover:text-primary-green hover:bg-transparent'} `,
                label:  <Link to="/products">Products</Link>
              },{
                key:'logout',
                icon: <HiOutlineLogout className="text-[#EB5756] font-bold"/>,
                className:"bg-[#FBDDDD]",
                label: <p className="text-[#EB5756] font-bold" onClick={handleLogOut}>Logout</p>
              }
            ]}
          />
        </Sider>
        <Layout>
          <Header
            className="p-0 bg-primary-blue border-y-2 flex"
          >
            <Button
              type="text"
              icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
              onClick={() => {
                if (!isButtonDisabled) { // Check if the button is disabled before toggling the sidebar
                  setCollapsed(!collapsed);
                }
              }}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />

              <p className="font-poppins text-lg flex items-center">{capitalizePageName}</p>
          </Header>
          <Content className="bg-primary-blue"
          >
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default Index