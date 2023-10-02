import { useEffect, useState, useCallback } from "react";
import { Button, Table, Modal, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlus, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import Swal from "sweetalert2";
import {
  deleteCategories,
  editCategories,
  getCategories,
  postCategories,
} from "./categoriesSlice";
import { getProducts } from "../Stocks/productSlice";
import { Link } from "react-router-dom";
const Categories = () => {
  const [modalCreate, setModalCreate] = useState(false);
  const [editData, setEditData] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { loading, categories, error } = useSelector((state) => state.category);
  const userData = useSelector((state) => state.login);
  const categoriesName = categories.map((category) => category.category);
  const productsData = useSelector((state) => state.product);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCategoriesData = useCallback(async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(getCategories(user.uid));
        dispatch(getProducts(user.uid));
      }
    });
  });
  useEffect(() => {
    fetchCategoriesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columns = [
    {
      title: "Category",
      key: "category",
      dataIndex: "category",
      render: (category) => (
        <Link to={`/categories/${category}`}>{category}</Link>
      ),
      sorter: (a, b) => a.category.length - b.category.length,
      width: "50%",
    },
    {
      title: "Number of Products",
      key: "quantity",
      render: (category) => {
        const total = productsData.products.filter(
          (product) => product.category === category.category
        );
        return (
          <Link to={`/categories/${category.category}`}>{total.length}</Link>
        );
      },
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
              handleEdit(record);
            }}
          />
          <AiFillDelete
            type="primary"
            size={25}
            className="bg-red-500 hover:bg-red-300 text-white p-1 rounded-lg"
            onClick={() => handleDeleteCategory(record)}
          />
        </div>
      ),
    },
  ];
  const handleEdit = (record) => {
    setEditCategoryData(record);
    setEditData(true);
    setModalCreate(true);
    form.setFieldsValue({
      category: record.category,
    });
  };
  const handleDeleteCategory = (record) => {
    console.log(record.id);
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this Category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteCategories(record.id));
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Category deleted successfully",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error || "Category deleted failed",
          });
        }
      } else {
        Swal.fire("Cancelled", "Your category is safe :)", "error");
      }
    });
  };

  const onModalCreateClose = () => {
    setModalCreate(false);
    if (editData) {
      setEditCategoryData(null);
      setEditData(false);
    }
    form.resetFields();
  };
  const handleSubmitCategory = async (values) => {
    if (editData) {
      const data = {
        id: editCategoryData.id,
        category: values.category,
        uid: userData.uid,
      };
      try {
        dispatch(editCategories(data));
        form.resetFields();
        setModalCreate(false);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Category edited successfully",
        });
        setEditData(null);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error || "Category edit failed",
        });
      }
    } else {
      const data = {
        category: values.category,
        uid: userData.uid,
      };
      try {
        dispatch(postCategories(data));
        form.resetFields();
        setModalCreate(false);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Category updated successfully",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error || "Category update failed",
        });
      }
    }
  };

  const validateCategoryName = async (_, value) => {
    if (categoriesName.includes(value)) {
      throw new Error("Category with this name is already exists");
    }
  };
  return (
    <div className="p-4">
      {error && <p>{error}</p>}
      <Button
        type="primary"
        icon={<AiOutlinePlus />}
        size={30}
        onClick={() => setModalCreate(true)}
        className="bg-primary-green px-4 py-5 text-md font-poppins font-bold flex justify-center items-center mb-3"
      >
        Add
      </Button>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={categories}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{
          x: 240,
        }}
      />
      <Modal
        title={
          <p className="text-lg">
            {editData ? "Edit Category" : "Add Category"}
          </p>
        }
        open={modalCreate}
        centered
        onCancel={() => onModalCreateClose()}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmitCategory} form={form}>
          <Form.Item
            name="category"
            label="Category"
            rules={[
              {
                required: true,
                message: "Please input category's name",
              },
              {
                validator: validateCategoryName,
              },
            ]}
          >
            <Input placeholder="Enter Category's Name" className="py-2" />
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

export default Categories;
