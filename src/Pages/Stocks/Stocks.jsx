import { useEffect, useState } from "react"
import { Button, Table, Modal, Form, Input,InputNumber } from 'antd';
import { useDispatch, useSelector } from "react-redux"
import {AiOutlinePlus} from 'react-icons/ai'
import { getProducts, createProducts, updateProducts, deleteProduct } from "./productSlice"
import Swal from "sweetalert2";
const Stocks = () => {
  const [modalCreate,setModalCreate]=useState(false)
  const [modalEdit,setModalEdit]=useState(false)
  const [editProductData, setEditProductData] = useState(null)
  const dispatch=useDispatch()  
  const {loading,products,error}=useSelector((state) => state.product)
  // const [id,setId]=useState(null)
  const [form] = Form.useForm()
  const columns=[
    {
      title:'Name',
      key:'name',
      sorter:(a,b)=>a.name.length-b.name.length,
      dataIndex:'name'
    },{
      title:'Category',
      key:'category',
      sorter:(a,b)=>a.category.length-b.category.length,
      dataIndex:'category',
    },{
      title:'Price',
      dataIndex:'price',
      sorter:(a,b)=>a.price-b.price,
      key:'stock',
      render: (price)=><p>Rp {price}</p>
    },{
      title:'Stock',
      key:'stock',
      sorter:(a,b)=>a.stock-b.stock,
      dataIndex: 'stock',
    },{
      title:'Action',
      key:'action',
      render:(text,record)=>(
        <div className="flex gap-1">
          <Button type="primary" className="bg-primary-green"  onClick={() => {handleEditButton(record)}}>Edit</Button>
          <Button  type="primary" danger  onClick={()=>handleDeletProduct(record)}>Delete</Button>
        </div>
      )
    }
  ]

  useEffect(()=>{
    dispatch(getProducts())
  },[dispatch])

 const handleCreateButton=()=>{
  setModalCreate(true)
 }
 const handleCloseCreateModal=()=>{
  setModalCreate(false)
 }

 const handleSubmitProduct = (values) => {
  try {
    dispatch(createProducts(values)); 
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Product created successfully',
    });

    setModalCreate(false);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error ||  'Product creation failed',
    });
  }
 }

 const handleEditButton = (product) => {
  setEditProductData(product); 
  setModalEdit(true);
  form.setFieldsValue({ 
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
  });
  // setId(product.id)
};
const handleEditCloseModal = () => {
  setEditProductData(null);
  form.resetFields(); 
  setModalEdit(false); // Reset form fields // Clear edit product data// Close edit modal
};
const handleEditProduct = async (value)=>{
  try{
    dispatch(updateProducts({id:editProductData.id,data:value}))
      setModalEdit(false) 
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product edited successfully',
      });
  }catch(error){
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: error ||  'Product creation failed',
    });
  }
      
}
const handleDeletProduct = (product) =>{
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this product!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel',
  }).then((result) => {
    if (result.isConfirmed) {      
      try{
        dispatch(deleteProduct(product.id))
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Product deleted successfully',
        });
      }catch(error){
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error ||  'Product deleted failed',
        });
      }
    } else {
      Swal.fire('Cancelled', 'Your product is safe :)', 'error');
    }
  });
}
  return (
    <div>
      {!loading && error && <p>{error}</p>}
      {!loading && !error && products && 
        <div className="p-4" >
          <Button type="primary" icon={<AiOutlinePlus/>} size={30} onClick={handleCreateButton} className="bg-primary-green px-4 py-5 text-md font-poppins font-bold flex justify-center items-center mb-3">Tambah</Button>
          <Table 
            columns={columns} 
            dataSource={products} 
            loading={loading}
            pagination={{pageSize: 10}} 
            scroll={{
              x: 240,
            }}
            cellFontSizeMD={100}
          />
         <Modal
            title={<p className="text-lg">Add Product</p>}
            open={modalCreate}
            // onOk={handleCloseCreateModal}
            centered
            // confirmLoading={confirmLoading}
            onCancel={handleCloseCreateModal}
            footer={null}
          >
            <Form layout="vertical" onFinish={handleSubmitProduct}>
              <Form.Item name="name" label="Name" rules={[
                {
                  required: true,
                  message: "Please input product's name",
                },
              ]}>
                <Input placeholder="Enter Product's Name" className="py-2" />
              </Form.Item>
              <Form.Item name="category" label="Category" rules={[
                {
                  required: true,
                  message: "Please input product's category",
                },
              ]}>
                <Input placeholder="Enter Product's Category" className="py-2" />
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[
                {
                  required: true,
                  message: "Please input product's price",
                },{
                  validator: (_, value) => {
                    if (value && !Number.isInteger(Number(value))) {
                      return Promise.reject('Please enter a valid integer');
                    }
                    return Promise.resolve();
                  },
                },
              ]} >
                <Input placeholder="Enter Product's Price"  className="py-2" />
              </Form.Item>
              <Form.Item name="stock" label="Stock" rules={[
                {
                  required: true,
                  message: "Please input product's stock",
                },
              ]} >
                <InputNumber className="w-full py-2" min={1} />
              </Form.Item>
              <Form.Item className="flex flex-row-reverse">
                <Button  htmlType="submit" type='primary' className='bg-primary-green py-6 font-poppins flex items-center justify-center'>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title={<p className="text-lg">Edit Product</p>}
            open={modalEdit}
            centered
            onCancel={handleEditCloseModal}
            footer={null}
          >
            {/* Populate the form fields with the editProductData */}
            {editProductData && (
              <Form layout="vertical" form={form} onFinish={handleEditProduct}>
                <Form.Item
                  name="name"
                  label="Name"
                  value
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
                  rules={[
                    {
                      required: true,
                      message: "Please input product's category",
                    },
                  ]}
                >
                  <Input placeholder="Enter Product's Category"  className="py-2" />
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
            )}
          </Modal>
        </div>
      }
    </div>
  )
}

export default Stocks