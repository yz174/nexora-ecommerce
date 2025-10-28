# Nexora Fashion

A full-stack shopping cart application built with React, Express, and SQLite, featuring the minimalist design aesthetic. This application demonstrates modern e-commerce functionality with product browsing, cart management, and checkout workflows.

## Features

- **Product Browsing**: View 5-10 products in a responsive grid layout with images, names, and prices
- **Shopping Cart**: Add products to cart with quantity selection
- **Cart Management**: Update quantities, remove items, and view real-time totals
- **Checkout Process**: Complete purchases with customer information (name and email)
- **Order Receipt**: View detailed order confirmation with order ID and timestamp
- **Responsive Design**: Optimized layouts for mobile, tablet, and desktop devices
- **Database Persistence**: Cart data persists across sessions using SQLite
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Stone Island Aesthetic**: Minimalist design with monochromatic colors and clean typography

## Tech Stack

**Frontend:**

- React 18+ with functional components and hooks
- Vite for fast development and optimized builds
- React Router v6 for client-side routing
- Axios for HTTP requests
- CSS Modules with Stone Island design tokens
- Responsive CSS Grid and Flexbox layouts

**Backend:**

- Node.js 18+ with Express framework
- SQLite database with better-sqlite3 driver
- CORS middleware for cross-origin requests
- Axios for Fake Store API integration
- Express JSON middleware for request parsing

**External APIs:**

- Fake Store API (fakestoreapi.com) for product data with fallback to mock data

## Architecture

The application follows a three-tier architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Product Grid │  │     Cart     │  │   Checkout   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                          │                                   │
│                   ┌──────▼──────┐                           │
│                   │ API Service │                           │
│                   └──────┬──────┘                           │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────────┐
│                    Express Backend                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Products   │  │     Cart     │  │   Checkout   │      │
│  │    Router    │  │    Router    │  │    Router    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────┐  ┌──────────────────────────────┐        │
│  │ Fake Store   │  │    Database Service          │        │
│  │     API      │  │    (CartItem Model)          │        │
│  └──────────────┘  └──────────────┬───────────────┘        │
└────────────────────────────────────┼──────────────────────────┘
                                     │
                          ┌──────────▼──────────┐
                          │   SQLite Database   │
                          │   (cart_items)      │
                          └─────────────────────┘
```

## Project Structure

```
vibe-commerce-cart/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── App.jsx              # Root component with routing
│   │   │   ├── App.css              # Global styles and design tokens
│   │   │   ├── ProductGrid.jsx      # Product listing component
│   │   │   ├── ProductGrid.css
│   │   │   ├── ProductCard.jsx      # Individual product display
│   │   │   ├── ProductCard.css
│   │   │   ├── Cart.jsx             # Shopping cart view
│   │   │   ├── Cart.css
│   │   │   ├── CartItem.jsx         # Cart item with quantity controls
│   │   │   ├── CartItem.css
│   │   │   ├── Checkout.jsx         # Checkout form and process
│   │   │   ├── Checkout.css
│   │   │   ├── ReceiptModal.jsx     # Order confirmation modal
│   │   │   ├── ReceiptModal.css
│   │   │   ├── ErrorBoundary.jsx    # Error boundary component
│   │   │   └── Header.jsx           # Navigation header
│   │   ├── services/
│   │   │   └── api.js               # API service layer with axios
│   │   └── main.jsx                 # Application entry point
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration with proxy
│   └── .env.example                 # Environment variable template
├── server/                          # Express backend application
│   ├── routes/
│   │   ├── products.js              # Product endpoints
│   │   ├── cart.js                  # Cart CRUD endpoints
│   │   └── checkout.js              # Checkout endpoint
│   ├── models/
│   │   └── CartItem.js              # CartItem database model
│   ├── config/
│   │   └── database.js              # SQLite database configuration
│   ├── server.js                    # Express server entry point
│   ├── package.json                 # Backend dependencies
│   ├── database.sqlite              # SQLite database file (generated)
│   └── .env.example                 # Environment variable template
├── .gitignore                       # Git ignore rules
├── README.md                        # This file
├── ERROR_HANDLING.md                # Error handling documentation
└── package.json                     # Root scripts for development
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** (optional, for cloning the repository)

Verify your installation:

```bash
node --version  # Should be v18.x or higher
npm --version   # Should be v9.x or higher
```

## Installation

### Quick Start

Install all dependencies for both client and server with a single command:

```bash
npm run install:all
```

This will install dependencies in the root, client, and server directories.

### Manual Installation

Alternatively, install dependencies manually:

```bash
# 1. Install root dependencies (for development scripts)
npm install

# 2. Install client dependencies
cd client
npm install

# 3. Install server dependencies
cd ../server
npm install

# 4. Return to root directory
cd ..
```

## Environment Variables

### Server Configuration

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with the following variables:

```env
# Server port (default: 5000)
PORT=5000

# Node environment (development, production)
NODE_ENV=development

# SQLite database file path
SQLITE_DB_PATH=./database.sqlite
```

### Client Configuration (Optional)

The client uses Vite's proxy configuration to connect to the backend. If you need to customize the API URL, create a `.env` file in the `client` directory:

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:

```env
# Backend API URL (only needed if backend is not on localhost:5000)
VITE_API_URL=http://localhost:5000
```

**Note:** The default Vite proxy configuration in `client/vite.config.js` automatically forwards `/api` requests to `http://localhost:5000`, so this is typically not needed for local development.

## Running the Application

### Development Mode

**Option 1: Run both servers concurrently (Recommended)**

From the root directory, run:

```bash
npm run dev
```

This starts both the backend and frontend servers simultaneously using `concurrently`.

**Option 2: Run servers separately**

Open two terminal windows:

```bash
# Terminal 1 - Start the backend server
npm run dev:server
# Backend runs on http://localhost:5000

# Terminal 2 - Start the frontend development server
npm run dev:client
# Frontend runs on http://localhost:5173
```

### Accessing the Application

Once both servers are running:

- **Frontend**: Open your browser to [http://localhost:5173](http://localhost:5173)
- **Backend API**: Available at [http://localhost:5000](http://localhost:5000)
- **API Documentation**: See [API Endpoints](#api-endpoints) section below

### Database Initialization

The SQLite database (`server/database.sqlite`) is automatically created when you first start the backend server. The `cart_items` table is created with the following schema:

```sql
CREATE TABLE cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL DEFAULT 'mock-user-001',
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);
```

### Production Build

Build the frontend for production:

```bash
npm run build
```

The optimized production files will be in `client/dist/`.

To start the production server:

```bash
npm start
```

**Note:** This only starts the backend. You'll need to serve the frontend build files separately (e.g., using nginx, Apache, or a static hosting service).

## API Endpoints

### Products

#### GET /api/products

Fetch available products from Fake Store API (with fallback to mock data).

**Response:** `200 OK`

```json
{
  "products": [
    {
      "id": "1",
      "name": "Product Name",
      "price": 29.99,
      "description": "Product description",
      "image": "https://example.com/image.jpg",
      "category": "electronics"
    }
  ]
}
```

**Error:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch products"
}
```

---

### Shopping Cart

#### GET /api/cart

Retrieve all cart items for the current user (mock-user-001) with calculated total.

**Response:** `200 OK`

```json
{
  "items": [
    {
      "id": "1",
      "productId": "5",
      "name": "Product Name",
      "price": 29.99,
      "quantity": 2,
      "subtotal": 59.98,
      "image": "https://example.com/image.jpg"
    }
  ],
  "total": 59.98
}
```

**Error:** `500 Internal Server Error`

```json
{
  "error": "Failed to retrieve cart items"
}
```

---

#### POST /api/cart

Add a new item to the cart or update quantity if the product already exists.

**Request Body:**

```json
{
  "productId": "5",
  "quantity": 2
}
```

**Response:** `201 Created` (new item) or `200 OK` (updated item)

```json
{
  "cartItem": {
    "id": "1",
    "productId": "5",
    "name": "Product Name",
    "price": 29.99,
    "quantity": 2,
    "subtotal": 59.98,
    "image": "https://example.com/image.jpg"
  }
}
```

**Validation Errors:** `400 Bad Request`

```json
{
  "error": "Invalid productId or quantity"
}
```

**Error:** `500 Internal Server Error`

```json
{
  "error": "Failed to add item to cart"
}
```

---

#### DELETE /api/cart/:id

Remove a specific item from the cart.

**URL Parameters:**

- `id` - Cart item ID (integer)

**Response:** `200 OK`

```json
{
  "message": "Item removed from cart"
}
```

**Error:** `404 Not Found`

```json
{
  "error": "Cart item not found"
}
```

**Error:** `500 Internal Server Error`

```json
{
  "error": "Failed to remove item from cart"
}
```

---

### Checkout

#### POST /api/checkout

Process checkout and generate a mock receipt.

**Request Body:**

```json
{
  "cartItems": [
    {
      "id": "1",
      "productId": "5",
      "name": "Product Name",
      "price": 29.99,
      "quantity": 2,
      "subtotal": 59.98
    }
  ],
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:** `200 OK`

```json
{
  "orderId": "ORD-1234567890",
  "total": 59.98,
  "timestamp": "2025-10-28T14:30:00.000Z",
  "items": [
    {
      "name": "Product Name",
      "quantity": 2,
      "price": 29.99,
      "subtotal": 59.98
    }
  ],
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Validation Errors:** `400 Bad Request`

```json
{
  "error": "Name and email are required"
}
```

```json
{
  "error": "Invalid email format"
}
```

**Error:** `500 Internal Server Error`

```json
{
  "error": "Failed to process checkout"
}
```

### Responsive Breakpoints

```css
/* Mobile: Default styles */
/* Tablet: 768px and up */
@media (min-width: 768px) {
  ...;
}

/* Desktop: 1024px and up */
@media (min-width: 1024px) {
  ...;
}
```

### Component Styling

- **Buttons**: Uppercase text, minimal borders, black on white with hover states
- **Forms**: Clean inputs with subtle borders, inline validation messages
- **Cards**: Minimal shadows, clear product images, concise information
- **Modals**: Centered overlays with semi-transparent backgrounds

## Screenshots

### Product Grid View

![Product Grid](docs/screenshots/product-grid.png)
_Browse products in a responsive grid layout with Stone Island aesthetic_

### Shopping Cart

![Shopping Cart](docs/screenshots/cart.png)
_Manage cart items with quantity controls and real-time total calculation_

### Checkout Process

![Checkout](docs/screenshots/checkout.png)
_Complete purchase with customer information form_

### Order Receipt

![Receipt Modal](docs/screenshots/receipt.png)
_View order confirmation with order ID and timestamp_

**Note:** Screenshots are placeholders. To add actual screenshots, capture images of the running application and place them in a `docs/screenshots/` directory.

## Important Notes

### Mock User Authentication

This application uses a **mock user system** for demonstration purposes:

- All cart operations are associated with a hardcoded user ID: `mock-user-001`
- No authentication or login system is implemented
- All users share the same cart in the current implementation
- In a production environment, you would implement proper user authentication and session management

### Mock Checkout Process

The checkout process is **simulated** and does not process real payments:

- No payment gateway integration (Stripe, PayPal, etc.)
- No actual order processing or fulfillment
- Generates a mock receipt with a unique order ID and timestamp
- Cart is **not** automatically cleared after checkout (this is intentional for demo purposes)
- In production, you would integrate a payment processor and implement order management

### External API Integration

Products are fetched from the **Fake Store API** (fakestoreapi.com):

- Provides realistic product data for demonstration
- Includes fallback to mock data if the API is unavailable
- Limited to 10 products for optimal performance
- In production, you would integrate with your own product database or inventory system

### Database Persistence

- Uses **SQLite** for simplicity and portability
- Database file (`database.sqlite`) is created automatically on first run
- Cart data persists across server restarts
- Suitable for development and small-scale deployments
- For production at scale, consider PostgreSQL or MySQL

## Code Examples

### Frontend Examples

#### Adding a Product to Cart

```javascript
// client/src/services/api.js
import axios from "axios";

const API_BASE_URL = "/api";

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart`, {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
```

#### Using the Cart in a Component

```javascript
// client/src/components/ProductCard.jsx
import { useState } from "react";
import { addToCart } from "../services/api";

function ProductCard({ product, onCartUpdate }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);

    try {
      await addToCart(product.id, 1);
      onCartUpdate(); // Refresh cart count
      showNotification("Added to cart!", "success");
    } catch (error) {
      showNotification("Failed to add to cart", "error");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart} disabled={isAdding}>
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
```

#### Theme Toggle Implementation

```javascript
// client/src/App.jsx
import { useState, useEffect } from "react";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="App">
      <button onClick={toggleDarkMode}>
        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      {/* Rest of app */}
    </div>
  );
}
```

### Backend Examples

#### Creating a Cart Route

```javascript
// server/routes/cart.js
const express = require("express");
const router = express.Router();
const CartItem = require("../models/CartItem");

// Get all cart items
router.get("/", async (req, res) => {
  try {
    const userId = "mock-user-001";
    const items = CartItem.getByUserId(userId);

    const total = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    res.json({ items, total });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to retrieve cart items" });
  }
});

// Add item to cart
router.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        error: "Invalid productId or quantity",
      });
    }

    const userId = "mock-user-001";
    const cartItem = CartItem.addOrUpdate(userId, productId, quantity);

    res.status(201).json({ cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

module.exports = router;
```

#### Database Model with SQLite

```javascript
// server/models/CartItem.js
const db = require("../config/database");

class CartItem {
  // Create the cart_items table
  static createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL DEFAULT 'mock-user-001',
        product_id TEXT NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL CHECK(quantity > 0),
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `;
    db.prepare(sql).run();
  }

  // Get all cart items for a user
  static getByUserId(userId) {
    const sql = `
      SELECT * FROM cart_items 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;
    return db.prepare(sql).all(userId);
  }

  // Add or update cart item
  static addOrUpdate(userId, productId, quantity, productData) {
    const existing = db
      .prepare("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?")
      .get(userId, productId);

    if (existing) {
      // Update quantity
      const sql = `
        UPDATE cart_items 
        SET quantity = quantity + ? 
        WHERE user_id = ? AND product_id = ?
      `;
      db.prepare(sql).run(quantity, userId, productId);
    } else {
      // Insert new item
      const sql = `
        INSERT INTO cart_items (user_id, product_id, name, price, quantity, image)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.prepare(sql).run(
        userId,
        productId,
        productData.name,
        productData.price,
        quantity,
        productData.image
      );
    }

    return this.getByProductId(userId, productId);
  }

  // Delete cart item
  static delete(id) {
    const sql = "DELETE FROM cart_items WHERE id = ?";
    const result = db.prepare(sql).run(id);
    return result.changes > 0;
  }
}

module.exports = CartItem;
```

#### Express Server Setup

```javascript
// server/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const checkoutRouter = require("./routes/checkout");
const CartItem = require("./models/CartItem");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
CartItem.createTable();

// Routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
```

### CSS Examples

#### Responsive Product Grid

```css
/* client/src/components/ProductGrid.css */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
}

/* Desktop: 4 columns */
@media (min-width: 1025px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Tablet: 3 columns */
@media (max-width: 1024px) and (min-width: 769px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
  }
}

/* Mobile: 2 columns */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
  }
}
```



### Testing Examples

#### Testing API Endpoints with cURL

```bash
# Get all products
curl http://localhost:5000/api/products

# Get cart items
curl http://localhost:5000/api/cart

# Add item to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": "1", "quantity": 2}'

# Delete cart item
curl -X DELETE http://localhost:5000/api/cart/1

# Process checkout
curl -X POST http://localhost:5000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "cartItems": [{"id": "1", "name": "Product", "price": 29.99, "quantity": 2}],
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

#### Testing with Postman

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "Nexora Fashion API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Products",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/products"
      }
    },
    {
      "name": "Get Cart",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/cart"
      }
    },
    {
      "name": "Add to Cart",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/cart",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"productId\": \"1\", \"quantity\": 2}"
        }
      }
    }
  ]
}
```

## Troubleshooting

### Port Already in Use

If you see an error like `EADDRINUSE: address already in use :::5000`:

```bash
# Find and kill the process using port 5000 (backend)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change the port in server/.env
PORT=5001
```

### Database Locked Error

If you encounter SQLite database locked errors:

```bash
# Stop all running servers
# Delete the database file
rm server/database.sqlite

# Restart the server (database will be recreated)
npm run dev:server
```
