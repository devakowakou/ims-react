import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../component/ThemeToggle";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const DashboardPage = () => {
  const { isDarkTheme } = useTheme();
  const [message, setMessage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedData, setSelectedData] = useState("amount");
  const [activeButton, setActiveButton] = useState("amount");
  const [transactionData, setTransactionData] = useState([]);

  // Your existing useEffect and data transformation functions remain the same
  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionResponse = await ApiService.getAllTransactions();
        if (transactionResponse.status === 200) {
          setTransactionData(
            transformTransactionData(
              transactionResponse.transactions,
              selectedMonth,
              selectedYear
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Loggin in a User: " + error
        );
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear, selectedData]);

  const transformTransactionData = (transactions, month, year) => {
    const dailyData = {};
    const daysInMonths = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonths; day++) {
      dailyData[day] = {
        day,
        count: 0,
        quantity: 0,
        amount: 0,
      };
    }

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();

      if (transactionMonth === month && transactionYear === year) {
        const day = transactionDate.getDate();
        dailyData[day].count += 1;
        dailyData[day].quantity += transaction.totalProducts;
        dailyData[day].amount += transaction.totalPrice;
      }
    });
    
    return Object.values(dailyData);
  };

  const getLineColor = (dataType) => {
    const colors = {
      count: isDarkTheme ? '#818cf8' : '#6366f1',
      quantity: isDarkTheme ? '#fbbf24' : '#f59e0b',
      amount: isDarkTheme ? '#34d399' : '#10b981'
    };
    return colors[dataType] || (isDarkTheme ? '#818cf8' : '#6366f1');
  };

  const handleButtonClick = (dataType) => {
    setSelectedData(dataType);
    setActiveButton(dataType);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className={`dashboard-page ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        {/* Theme Toggle - Now properly positioned */}
        <div className="theme-toggle-container">
          <ThemeToggle />
        </div>

        {/* Centered Header Section */}
        <div className="dashboard-header">
          <h1>Transaction Analytics</h1>
          <p>Monitor your daily transaction metrics</p>
        </div>

        {/* Rest of your dashboard JSX remains the same */}
        <div className="button-group">
          <button 
            className={activeButton === "count" ? "active" : ""}
            onClick={() => handleButtonClick("count")}
          >
            <span className="button-icon">📊</span>
            Total Transactions
          </button>
          <button 
            className={activeButton === "quantity" ? "active" : ""}
            onClick={() => handleButtonClick("quantity")}
          >
            <span className="button-icon">📦</span>
            Product Quantity
          </button>
          <button 
            className={activeButton === "amount" ? "active" : ""}
            onClick={() => handleButtonClick("amount")}
          >
            <span className="button-icon">💰</span>
            Amount
          </button>
        </div>

        <div className="dashboard-content">
          <div className="filter-section">
            <div className="filter-group">
              <label htmlFor="month-select">Select Month:</label>
              <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="year-select">Select Year:</label>
              <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="chart-section">
            <div className="chart-container">
              <div className="chart-header">
                <h3>Daily Transactions - {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: getLineColor(selectedData)}}></div>
                    <span>{selectedData.charAt(0).toUpperCase() + selectedData.slice(1)}</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={transactionData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={isDarkTheme ? '#374151' : '#f1f5f9'} 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="day" 
                    stroke={isDarkTheme ? '#d1d5db' : '#64748b'}
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={isDarkTheme ? '#d1d5db' : '#64748b'}
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkTheme ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDarkTheme ? '#374151' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px',
                      color: isDarkTheme ? '#f9fafb' : '#1f2937'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone"
                    dataKey={selectedData}
                    stroke={getLineColor(selectedData)}
                    strokeWidth={3}
                    dot={{ fill: getLineColor(selectedData), strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: getLineColor(selectedData) }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;