import { useCallback, useEffect} from "react"
import {LineChart, Line, XAxis, YAxis,  Tooltip, Label, ResponsiveContainer} from 'recharts'
import { useDispatch, useSelector } from "react-redux"
import dayjs from "dayjs"
import { getProducts } from "../Stocks/productSlice"
import { getRevenue } from "../RevenuePage/revenueSlice"
import { Card } from "antd"
import {MdLocalPharmacy} from "react-icons/md"
import {FaSackDollar} from 'react-icons/fa6'
import {TbCategory} from 'react-icons/tb'
import {FaTrophy} from 'react-icons/fa'
const OverviewPage = () => {
  const dispatch=useDispatch()
  const productsData = useSelector(state=> state.product)
  const revenueData = useSelector(state=> state.revenue)
  const setCategory = new Set()

  if(revenueData){
    for(const category of productsData.products){
      if(!setCategory.has(category.category)){
        setCategory.add(category.category)
      }
    }
  }
  
  const totalProduct = productsData && productsData.products.length
  const totalProductCategory = setCategory && setCategory.size
  const totalRevenue =
  revenueData && revenueData.revenue.length > 0
    ? revenueData.revenue
        .map((e) => parseFloat(e.price.replace('Rp', '')))
        .reduce((i, e) => i + e)
    : 0;

  //Data for Chart
  const chartData = new Map()
  revenueData.revenue.forEach(rev=>{
    const date = dayjs(rev.date, 'DD/MM/YYYY').format('DD/MM/YYYY')
    const price = parseFloat(rev.price.replace('Rp',''))
    if(!chartData.has(date)){
      chartData.set(date,0)
    }

    chartData.set(date,chartData.get(date)+price)
  })

  const sortedChartDataArray = Array.from(chartData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const dataLineChart=[]
  for(const singleIndex of sortedChartDataArray){
    dataLineChart.push({date:singleIndex[0], price:singleIndex[1]})
  }

//Get Most Sold Product
//1.Get Quantities First
  const productQuantities=new Map()
  revenueData.revenue.forEach(rev => {
    rev.products.forEach(product=>{
      const productName = product.name
      const productQuantity = product.quantity 
      if(!productQuantities.has(productName)){
        productQuantities.set(productName,0)
      }

      productQuantities.set(productName, productQuantities.get(productName)+productQuantity)

    })
  })

//2.Get the name
let mostSoldProduct = null;
let maxQuantity = 0;

for (const [productName, quantity] of productQuantities) {
  if (quantity > maxQuantity) {
    mostSoldProduct = productName;
    maxQuantity = quantity;
  }
}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = useCallback(async()=>{
    dispatch(getProducts())
    dispatch(getRevenue())
  })

  useEffect(()=>{
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <div className="p-4">
      <div className="flex gap-2 flex-wrap">
        <Card
          // style={{
          //   width: 300,
          // }}
          className="flex-grow"
        >
          <div className="flex justify-center items-center gap-2 font-poppins ">
            <div className="bg-[#EDF5F5] p-2 rounded-lg">
              <MdLocalPharmacy size={25} className="text-[#98BDBC]"/>
            </div>
            <div className="text-lg">
              <p className="font-bold">Total Products</p>
              <p>{totalProduct}</p>
            </div>
          </div>
          
        </Card>
        <Card
          // style={{
          //   width: 300,
          // }}
          className="flex-grow"
        >
          <div className="flex justify-center items-center gap-2 font-poppins">
            <div className="bg-[#F9E0D8] p-2 rounded-lg">
              <TbCategory size={25} className="text-[#E9967B]"/>
            </div>
            <div className="text-lg">
              <p className="font-bold">Total Categories</p>
              <p>{totalProductCategory}</p>
            </div>
          </div>
          
        </Card>
        <Card
          // style={{
          //   width: 300,
          // }}
          className="flex-grow"
        >
          <div className="flex justify-center items-center gap-2 font-poppins">
            <div className="bg-[#E2FF54] p-2 rounded-lg">
              <FaSackDollar size={25} className="text-[#00952A]"/>
            </div>
            <div className="text-lg">
              <p className="font-bold">Total Revenue</p>
              <p>Rp {totalRevenue}</p>
            </div>
          </div>
          
        </Card>
        <Card
          // style={{
          //   width: 300,
          // }}
          className="flex-grow"
        >
          <div className="flex justify-center items-center gap-2 font-poppins">
            <div className="bg-[#ECF6FD] p-2 rounded-lg">
              <FaTrophy size={25} className="text-[#74C5DF]"/>
            </div>
            <div className="text-lg">
              <p className="font-bold">Most Sold Product</p>
              <p>{mostSoldProduct}</p>
            </div>
          </div>
          
        </Card>
      </div>
      <Card className="mt-3">
        <p className="font-poppins text-lg mb-2 font-bold">Revenue by Date</p>
        <ResponsiveContainer width="100%" height={380}>
          <LineChart className="w-full h-full" data={dataLineChart} >
            <XAxis dataKey="date" type="category">
              <Label value="Date" position="insideBottom" offset={0} /> {/* X-axis label */}
            </XAxis>
            <Tooltip />
            <YAxis label={{ value: 'Price (Rp)', angle: -90, position: 'insideLeft' , offset:0}}/>
            <Line type="monotone" dataKey="price" stroke="#00A32E" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

export default OverviewPage