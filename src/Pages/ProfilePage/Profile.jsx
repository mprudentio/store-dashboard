import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InboxOutlined } from "@ant-design/icons";
import { Form, Input, Button, Upload, Avatar } from "antd";
import dayjs from "dayjs";
import { BiSolidUser } from "react-icons/bi";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { getUser, setActiveUser } from "../LoginPage/loginSlice";
import { storage } from "../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { editUser } from "../LoginPage/loginSlice";
import { AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";

const Profile = () => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState();
  const [displayImage, setDisplayImage] = useState(null);
  const userData = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const { Dragger } = Upload;
  const handleEditProfile = (value) => {
    console.log(value);
    console.log("file", imageFile);
    const imageRef = ref(
      storage,
      `images/${imageFile.name + dayjs(new Date()) + userData.uid}`
    );
    uploadBytes(imageRef, imageFile)
      .then((snpashot) => {
        getDownloadURL(snpashot.ref)
          .then((url) => {
            dispatch(
              editUser({
                id: userData.user[0].id,
                uid: userData.uid,
                email: value.email,
                firstName: value.firstname,
                lastName: value.lastname,
                url: url,
              })
            );
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Product edited successfully",
            });
            setImageFile(null);
            form.setFieldsValue({
              image: "",
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: error || "Product edited failed",
            });
          });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error || "Product edited failed",
        });
      });
  };
  //     const maxSize = 500 * 1024;
  //     const input = e.target;
  //     if (input.files && input.files[0]) {
  //       const selectedFile = input.files[0];
  //       const allowedTypes = ['image/jpeg', 'image/png'];

  //       if (!allowedTypes.includes(selectedFile.type)) {
  //         setErrorImage('Please upload a JPEG or PNG image.');
  //         setFile(null);
  //         return;
  //       }

  //       if (selectedFile.size > maxSize) {
  //         setErrorImage('The image must be less than 500KB in size.');
  //         setFile(null);
  //         return;
  //       }

  //       setFile(selectedFile);
  //       setErrorImage('');
  //     }
  //   };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setActiveUser({
            uid: user.uid,
            email: user.email,
          })
        );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (userData.user && userData.user.length > 0) {
      form.setFieldsValue({
        firstname: userData.user[0].firstName || "",
        lastname: userData.user[0].lastName || "",
        email: userData.user[0].email || "",
      });
      setDisplayImage(userData.user[0].url);
    }
  }, [form, userData.user]);
  const props = {
    maxCount: 1,
    showUploadList: false,
    name: "file",
    multiple: false,
    beforeUpload(file) {
      const maxSize = 500 * 1024;
      const allowedTypes = ["image/jpeg", "image/png"];
      return new Promise((resolve, reject) => {
        if (file && file.size > maxSize) {
          reject("File size exceeded 500kb");
        } else if (file && !allowedTypes.includes(file.type)) {
          reject("File type is not jpeg or png");
        } else {
          resolve();
        }
      });
    },
    customRequest(info) {
      setImageFile(info.file);
    },
  };
  return (
    <div className="p-4 flex flex-col md:flex-row md:space-x-10 justify-center">
      <div className="w-[100px] h-[100px] min-[425px]:w-[200px] min-[425px]:h-[200px] rounded-full overflow-hidden ">
        {userData.user && userData.user.length > 0 && userData.user[0].url ? (
          <Avatar src={displayImage} className="w-full  h-full object-cover" />
        ) : (
          <Avatar
            icon={<BiSolidUser className="" />}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div>
        <Form layout="vertical" onFinish={handleEditProfile} form={form}>
          <Form.Item
            name="firstname"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please input your First Name",
              },
            ]}
          >
            <Input placeholder="Enter First Name" className="py-2" />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please input your Last Name",
              },
            ]}
          >
            <Input placeholder="Enter Last Name" className="py-2" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled className="py-2" />
          </Form.Item>
          <Form.Item
            initialValue=""
            name="image"
            label="Upload an Image"
            valuePropName="file"
            getValueFromEvent={(event) => {
              return event.file;
            }}
            rules={[
              {
                required: true,
                message: "Please select an image file.",
              },
              {
                validator(_, file) {
                  const maxSize = 500 * 1024;
                  const allowedTypes = ["image/jpeg", "image/png"];
                  return new Promise((resolve, reject) => {
                    if (file && file.size > maxSize) {
                      reject("File size exceeded 500kb");
                    } else if (file && !allowedTypes.includes(file.type)) {
                      reject("File type is not jpeg or png");
                    } else {
                      resolve();
                    }
                  });
                },
              },
            ]}
          >
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text ">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint px-4">
                {" "}
                Please upload a JPEG or PNG image (max size: 500KB)
              </p>
            </Dragger>
          </Form.Item>
          {imageFile && (
            <div className="w-full h-[150px] flex gap-1 overflow-hidden">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-full h-full object-cover "
              />
              <AiFillDelete
                size={20}
                className="text-red-500 cursor-pointer hover:text-red-300"
                onClick={() => {
                  setImageFile(null);
                  form.setFieldsValue({ image: "" });
                }}
              />
            </div>
          )}
          <Form.Item className="flex mt-2">
            <Button
              htmlType="submit"
              type="primary"
              className="bg-primary-green py-6 font-poppins flex items-center justify-center"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
