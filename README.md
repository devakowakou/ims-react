# Inventory Management System

This is a web-based inventory management system built with React. It allows users to manage products, suppliers, categories, and track inventory through purchases and sales.

## Features

*   **Dashboard:** Overview of key inventory metrics.
*   **Product Management:** Add, edit, and delete products.
*   **Supplier Management:** Manage supplier information.
*   **Category Management:** Organize products into categories.
*   **Transaction Tracking:** Record purchases and sales.
*   **Responsive Design:** Fully responsive for use on desktops, tablets, and mobile devices.

## Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS
*   **Package Manager:** pnpm

## Getting Started

### Prerequisites

*   Node.js (v18.x or higher)
*   pnpm (v8.x or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/devakowakou/ims-react.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd ims-react
    ```
3.  Install dependencies using `pnpm`:
    ```bash
    pnpm install
    ```

### Running the Development Server

To start the development server, run the following command:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173` or another port if 5173 is busy.

### Building for Production

To create a production build of the application, run:

```bash
pnpm build
```

The build output will be located in the `dist` directory.
