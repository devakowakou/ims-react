# Inventory Management System (IMS)

A modern, responsive web-based inventory management system built with React and Tailwind CSS. Designed for businesses to efficiently track products, suppliers, categories, and transactions.

## 🌟 Features

- **Dashboard**: Real-time overview of inventory metrics, sales trends, and stock alerts.
- **Product Management**: Add, edit, delete, and search products with image support.
- **Supplier Management**: Maintain supplier information and relationships.
- **Category Management**: Organize products into customizable categories.
- **Transaction Tracking**: Record and monitor purchases and sales.
- **User Authentication**: Secure login and role-based access (Admin/User).
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Data Visualization**: Interactive charts for sales, purchases, and category distribution.

## 🏗️ Architecture

- **Frontend**: React 18 with Vite for fast development and building.
- **Styling**: Tailwind CSS for utility-first, responsive design.
- **State Management**: React hooks (useState, useEffect, useContext).
- **HTTP Client**: Axios for API communication.
- **Routing**: React Router for client-side navigation.
- **Charts**: Recharts for data visualization.
- **Icons**: Lucide React for consistent iconography.
- **Backend API**: Communicates with a separate Node.js/Express API (production: `https://inventory-backend-dev.onrender.com`, development: `http://localhost:5050`).

**Note**: The application requires the backend API to be running for full functionality. If the API is unavailable, the dashboard will display default/empty values.

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Package Manager** | pnpm |
| **HTTP Client** | Axios |
| **Routing** | React Router |
| **Charts** | Recharts |
| **Icons** | Lucide React |

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.x or higher.
- **pnpm**: Version 8.x or higher.
- **Backend API**: Ensure the backend server is running on `http://localhost:5050`.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/devakowakou/ims-react.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd ims-react
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

### Development

1. **Start the development server**:
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:5173` (or the next available port).

2. **Open your browser** and navigate to the provided URL.

### Building for Production

1. **Create a production build**:
   ```bash
   pnpm build
   ```
   The build output will be located in the `dist` directory.

2. **Preview the production build** (optional):
   ```bash
   pnpm preview
   ```

## 🔧 Environment Configuration

The application automatically connects to the appropriate backend API based on the environment:

- **Production**: Uses `https://inventory-backend-dev.onrender.com/api`
- **Development**: Uses `http://localhost:5050/api` (or the URL specified in `VITE_API_URL`)

### Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Development API URL (optional, defaults to localhost:5050)
VITE_API_URL=http://localhost:5050/api
```

**Note**: The `.env` file is gitignored and should not be committed to version control.

## 📁 Project Structure

```
ims-react/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components (Dashboard, etc.)
│   ├── service/           # API services and utilities
│   ├── layout/            # Layout components
│   └── ...                # Other source files
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

## 🚨 Troubleshooting

- **Dashboard shows empty data**: 
  - In development: Ensure the backend API is running on `http://localhost:5050`
  - In production: The app should connect to `https://inventory-backend-dev.onrender.com/api` automatically
- **Authentication issues**: Check that your token is valid in localStorage.
- **Build errors**: Verify Node.js and pnpm versions match requirements.
- **API connection issues**: Check that `VITE_API_URL` is set correctly in your `.env` file for development.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📄 License

This project is private and not licensed for public use.

## 👥 Support

For questions or issues, please contact the development team.

---

Built with ❤️ using React and modern web technologies.
