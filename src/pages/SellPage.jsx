import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useTheme } from '../context/ThemeContext';

const SellPage = () => {
  const { isDarkTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await ApiService.getAllProducts();
        setProducts(productData.products);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Getting Products: " + error
        );
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !quantity) {
      showMessage("Please fill in all required fields");
      return;
    }
    const body = {
      productId,
      quantity: parseInt(quantity),
    };

    try {
      const response = await ApiService.sellProduct(body);
      showMessage(response.message);
      resetForm();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Selling Product: " + error
      );
    }
  };

  const resetForm = () => {
    setProductId("");
    setDescription("");
    setNote("");
    setQuantity("");
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
      <div className={`purchase-form-page ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <div className="form-container">
          <div className="form-header">
            <div className="header-icon">💰</div>
            <h1>Sell Product</h1>
            <p>Process customer sales and update inventory</p>
          </div>
          
          <form onSubmit={handleSubmit} className="purchase-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Select Product *</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">Choose a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  placeholder="Enter quantity"
                  min="1"
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter sale description"
                />
              </div>

              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Additional notes or comments"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="reset-btn">
                <span className="btn-icon">🔄</span>
                Reset Form
              </button>
              <button type="submit" className="submit-btn sell">
                <span className="btn-icon">🚀</span>
                Sell Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
export default SellPage;