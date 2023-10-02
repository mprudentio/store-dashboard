import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  AutoComplete,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlinePlus, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import Swal from "sweetalert2";
import {
  getProducts,
  createProducts,
  updateProducts,
  deleteProduct,
} from "./productSlice";

const Stocks = () => {
  const [modalCreate, setModalCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchStock, setSearchStock] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const dispatch = useDispatch();
  const { loading, products, error } = useSelector((state) => state.product);
  const categoryData = useSelector((state) => state.category);
  const productNames = products.map((product) => product.name);
  const userData = useSelector((state) => state.login);

  // const [id,setId]=useState(null)
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      dataIndex: "name",
    },
    {
      title: "Category",
      key: "category",
      sorter: (a, b) => a.category.length - b.category.length,
      dataIndex: "category",
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
      key: "actions",
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
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleCreateButton = () => {
    setModalCreate(true);
  };

  const handleCloseCreateModal = () => {
    setModalCreate(false);
    if (edit) {
      setEdit(null);
    }
    form.resetFields();
  };
  const validateProductName = async (_, value) => {
    if (!edit) {
      if (productNames.includes(value)) {
        throw new Error("Product with this name is already exists");
      }
    }
  };
  const handleSubmitProduct = (values) => {
    if (edit) {
      const data = {
        name: values.name,
        category: values.category,
        price: values.price,
        stock: values.stock,
        uid: userData.uid,
      };
      try {
        dispatch(updateProducts({ id: edit.id, data: data }));
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product edited successfully",
        });
        setEdit(false);
        form.resetFields();
        setModalCreate(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error || "Product edited failed",
        });
      }
    } else {
      try {
        const data = {
          name: values.name,
          category: values.category,
          price: values.price,
          stock: values.stock,
          uid: userData.uid,
        };
        dispatch(createProducts(data));
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product created successfully",
        });
        form.resetFields();
        setModalCreate(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error || "Product creation failed",
        });
      }
    }
  };

  const handleEditButton = (product) => {
    setEdit(product);
    setModalCreate(true);
    form.setFieldsValue({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });
    // setId(product.id)
  };

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

  const handleSearch = () => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchName.toLowerCase()) &&
        product.category.toLowerCase().includes(searchCategory.toLowerCase()) &&
        String(product.stock).includes(searchStock)
    );

    setFilteredProducts(filtered);
  };
  return (
    <div>
      {!loading && error && <p>{error}</p>}
      {!error && products && (
        <div className="p-4">
          <Button
            type="primary"
            icon={<AiOutlinePlus />}
            size={30}
            onClick={handleCreateButton}
            className="bg-primary-green px-4 py-5 text-md font-poppins font-bold flex justify-center items-center mb-3"
          >
            Add
          </Button>
          <div className="flex flex-col md:flex-row md:space-x-2 mb-4 gap-2 md:gap-0">
            <Input
              placeholder="Type a Name"
              id="productName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Input
              placeholder="Type a Category"
              id="productCategory"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />
            <Input
              placeholder="Type Stock"
              id="productStock"
              value={searchStock}
              onChange={(e) => setSearchStock(e.target.value)}
            />
            <Button
              type="primary"
              className="bg-primary-green font-poppins text-xs"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={filteredProducts}
            rowKey={(record) => record.id}
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{
              x: 240,
            }}
            cellFontSizeMD={100}
          />
          <Modal
            title={
              <p className="text-lg">{edit ? "Edit Product" : "Add Product"}</p>
            }
            open={modalCreate}
            centered
            onCancel={handleCloseCreateModal}
            footer={null}
          >
            <Form layout="vertical" onFinish={handleSubmitProduct} form={form}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please input product's name",
                  },
                  {
                    validator: validateProductName,
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
                  options={categoryData.categories.map((category) => ({
                    value: category.category,
                  }))}
                  filterOption={true}
                  className="w-full"
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
      )}
    </div>
  );
};

export default Stocks;
