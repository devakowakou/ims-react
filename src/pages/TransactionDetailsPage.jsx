import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const TransactionDetailsPage = () => {
  const { isDarkTheme } = useTheme();
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const transactionData = await ApiService.getTransactionById(transactionId);

        if (transactionData.status === 200) {
            setTransaction(transactionData.transaction);
            setStatus(transactionData.transaction.status);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting a transaction: " + error
        );
      }
    };

    getTransaction();
  }, [transactionId]);

  //update transaction status
  const handleUpdateStatus = async()=>{
    try {
        ApiService.updateTransactionStatus(transactionId, status);
        navigate("/transaction")
    } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Updating a transactions: " + error
        );
    }
  }

  //Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return(
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className={`transaction-details-page ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        {transaction && (
           <>
           {/* Transaction base information */}
           <div className="section-card">
                <div className="card-header">
                  <h2>📊 Transaction Information</h2>
                  <div className="status-indicator">
                    <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Type:</label>
                      <span className="type-value">{transaction.transactionType}</span>
                    </div>
                    <div className="info-item">
                      <label>Status:</label>
                      <span className={`status-value ${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Description:</label>
                      <span>{transaction.description}</span>
                    </div>
                    <div className="info-item">
                      <label>Note:</label>
                      <span>{transaction.note}</span>
                    </div>
                    <div className="info-item">
                      <label>Total Products:</label>
                      <span className="highlight">{transaction.totalProducts}</span>
                    </div>
                    <div className="info-item">
                      <label>Total Price:</label>
                      <span className="price-highlight">${transaction.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <label>Created At:</label>
                      <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                    </div>
                    {transaction.updatedAt && (
                    <div className="info-item">
                      <label>Updated At:</label>
                      <span>{new Date(transaction.updatedAt).toLocaleString()}</span>
                    </div>
                    )}
                  </div>
                </div>
           </div>

           {/* Product information of the transaction */}
           <div className="section-card">
                <h2>📦 Product Information</h2>
                <div className="card-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Name:</label>
                      <span>{transaction.product.name}</span>
                    </div>
                    <div className="info-item">
                      <label>SKU:</label>
                      <span className="sku-value">{transaction.product.sku}</span>
                    </div>
                    <div className="info-item">
                      <label>Price:</label>
                      <span className="price-value">${transaction.product.price.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <label>Stock Quantity:</label>
                      <span className="stock-value">{transaction.product.stockQuantity}</span>
                    </div>
                    <div className="info-item full-width">
                      <label>Description:</label>
                      <span>{transaction.product.description}</span>
                    </div>
                  </div>
                  {transaction.product.imageUrl && (
                    <div className="image-container">
                      <img 
                        src={transaction.product.imageUrl} 
                        alt={transaction.product.name} 
                        className="product-image"
                      />
                    </div>
                  )}
                </div>
           </div>

           {/* User information who made the transaction */}
           <div className="section-card">
                <h2>👤 User Information</h2>
                <div className="card-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Name:</label>
                      <span>{transaction.user.name}</span>
                    </div>
                    <div className="info-item">
                      <label>Email:</label>
                      <span className="email-value">{transaction.user.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Phone Number:</label>
                      <span>{transaction.user.phoneNumber}</span>
                    </div>
                    <div className="info-item">
                      <label>Role:</label>
                      <span className="role-badge">{transaction.user.role}</span>
                    </div>
                  </div>
                </div>
           </div>

           {/* Supplier information who made the transaction */}
           {transaction.suppliers && (
           <div className="section-card">
                <h2>🏢 Supplier Information</h2>
                <div className="card-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Name:</label>
                      <span>{transaction.supplier.name}</span>
                    </div>
                    <div className="info-item">
                      <label>Contact Address:</label>
                      <span>{transaction.supplier.contactInfo}</span>
                    </div>
                    <div className="info-item full-width">
                      <label>Address:</label>
                      <span>{transaction.supplier.address}</span>
                    </div>
                  </div>
                </div>
           </div>
           )}

           {/* UPDATE TRANSACTION STATUS */}
           <div className="section-card status-update-card">
              <h2>🔄 Update Status</h2>
              <div className="status-update-container">
                <div className="status-select-group">
                  <label>Current Status:</label>
                  <select 
                    value={status}
                    onChange={(e)=> setStatus(e.target.value)}
                    className="status-select"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <button onClick={()=>handleUpdateStatus()} className="update-status-btn">
                  Update Status
                </button>
              </div>
           </div>
           </>
        )}
      </div>
    </Layout>
  )
};

export default TransactionDetailsPage;