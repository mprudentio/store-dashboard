import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRevenue,
  postRevenue,
  editRevenue,
  deleteRevenue,
} from "./revenueSlice";
import { getProducts } from "../Stocks/productSlice";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import {
  Table,
  DatePicker,
  Button,
  Modal,
  Input,
  Form,
  AutoComplete,
  InputNumber,
} from "antd";
import {
  AiOutlinePlus,
  AiOutlineClose,
  AiFillEdit,
  AiFillDelete,
} from "react-icons/ai";
const Revenue = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [modalCreate, setModalCreate] = useState(false);
  const [editData, setEditData] = useState(null);
  const userData = useSelector((state) => state.login);
  const [productItems, setProductItems] = useState([
    {
      product: "",
      quantity: 0, // Set your desired default quantity here
      price: 0, // Set your desired default price here
    },
  ]);
  const dataRevenue = useSelector((state) => state.revenue);
  const dataProducts = useSelector((state) => state.product);
  const columns = [
    {
      title: "Date",
      key: "date",
      dataIndex: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Products",
      key: "products",
      dataIndex: "products",
      render: (products) => (
        <div>
          {products.map((e) => (
            <p key={e.name + 1}>{e.name}</p>
          ))}
        </div>
      ),
      // sorter: (a, b) => {
      //   const productNameA = a.products[0].name.toLowerCase();
      //   const productNameB = b.products[0].name.toLowerCase();
      //   return productNameA.localeCompare(productNameB);
      // },
    },
    {
      title: "Quantity",
      key: "quantity",
      dataIndex: "products",
      render: (products) => (
        <div>
          {products.map((e, i) => (
            <p key={`${e.name}-${dayjs(e.date).format("SSS")}-${i}-${e.price}`}>
              {e.quantity}
            </p>
          ))}
        </div>
      ),
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
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
              handleEdit(record);
            }}
          />
          <AiFillDelete
            type="primary"
            size={25}
            className="bg-red-500 hover:bg-red-300 text-white p-1 rounded-lg"
            onClick={() => handleDeleteSales(record)}
          />
        </div>
      ),
    },
  ];

  const handleDeleteSales = (record) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this sales!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteRevenue(record.id));
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Sales deleted successfully",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: error || "Sales deleted failed",
          });
        }
      } else {
        Swal.fire("Cancelled", "Your product is safe :)", "error");
      }
    });
  };
  const handleEdit = (record) => {
    setEditData(record);
    const productFields = record.products.map((product) => ({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    }));

    const initialValues = {};

    productFields.forEach((field, index) => {
      initialValues[`product-${index}`] = field.name;
      initialValues[`quantity-${index}`] = field.quantity;
      initialValues[`price-${index}`] = field.price;
    });
    setProductItems(productFields);
    form.setFieldsValue({
      date: dayjs(record.date, "DD/MM/YYYY"),
      totalPrice: record.price,
      ...initialValues,
    });

    setModalCreate(true);
  };
  const addProductItem = () => {
    // setProductItems([...productItems,{}]);
    form
      .validateFields([
        `product-${productItems.length - 1}`,
        `quantity-${productItems.length - 1}`,
      ])
      .then(() => {
        const newProductItems = [
          ...productItems,
          { product: "", quantity: 0, price: 0 },
        ];
        setProductItems(newProductItems);
        form.resetFields([
          `product-${newProductItems.length - 1}`,
          `quantity-${newProductItems.length - 1}`,
          `price-${newProductItems.length - 1}`,
        ]);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchRevenueData = useCallback(async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(getProducts(user.uid));
        dispatch(getRevenue(user.uid));
      }
    });
  });
  useEffect(() => {
    fetchRevenueData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const calculatePrice = (quantity, productName) => {
    const product = dataProducts.products.find(
      (product) => product.name === productName
    );
    if (product) {
      return quantity * product.price;
    }
    return 0;
  };

  const handleProductChange = (value, index) => {
    const productName = value;
    const updatedProductItems = [...productItems];
    updatedProductItems[index] = {
      ...updatedProductItems[index],
      product: productName,
    };
    setProductItems(updatedProductItems);

    const quantity = form.getFieldValue(`quantity-${index}`);
    const price = calculatePrice(quantity, productName);
    const formattedPrice = isNaN(price) ? 0 : `Rp ${price}`;
    form.setFieldsValue({ [`price-${index}`]: formattedPrice });
  };
  const calculateTotalPrice = (items = productItems) => {
    let total = 0;
    items.forEach((item, index) => {
      const price = form.getFieldValue(`price-${index}`);
      if (price) {
        const totalPrice = parseFloat(price.replace("Rp ", ""));
        if (!isNaN(totalPrice)) {
          total += totalPrice;
        }
      }
    });
    return `Rp ${total}`; // Format the total price as 'Rp X.XX'
  };
  const removeProductItem = (index) => {
    const updatedProductItems = [...productItems];
    updatedProductItems.splice(index, 1); // Remove the item at the specified index
    setProductItems(updatedProductItems);
    // console.log(productItems)
    //recalculate the total price
    const newTotalPrice = calculateTotalPrice(updatedProductItems);
    form.setFieldsValue({ totalPrice: newTotalPrice });
  };

  const onModalCreateClose = () => {
    form.resetFields();
    setProductItems([
      {
        product: "",
        quantity: 0, // Set your desired default quantity here
        price: 0, // Set your desired default price here
      },
    ]);
    setModalCreate(false);
    if (editData) {
      setEditData(false);
    }
  };

  const onFinish = (values) => {
    const price = values.totalPrice;
    const matchingIds = [];
    //find the id
    for (const item of productItems) {
      const matchingProduct = dataProducts.products.find(
        (product) => product.name === item.product
      );
      if (matchingProduct) {
        matchingIds.push(matchingProduct.id);
      }
    }

    const data = productItems.map((item, index) => ({
      name: values[`product-${index}`],
      quantity: values[`quantity-${index}`],
      price: values[`price-${index}`],
    }));

    const products = data.map((product, index) => {
      return {
        ...product,
        id: matchingIds[index],
      };
    });
    if (editData) {
      const updatedRevenueData = {
        id: editData.id, // Assuming you have an ID field for each revenue entry
        date: dayjs(values.date).format("DD/MM/YYYY"),
        products,
        price,
        uid: userData.uid,
      };
      try {
        dispatch(editRevenue(updatedRevenueData)); // Dispatch an action to update the revenue entry
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Revenue updated successfully",
        });
        // Close the modal and reset the form
        form.resetFields();
        setEditData(null);
        setProductItems([
          {
            product: "",
            quantity: 0, // Set your desired default quantity here
            price: 0, // Set your desired default price here
          },
        ]);
        onModalCreateClose();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error || "Revenue update failed",
        });
      }
    } else {
      const submissionData = {
        date: dayjs(values.date).format("DD/MM/YYYY"),
        products,
        price,
        uid: userData.uid,
      };
      // console.log(submissionData)
      try {
        dispatch(postRevenue(submissionData));
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Revenue created successfully",
        });
        form.resetFields();
        setProductItems([
          {
            product: "",
            quantity: 0, // Set your desired default quantity here
            price: 0, // Set your desired default price here
          },
        ]);
        setModalCreate(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error || "Revenue creation failed",
        });
      }
    }
  };
  const isProductNameUnique = (currentProductName, productItems) => {
    const productNames = productItems.map((item) => item.product);
    const duplicateCount = productNames.filter(
      (name) => name === currentProductName
    ).length;
    return duplicateCount <= 1;
  };
  return (
    <div className="p-4">
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
        dataSource={dataRevenue.revenue}
        loading={dataRevenue.loading}
        pagination={{ pageSize: 10 }}
        scroll={{
          x: 240,
        }}
      />
      <Modal
        title={
          <p className="text-lg">{editData ? "Edit Sales" : "Add Sales"}</p>
        }
        open={modalCreate}
        centered
        onCancel={() => onModalCreateClose()}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item name="date" label="Date">
            <DatePicker defaultValue={dayjs()} format={"DD/MM/YYYY"} />
          </Form.Item>
          {productItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Form.Item
                name={`product-${index}`}
                label="Product"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "Product name is required",
                  },
                  {
                    validator: (_, value) => {
                      if (!isProductNameUnique(value, productItems)) {
                        return Promise.reject("Product name must be unique");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <AutoComplete
                  placeholder="Type a product name"
                  allowClear={false}
                  options={dataProducts.products.map((product) => ({
                    value: product.name,
                  }))}
                  filterOption={true}
                  className="w-full"
                  onChange={(value) => handleProductChange(value, index)}
                />
              </Form.Item>
              <Form.Item
                name={`quantity-${index}`}
                label="Quantity"
                rules={[
                  {
                    required: true,
                    message: "Please input product's quantity",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  onChange={(value) => {
                    const productName = form.getFieldValue(`product-${index}`);
                    const price = calculatePrice(value, productName);
                    const updatedProductItems = [...productItems];
                    updatedProductItems[index] = {
                      ...updatedProductItems[index],
                      quantity: value,
                    };
                    setProductItems(updatedProductItems);
                    form.setFieldsValue({ [`price-${index}`]: `Rp ${price}` });
                    form.setFieldsValue({ totalPrice: calculateTotalPrice() });
                  }}
                />
              </Form.Item>
              <Form.Item name={`price-${index}`} label="Price">
                <Input className="w-full" disabled />
              </Form.Item>
              <div className="flex items-center">
                <Button
                  icon={<AiOutlineClose />}
                  type="danger"
                  onClick={() => index > 0 && removeProductItem(index)}
                />
              </div>
            </div>
          ))}
          <Form.Item name="totalPrice" label="Total Price">
            <Input value={0} disabled />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => addProductItem()}>Add a New Product</Button>
          </Form.Item>
          <Form.Item>
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

export default Revenue;
