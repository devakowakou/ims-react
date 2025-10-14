import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";
import { useTheme } from "../context/ThemeContext";

const TransactionsPage = () => {
  const { isDarkTheme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");

  const navigate = useNavigate();

  //Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const transactionData = await ApiService.getAllTransactions(valueToSearch);

        if (transactionData.status === 200) {
          setTotalPages(Math.ceil(transactionData.transactions.length / itemsPerPage));

          setTransactions(
            transactionData.transactions.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting transactions: " + error
        );
      }
    };

    getTransactions();
  }, [currentPage, valueToSearch]);

  //Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  //handle search
  const handleSearch = () =>{
    console.log("Search hit")
    console.log("FILTER IS: " + filter)
    setCurrentPage(1)
    setValueToSearch(filter)
  }

  //Navigate to transactions details page
  const navigateToTransactionDetailsPage = (transactionId) =>{
    navigate(`/transaction/${transactionId}`);
  }

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: { bg: '#fef3c7', text: '#92400e' },
      PROCESSING: { bg: '#dbeafe', text: '#1e40af' },
      COMPLETED: { bg: '#d1fae5', text: '#065f46' },
      CANCELLED: { bg: '#fee2e2', text: '#991b1b' }
    };
    
    const colors = statusColors[status] || { bg: '#f3f4f6', text: '#374151' };
    
    return (
      <span 
        className="status-badge"
        style={{ 
          backgroundColor: colors.bg, 
          color: colors.text 
        }}
      >
        {status}
      </span>
    );
  };

  // Type badge styling
  const getTypeBadge = (type) => {
    const typeColors = {
      PURCHASE: { bg: '#e0f2fe', text: '#0369a1' },
      SALE: { bg: '#f0fdf4', text: '#166534' }
    };
    
    const colors = typeColors[type] || { bg: '#f3f4f6', text: '#374151' };
    
    return (
      <span 
        className="type-badge"
        style={{ 
          backgroundColor: colors.bg, 
          color: colors.text 
        }}
      >
        {type}
      </span>
    );
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className={`transactions-page ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <div className="transactions-header">
          <div className="header-content">
            <h1>Transaction History</h1>
            <p>Manage and monitor all your transactions</p>
          </div>
          <div className="transaction-search">
            <div className="search-container">
              <input 
                placeholder="Search transactions..."
                value={filter}
                onChange={(e)=> setFilter(e.target.value)}
                type="text"
                className="search-input"
              />
              <button onClick={()=> handleSearch()} className="search-btn">
                <span className="search-icon">🔍</span>
                Search
              </button>
            </div>
          </div>
        </div>

        {transactions && 
          <div className="table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>STATUS</th>
                  <th>TOTAL PRICE</th>
                  <th>TOTAL PRODUCTS</th>
                  <th>DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="table-row">
                    <td>{getTypeBadge(transaction.transactionType)}</td>
                    <td>{getStatusBadge(transaction.status)}</td>
                    <td className="price-cell">${transaction.totalPrice}</td>
                    <td className="quantity-cell">{transaction.totalProducts}</td>
                    <td className="date-cell">{new Date(transaction.createdAt).toLocaleString()}</td>
                    <td>
                      <button 
                        onClick={()=> navigateToTransactionDetailsPage(transaction.id)}
                        className="view-details-btn"
                      >
                        <span className="btn-icon">👁️</span>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Layout>
  );
};
export default TransactionsPage;