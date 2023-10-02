import { useState } from "react";
import { auth } from "../../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import coba from "../../img/forgotPassword.svg";
import { Form, Row, Col, Input, Button } from "antd";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handlerSubmit = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful",
          text: "Please Check Your Email",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Password Reset Failed",
          text:
            error.message === "Firebase: Error (auth/user-not-found)."
              ? "Email Not Found"
              : error.message,
        });
      });
  };
  return (
    <div>
      {/* <form action="" onSubmit={handlerSubmit}>
            <label htmlFor="email" name="email">Email</label>
            <input type="email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type='submit'>Submit</button>
        </form> */}
      <Row>
        <Col md={12} className="hidden md:inline ">
          {/* <div className='bg-no-repeat bg-cover bg-center h-screen border-2 border-red-400 flex justify-center items-center'  style={{ backgroundImage: `url(${forgot})` }}>
          </div> */}
          <div className="h-screen">
            <img src={coba} alt="" className="px-4" />
          </div>
        </Col>
        <Col
          md={12}
          className="bg-gradient-to-r flex flex-col justify-center items-center h-screen w-screen "
        >
          <Form
            name="basic"
            layout="vertical"
            className="max-w-[450px] w-full mx-auto p-4"
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
          >
            <div className="mb-5">
              <p className="text-poppins text-4xl text-primary-green font-extrabold mb-1">
                Forgot Password?
              </p>
              <p className="text-sm font-poppins">
                Enter the email address associated with your account and
                we&apos;ll send you a link to change your password{" "}
              </p>
            </div>
            <div className="">
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onClick={handlerSubmit}
                  className="bg-primary-green py-6 font-poppins flex items-center justify-center"
                  disabled={!email}
                >
                  Reset Password
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;
