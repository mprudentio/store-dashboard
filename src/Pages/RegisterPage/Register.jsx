import  {useState}from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebaseConfig'
import Form from 'antd/es/form/Form'
import Input from 'antd/es/input/Input'
import { Button,Row,Col } from 'antd'
import { useNavigate } from 'react-router-dom'
import ReCAPTCHA from "react-google-recaptcha";
import test from '../../img/signup.svg'
import lagi from '../../img/lagi.svg'
import {FaUserAlt, FaKey} from 'react-icons/fa'
import Swal from 'sweetalert2'
const Register = () => {
    const [verified, setVerified] = useState(false)
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')
    const navigate=useNavigate()
    const handleRegister =async (e) =>{
      e.preventDefault()
      createUserWithEmailAndPassword(auth,email,password)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Please login to continue',
          timer: 2000, 
          showConfirmButton: false,
        })
        navigate('/')
        
      })
      .catch((error) =>{
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message
        });
      })
    }
    
    const handleRecaptcha = () =>{
      setVerified(!verified)
    }


    return (
      <div>
        <Row>
          <Col md={12} className='bg-gradient-to-r flex flex-col justify-center items-center md:p-0 from-emerald-500 to-emerald-900 w-screen md:bg-none'>
            <Form
              name="basic"
              layout='vertical'
              className='max-w-[450px] w-full mx-auto p-2 md:p-4'
              initialValues={{
                remember: true,
              }}
              onFinish={handleRegister}
              autoComplete="off"
            >

              <div>
                <p className='text-poppins text-4xl text-white md:text-primary-green font-extrabold'>Create an account</p>
                <div className='flex gap-2 mt-10'>
                  <FaUserAlt size={14} className='mt-1'/>
                  <label htmlFor="email" className='font-poppins text-md'>Email </label>
                </div>

                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      message: 'Please input your valid email!',
                    },
                    {
                      required: true,
                      message: 'Please input your email!',
                    },
                  ]}
                >
                  <Input onChange={(e) => setEmail(e.target.value)} className='py-2'/>
                </Form.Item>
              </div>
          
          <div>
            <div className='flex gap-2 mb-1'>
                  <FaKey size={14} className='mt-1'/>
                  <label htmlFor="password" className='font-poppins text-md'>Password </label>
            </div>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
            <Input.Password onChange={(e) => setPassword(e.target.value)} className='py-2'/>
          </Form.Item>
          </div>
         
          <div>
              <div className='flex gap-2 mb-1'>
                      <FaKey size={14} className='mt-1'/>
                      <label htmlFor="confirm password" className='font-poppins text-md'>Confirm Password </label>
              </div>

              <Form.Item
              name="confirm password"
              rules={[
                {
                  required: true,
                  message: 'Password does not match',
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
              ]}
            >
            <Input.Password onChange={(e) => setConfirmPassword(e.target.value)} className='py-2'/>
          </Form.Item>
          </div>
          
          
          <Form.Item>
              <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPCTHA_SITE_KEY}
                  onChange={handleRecaptcha}
              />
          </Form.Item>
          <Form.Item
          >
            <Button htmlType="submit" block type='primary' className='bg-primary-green py-6 font-poppins flex items-center justify-center' disabled={!email || !password || !verified || password !== confirmPassword} >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
          </Col>
          <Col md={12} className='hidden md:inline'>
            <div className='h-screen bg-center bg-no-repeat bg-cover flex justify-center items-center' style={{ backgroundImage:`url(${lagi})` }}>
              <img src={test} alt="" />
            </div>
          </Col>
        </Row>
       
      </div>
    )
}

export default Register