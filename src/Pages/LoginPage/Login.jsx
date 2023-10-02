import { useState } from "react";
import Input from "antd/es/input/Input";
import { Button, Form, Col, Row } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setActiveUser } from "./loginSlice";
import { useNavigate } from "react-router-dom";
import loginImage from "../../img/login.jpg";
import { FaUserAlt, FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        dispatch(
          setActiveUser({
            uid: result.user.uid,
            email: result.user.email,
          })
        );
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have successfully logged in!",
          timer: 2000,
          showConfirmButton: false,
        });
        window.localStorage.setItem("isLoggedin", true);
        navigate("/dashboard");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text:
            error.message === "Firebase: Error (auth/user-not-found)."
              ? "User not found"
              : "Incorrect Username or Password. Please try again.",
        });
      });
  };

  return (
    <div>
      <Row className="font-poppins">
        <Col md={12} className="hidden md:inline ">
          <div
            className="bg-no-repeat bg-cover bg-center h-screen"
            style={{ backgroundImage: `url(${loginImage})` }}
          ></div>
        </Col>
        <Col
          md={12}
          className="bg-gradient-to-r flex flex-col justify-center items-center h-screen w-screen"
        >
          <Form
            name="basic"
            layout="vertical"
            // className='lg:w-[450px] w-auto mx-auto'
            className="max-w-[450px] w-full mx-auto p-4"
            initialValues={{
              remember: true,
            }}
            onFinish={handleSignIn}
            autoComplete="on"
          >
            <div className="mb-5">
              <p className="text-poppins text-4xl  text-primary-green font-extrabold mb-1">
                Sign in
              </p>
              <p className="text-sm font-poppins">
                Do not have an account?{" "}
                <Link
                  to="/register"
                  className="hover:text-primary-green md:text-black text-primary-green"
                >
                  <span>Register here</span>
                </Link>
              </p>
            </div>
            <div className="">
              <div className="flex gap-2 mb-1">
                <FaUserAlt size={14} className="mt-1" />
                <label htmlFor="email" className="font-poppins text-md">
                  Email{" "}
                </label>
              </div>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not a valid email!",
                  },
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input
                  id="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-3"
                />
              </Form.Item>
            </div>

            <div className="mb-1">
              <div className="flex gap-2 mb-1">
                <FaKey size={14} className="mt-1" />
                <label htmlFor="password" className="font-poppins text-md">
                  Password{" "}
                </label>
              </div>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-3"
                />
              </Form.Item>
            </div>
            <div className="mt-2">
              <Form.Item>
                <Button
                  htmlType="submit"
                  block
                  type="primary"
                  className="bg-primary-green py-6 font-poppins flex items-center justify-center"
                  disabled={!email || !password}
                >
                  Sign In
                </Button>
              </Form.Item>
            </div>
          </Form>
          <Link
            to="/forgot-password"
            className="text-xs font-poppins text-primary-green hover:text-primary-green"
          >
            <p>Forgot Password?</p>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
