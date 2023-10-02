import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import {
  getProducts,
  deleteProduct,
  updateProducts,
} from "../Stocks/productSlice";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  AutoComplete,
} from "antd";
const DetailCategoryPage = () => {
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const dispatch = useDispatch();
  let { category } = useParams();
  const { loading, products } = useSelector((state) => state.product);
  const userData = useSelector((state) => state.login);

  const data = products.filter((product) => product.category === category);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchProductData = useCallback(async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(getProducts(user.uid));
      }
    });
  });
  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [form] = Form.useForm();
  const columns = [
    {
      title: "Name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      dataIndex: "name",
      width: "40%",
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      key: "stock",
      render: (price) => <p>Rp {price}</p>,
    },
    {
      title: "Stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      dataIndex: "stock",
    },
    {
      title: "Actions",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-1">
          <AiFillEdit
            type="primary"
            size={25}
            className="bg-emerald-500 hover:bg-emerald-300 text-white p-1 rounded-lg"
            onClick={() => {
              handleEditButton(record);
            }}
          />
          <AiFillDelete
            type="primary"
            size={25}
            className="bg-red-500 hover:bg-red-300 text-white p-1 rounded-lg"
            onClick={() => handleDeleteProduct(record)}
          />
        </div>
      ),
    },
  ];

  const handleDeleteProduct = (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteProduct(product.id));
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Product deleted successfully",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error || "Product deleted failed",
          });
        }
      } else {
        Swal.fire("Cancelled", "Your product is safe :)", "error");
      }
    });
  };

  const handleEditButton = (product) => {
    setModal(true);
    setEditData(product);
    form.setFieldsValue({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
  };

  const handleCloseCreateModal = () => {
    form.resetFields();
    setModal(false);
    setEditData(null);
  };

  const handleEditProduct = (values) => {
    const data = {
      name: values.name,
      category: values.category,
      price: values.price,
      stock: values.stock,
      uid: userData.uid,
    };
    try {
      dispatch(updateProducts({ id: editData.id, data: data }));
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product edited successfully",
      });
      setEditData(null);
      form.resetFields();
      setModal(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error || "Product edited failed",
      });
    }
  };
  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
        scroll={{
          x: 240,
        }}
        cellFontSizeMD={100}
      />
      <Modal
        title={<p className="text-lg">Edit Product</p>}
        open={modal}
        centered
        onCancel={handleCloseCreateModal}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleEditProduct} form={form}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input product's name",
              },
            ]}
          >
            <Input placeholder="Enter Product's Name" className="py-2" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            className="w-full"
            rules={[
              {
                required: true,
                message: "Categroy name is required",
              },
            ]}
          >
            <AutoComplete
              placeholder="Choose a product's category"
              allowClear={false}
              // options={categoryData.categories.map(category => ({ value: category.category }))}
              filterOption={true}
              className="w-full"
              disabled
            />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              {
                required: true,
                message: "Please input product's price",
              },
              {
                validator: (_, value) => {
                  if (value && !Number.isInteger(Number(value))) {
                    return Promise.reject("Please enter a valid integer");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Enter Product's Price" className="py-2" />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[
              {
                required: true,
                message: "Please input product's stock",
              },
            ]}
          >
            <InputNumber className="w-full py-2" min={1} />
          </Form.Item>
          <Form.Item className="flex flex-row-reverse">
            <Button
              htmlType="submit"
              type="primary"
              className="bg-primary-green py-6 font-poppins flex items-center justify-center"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DetailCategoryPage;
