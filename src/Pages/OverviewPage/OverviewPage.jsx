import { useCallback, useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import dayjs from "dayjs";
import { getProducts } from "../Stocks/productSlice";
import { getRevenue } from "../RevenuePage/revenueSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Card, Spin } from "antd";
import { MdLocalPharmacy } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { TbCategory } from "react-icons/tb";
import { BiSolidFileJpg, BiSolidFilePdf } from "react-icons/bi";
import { FaTrophy } from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig";

const OverviewPage = () => {
  const dispatch = useDispatch();
  const productsData = useSelector((state) => state.product);
  const revenueData = useSelector((state) => state.revenue);
  const [download, setDownload] = useState(false);
  const [filteredData, setFilteredData] = useState(revenueData.revenue);
  const ellipsisButtonRef = useRef(null);
  const setCategory = new Set();
  if (revenueData) {
    for (const category of productsData.products) {
      if (!setCategory.has(category.category)) {
        setCategory.add(category.category);
      }
    }
  }

  const totalProduct = productsData && productsData.products.length;
  const totalProductCategory = setCategory && setCategory.size;
  const totalRevenue =
    revenueData && revenueData.revenue.length > 0
      ? revenueData.revenue
          .map((e) => parseFloat(e.price.replace("Rp", "")))
          .reduce((i, e) => i + e)
      : 0;

  //Get Most Sold Product
  //1.Get Quantities First
  const productQuantities = new Map();
  revenueData.revenue.forEach((rev) => {
    rev.products.forEach((product) => {
      const productName = product.name;
      const productQuantity = product.quantity;
      if (!productQuantities.has(productName)) {
        productQuantities.set(productName, 0);
      }

      productQuantities.set(
        productName,
        productQuantities.get(productName) + productQuantity
      );
    });
  });

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
  const fetchData = useCallback(async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(getProducts(user.uid));
        dispatch(getRevenue(user.uid));
      }
    });
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilteredData(revenueData.revenue);
    if (download) {
      document.addEventListener("mousedown", closeDownloadOptions);
      ellipsisButtonRef.current.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });
    } else {
      document.removeEventListener("mousedown", closeDownloadOptions);
    }

    return () => {
      document.removeEventListener("mousedown", closeDownloadOptions);
    };
  }, [revenueData.revenue, download]);
  const closeDownloadOptions = () => {
    setDownload(false);
  };

  const handleTimePreferenceChange = (value) => {
    const currentDate = dayjs();
    let filteredData = revenueData.revenue;
    console.log(
      revenueData.revenue.filter((rev) =>
        dayjs(rev.date, "DD/MM/YYYY").isSame(currentDate, "day")
      )
    );

    if (value === "today") {
      filteredData = revenueData.revenue.filter((rev) =>
        dayjs(rev.date, "DD/MM/YYYY").isSame(currentDate, "day")
      );
    } else if (value === "yesterday") {
      filteredData = revenueData.revenue.filter((rev) =>
        dayjs(rev.date, "DD/MM/YYYY").isSame(
          currentDate.subtract(1, "day"),
          "day"
        )
      );
    } else if (value === "lastWeek") {
      filteredData = revenueData.revenue.filter((rev) =>
        dayjs(rev.date, "DD/MM/YYYY").isAfter(currentDate.subtract(1, "week"))
      );
    } else if (value === "lastMonth") {
      filteredData = revenueData.revenue.filter((rev) =>
        dayjs(rev.date, "DD/MM/YYYY").isAfter(currentDate.subtract(1, "month"))
      );
    } else if (value === "all") {
      filteredData = revenueData.revenue;
    }
    setFilteredData(filteredData);
  };
  //  Data for Chart
  const chartData = new Map();

  filteredData.forEach((rev) => {
    const date = dayjs(rev.date, "DD/MM/YYYY").format("DD/MM/YYYY");
    const price = parseFloat(rev.price.replace("Rp", ""));
    if (!chartData.has(date)) {
      chartData.set(date, 0);
    }

    chartData.set(date, chartData.get(date) + price);
  });

  const sortedChartDataArray = Array.from(chartData.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  const dataLineChart = [];
  for (const singleIndex of sortedChartDataArray) {
    dataLineChart.push({ date: singleIndex[0], revenue: singleIndex[1] });
  }

  //handle PDF
  const handlePDF = () => {
    const chartContainer = document.querySelector(".chart-container");
    if (chartContainer) {
      const dpi = window.devicePixelRatio || 1;
      const canvasOptions = {
        scale: dpi * 2,
      };
      html2canvas(chartContainer, canvasOptions).then((canvas) => {
        const pdf = new jsPDF("landscape");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        let pdfHeight;
        console.log("Chart Container Width:", chartContainer.offsetWidth);
        if (window.innerWidth < 640) {
          pdfHeight = 200;
        } else {
          pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        }

        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          10,
          10,
          pdfWidth - 20,
          pdfHeight - 20
        );

        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        window.open(pdfUrl, "_blank");

        URL.revokeObjectURL(pdfUrl);
      });
    }
  };
  //handle JPG
  const handleJPG = async () => {
    const chartContainer = document.querySelector(".chart-container");
    if (chartContainer) {
      try {
        const canvas = await html2canvas(chartContainer);
        const imageDataUrl = canvas.toDataURL("image/jpeg");
        const newTab = window.open();
        newTab.document.write(`<img src="${imageDataUrl}" />`);
      } catch (error) {
        //
      }
    }
  };

  return (
    <div className="max-[325px]:p-1 min-[326px]:p-4 ">
      <div className="flex gap-2 flex-wrap">
        <Card className="min-[500px]:flex-grow max-[500px]:w-full ">
          <div className="flex justify-center items-center gap-2 font-poppins ">
            <div className="bg-[#EDF5F5] max-[500px]:p-1 min-[500px]:p-2 rounded-lg">
              <MdLocalPharmacy className="text-[#98BDBC] text-s min-[376px]:text-3xl" />
            </div>
            <div className="text-xs md:text-lg">
              <p className="font-bold">Total Products</p>
              <p>{totalProduct !== 0 ? totalProduct : 0}</p>
            </div>
          </div>
        </Card>
        <Card className="min-[500px]:flex-grow max-[500px]:w-full">
          <div className="flex justify-center items-center gap-2 font-poppins">
            <div className="bg-[#F9E0D8] max-[500px]:p-1 min-[500px]:p-2 rounded-lg">
              <TbCategory className="text-[#E9967B] text-s min-[376px]:text-3xl" />
            </div>
            <div className="text-xs md:text-lg">
              <p className="font-bold">Total Categories</p>
              <p>{totalProductCategory !== 0 ? totalProductCategory : 0}</p>
            </div>
          </div>
        </Card>
        <Card className="min-[500px]:flex-grow max-[500px]:w-full ">
          <div className="flex justify-center items-center gap-2 font-poppins">
            <div className="bg-[#E2FF54] max-[500px]:p-1 min-[500px]:p-2 rounded-lg">
              <FaSackDollar className="text-[#00952A] text-s min-[376px]:text-3xl" />
            </div>
            <div className="text-xs md:text-lg">
              <p className="font-bold">Total Revenue</p>
              <p>Rp {totalRevenue !== 0 ? totalRevenue : 0}</p>
            </div>
          </div>
        </Card>
        <Card className="min-[500px]:flex-grow max-[500px]:w-full">
          <div className="flex justify-center items-center gap-2 font-poppins">
            <div className="bg-[#ECF6FD] max-[500px]:p-1 min-[500px]:p-2 rounded-lg">
              <FaTrophy className="text-[#74C5DF] text-s min-[376px]:text-3xl" />
            </div>
            <div className="text-xs md:text-lg">
              <p className="font-bold">Most Sold Product</p>
              <p>{mostSoldProduct ? mostSoldProduct : "-"}</p>
            </div>
          </div>
        </Card>
      </div>
      <Select
        defaultValue="all"
        style={{ width: 120 }}
        onChange={(value) => handleTimePreferenceChange(value)}
        className="mt-3"
        options={[
          {
            value: "all",
            label: "All Time",
          },
          {
            value: "today",
            label: "Today",
          },
          {
            value: "yesterday",
            label: "Yesterday",
          },
          {
            value: "lastWeek",
            label: "Last Week",
          },
          {
            value: "lastMonth",
            label: "Last Month",
          },
        ]}
      />
      {revenueData.loading ? (
        <div className="w-full flex flex-col justify-center items-center pt-10">
          <Spin size="small" /> <p>Loading Data...</p>
        </div>
      ) : filteredData.length !== 0 ? (
        <div className="relative">
          <Card className="mt-3 chart-container w-full">
            <p className="font-poppins max-[375px]:text-xs min-[500px]:text-lg mb-2 font-bold">
              Revenue by Date
            </p>
            <ResponsiveContainer height={380}>
              <LineChart className="h-full" data={dataLineChart}>
                <XAxis dataKey="date" type="category">
                  <Label value="Date" position="insideBottom" offset={0} />
                </XAxis>
                <Tooltip position={{ x: 0 }} />
                <YAxis
                  label={{
                    value: "Revenue (Rp)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#00A32E" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <div className="" ref={ellipsisButtonRef}>
            <button
              onClick={() => setDownload(!download)}
              className="text-lg font-bold font-poppins absolute top-6 right-6"
            >
              ...
            </button>
            <div
              className={`bg-white shadow-lg flex absolute top-12 right-6 flex-col rounded-md gap-1 transform transition-transform  transition-ease-in-out ${
                download ? "translate-y-2" : "-translate-y-2"
              }`}
            >
              <div
                onClick={handlePDF}
                className={`text-s font-poppins cursor-pointer p-2 flex hover:bg-slate-200 ${
                  download ? "visible" : "hidden"
                }`}
              >
                <BiSolidFilePdf size={20} />
                Download as PDF
              </div>
              <div
                onClick={handleJPG}
                className={`text-s font-poppins cursor-pointer p-2 flex hover:bg-slate-200 ${
                  download ? "visible" : "hidden"
                }`}
              >
                <BiSolidFileJpg size={20} />
                Download as JPG
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-center font-poppins text-lg">
          There is No Data
        </p>
      )}
    </div>
  );
};

export default OverviewPage;
