import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';

const SupplierPage = () => {
  const { isDarkTheme } = useTheme();
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // fetch all suppliers
    const getSuppliers = async () => {
      try {
        const responseData = await ApiService.getAllSuppliers();
        if (responseData.status === 200) {
          setSuppliers(responseData.suppliers);
        } else {
          showMessage(responseData.message);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Suppliers: " + error
        );
        console.log(error);
      }
    };
    getSuppliers();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  // Delete Supplier
  const handleDeleteSupplier = async (supplierId) => {
    try {
      if (window.confirm("Are you sure you want to delete this supplier? ")) {
        await ApiService.deleteSupplier(supplierId);
        window.location.reload();
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Deleting a Suppliers: " + error
      );
    }
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className={`supplier-page ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <div className="supplier-container">
          <div className="supplier-header">
            <div className="header-content">
              <h1>🏢 Suppliers</h1>
              <p>Manage your supplier network</p>
            </div>
            <div className="add-sup">
              <button 
                onClick={() => navigate("/add-supplier")}
                className="add-supplier-btn"
              >
                <span className="btn-icon">+</span>
                Add Supplier
              </button>
            </div>
          </div>

          {suppliers && suppliers.length > 0 ? (
            <div className="suppliers-grid">
              {suppliers.map((supplier) => (
                <div className="supplier-card" key={supplier.id}>
                  <div className="supplier-content">
                    <div className="supplier-icon">🏢</div>
                    <div className="supplier-info">
                      <h3 className="supplier-name">{supplier.name}</h3>
                      <div className="supplier-details">
                        <div className="detail-item">
                          <span className="detail-label">Contact:</span>
                          <span className="detail-value">{supplier.contactInfo}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Address:</span>
                          <span className="detail-value">{supplier.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="supplier-actions">
                    <button 
                      onClick={() => navigate(`/edit-supplier/${supplier.id}`)}
                      className="edit-btn"
                    >
                      <span className="action-icon">✏️</span>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteSupplier(supplier.id)}
                      className="delete-btn"
                    >
                      <span className="action-icon">🗑️</span>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <h3>No Suppliers Found</h3>
              <p>Start by adding your first supplier</p>
              <button 
                className="add-first-btn"
                onClick={() => navigate("/add-supplier")}
              >
                Add Your First Supplier
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SupplierPage;