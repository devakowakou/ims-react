import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";
import { useTheme } from '../context/ThemeContext';

const ProductPage = () => {
  const { isDarkTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Pagination Set-Up
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productData = await ApiService.getAllProducts();

        if (productData.status === 200) {
          setTotalPages(Math.ceil(productData.products.length / itemsPerPage));

          setProducts(
            productData.products.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Products: " + error
        );
      }
    };

    getProducts();
  }, [currentPage]);

  // Delete a product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this Product?")) {
      try {
        await ApiService.deleteProduct(productId);
        showMessage("Product successfully Deleted");
        window.location.reload(); // reload page
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error Deleting a product: " + error
        );
      }
    }
  };

  // Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className={`product-page ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <div className="product-container">
          <div className="product-header">
            <div className="header-content">
              <h1>🎯 Products</h1>
              <p>Manage your product inventory with ease</p>
            </div>
            <button
              className="add-product-btn"
              onClick={() => navigate("/add-product")}
            >
              <span className="btn-icon">✨</span>
              Add New Product
            </button>
          </div>

          {products && products.length > 0 ? (
            <div className="product-list">
              {products.map((product) => (
                <div key={product.id} className="product-item">
                  <div className="product-image-container">
                    <img
                      className="product-image"
                      src={product.imageUrl || '/default-product.png'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/default-product.png';
                      }}
                    />
                    <div className={`stock-badge ${product.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                    </div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-details">
                      <div className="detail-row">
                        <span className="detail-label">SKU:</span>
                        <span className="sku-value">{product.sku}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Price:</span>
                        <span className="price-value">${product.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                    >
                      <span className="action-icon">✏️</span>
                      Edit
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteProduct(product.id)}
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
              <div className="empty-icon">📦</div>
              <h3>No Products Found</h3>
              <p>Get started by adding your first product</p>
              <button 
                className="add-first-btn"
                onClick={() => navigate("/add-product")}
              >
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Layout>
  );
};
export default ProductPage;