# 🛒 NEO MART - Full-Stack E-Commerce Platform

![React](https://img.shields.io/badge/react-19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-8-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-v4-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/mongodb-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Razorpay](https://img.shields.io/badge/razorpay-%2302042B.svg?style=for-the-badge&logo=razorpay&logoColor=white)

A high-contrast, modern **Neo-Brutalism styled full-stack e-commerce web application**. Built with a **React 19 + Vite** frontend and an **Express 5 + MongoDB** backend, featuring real-time product discovery, server-synchronized cart and wishlist, JWT cookie authentication, and Razorpay payment checkout with HMAC verification.

---

## 🔗 Live Demo & Links
- **Deployed Frontend:** [https://neo-mart-tau.vercel.app/](https://neo-mart-tau.vercel.app/)
- **Repository:** [https://github.com/SwapnilPatil28/E-Commerce-App](https://github.com/SwapnilPatil28/E-Commerce-App)

---

## 📸 Screenshots Showcase
<div style="display: flex; overflow-x: auto; gap: 20px; padding-bottom: 20px;">
   <img src="ecomapp/frontend/src/assets/image%20copy%2011.png" alt="NeoMart Showcase 1" style="height: 380px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
   <img src="ecomapp/frontend/src/assets/image%20copy%2010.png" alt="NeoMart Showcase 2" style="height: 380px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
   <img src="ecomapp/frontend/src/assets/image%20copy%209.png" alt="NeoMart Showcase 3" style="height: 380px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
   <img src="ecomapp/frontend/src/assets/image%20copy%208.png" alt="NeoMart Showcase 4" style="height: 380px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
   <img src="ecomapp/frontend/src/assets/image%20copy%207.png" alt="NeoMart Showcase 5" style="height: 380px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
   <img src="ecomapp/frontend/src/assets/image%20copy%206.png" alt="NeoMart Showcase 6" style="height: 380px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
   <img src="ecomapp/frontend/src/assets/image%20copy%205.png" alt="NeoMart Showcase 7" style="height: 380px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
   <img src="ecomapp/frontend/src/assets/image%20copy%204.png" alt="NeoMart Showcase 8" style="height: 380px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
   <img src="ecomapp/frontend/src/assets/image%20copy%203.png" alt="NeoMart Showcase 9" style="height: 380px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
   <img src="ecomapp/frontend/src/assets/image%20copy.png" alt="NeoMart Showcase 10" style="height: 380px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
</div>

---

## 🚀 Key Features

### 🎨 Neo-Brutalism UI & Design
- **Distinctive Aesthetics**: Bold 4px solid black borders, flat hard drop-shadows (`box-shadow: 4px 4px 0px 0px black`), vibrant color palette (cyan, yellow, lime, pink), and heavy uppercase typography.
- **Micro-Interactions**: Hover elevation shifts (`translate-x`, `translate-y`) and button feedback animations.
- **Fully Responsive**: Mobile-first design with interactive hamburger menu drawer and adaptive grids.

### 🛍️ Product Discovery & Shopping Experience
- **Debounced Smart Search**: Real-time product search with a 500ms debounce hook to minimize redundant queries.
- **Dynamic Filtering & Sorting**: Filter by category and price range; sort by price (Low to High, High to Low) or newest arrivals.
- **Product Details Showcase**: Multi-image touch carousel powered by Swiper.js, item specifications, customer reviews, stock status, and pricing discounts.
- **Cart & Wishlist Engine**: Real-time cart calculations with server synchronization for authenticated users and local persistence.
- **Interactive Notifications**: Instant feedback on cart/wishlist actions with React Toastify.

### 🔐 Full-Stack Authentication & Security
- **JWT Cookie Auth**: Secure JSON Web Token authentication using `HttpOnly` and `SameSite` cookies to protect against XSS.
- **Password Security**: Strong password hashing using `bcrypt` (12 rounds) with change password support.
- **Protected Routes**: Client-side route guarding for checkout, order history, and account settings.

### 💳 Order Management & Payments
- **Razorpay Integration**: End-to-end checkout flow creating Razorpay orders and verifying payment signatures using crypto HMAC SHA256.
- **Order Tracking**: Comprehensive order tracking with order summaries, shipping addresses, delivery dates, and status badges (Pending, Paid, Delivered, Cancelled).

---

## 🛠 Tech Stack

| Domain | Technology / Library | Description |
| :--- | :--- | :--- |
| **Frontend Core** | [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/) | Component-based UI and blazing fast development & bundling |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS engine for Neo-Brutalist design tokens |
| **Routing & Forms** | [React Router 7](https://reactrouter.com/), [React Hook Form](https://react-hook-form.com/), [Yup](https://github.com/jquense/yup) | Client-side routing, form state management, schema validation |
| **Animations & Media** | [Framer Motion](https://www.framer.com/motion/), [Swiper](https://swiperjs.com/), [React Icons](https://react-icons.github.io/react-icons/) | Smooth layout animations, touch slider carousels, SVG icons |
| **Backend API** | [Node.js](https://nodejs.org/), [Express 5](https://expressjs.com/) | RESTful API server with modular routing and error middlewares |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/), [Mongoose 9](https://mongoosejs.com/) | Document database with strict schemas and population |
| **Auth & Security** | [jsonwebtoken](https://jwt.io/), [bcrypt](https://github.com/kelektiv/node.bcrypt.js), [cookie-parser](https://github.com/expressjs/cookie-parser), [cors](https://github.com/expressjs/cors) | Token creation, password hashing, secure cookie exchange, CORS |
| **Payment Gateway** | [Razorpay](https://razorpay.com/) | Payment gateway SDK with server-side HMAC SHA256 verification |

---

## 📂 Project Structure

```bash
E-Commerce-App/
├── README.md                      # Comprehensive project documentation
├── package.json                   # Root workspace helper scripts
├── .gitignore                     # Root gitignore protecting secrets & builds
├── .gitattributes                 # Line-ending normalization rules
└── ecomapp/
    ├── .gitignore                 # App-level gitignore rules
    ├── backend/                   # Express 5 REST API & MongoDB Backend
    │   ├── .env.example           # Backend environment variable template
    │   ├── package.json           # Backend dependencies and scripts
    │   ├── index.js               # Express application entry & server listener
    │   ├── config/
    │   │   └── razorpay.js        # Razorpay client instance setup
    │   ├── controllers/
    │   │   ├── customer.controller.js # Customer auth, profile & cart logic
    │   │   ├── order.controller.js    # Order creation, verification & history
    │   │   └── product.controller.js  # Product listing, filtering & categories
    │   ├── middlewares/
    │   │   └── auth.middleware.js     # JWT verification & protect route middleware
    │   ├── models/
    │   │   ├── customer.model.js  # Customer schema (name, email, password, cart)
    │   │   └── order.model.js     # Order schema (items, amount, payment, address)
    │   ├── routes/
    │   │   ├── customer.routes.js # Customer & cart endpoints
    │   │   ├── order.routes.js    # Order & Razorpay endpoints
    │   │   └── product.routes.js  # Product endpoints
    │   └── utils/
    │       └── generateToken.js   # JWT token generation helper
    │
    └── frontend/                  # React 19 + Vite Single Page Application
        ├── .env.example           # Frontend environment variable template
        ├── package.json           # Frontend dependencies and scripts
        ├── vite.config.js         # Vite configuration with React & Tailwind plugins
        ├── eslint.config.js       # ESLint flat configuration
        ├── vercel.json            # Deployment routing configuration
        ├── index.html             # HTML5 entry template
        └── src/
            ├── assets/            # Showcase images and branding assets
            ├── components/        # UI components (Navbar, Footer, ProductCard, etc.)
            ├── context/           # React Context providers (AuthContext, CartContext)
            ├── hooks/             # Custom hooks (useAuth, useCart, useWishlist, useDebounce, useProducts)
            ├── pages/             # Route pages (Home, Products, ProductDetails, Cart, Wishlist, Checkout, Orders, Auth, Account)
            ├── services/          # Axios HTTP clients (customerApi, orderApi, productApi)
            ├── utils/             # Helper utilities and formatting functions
            ├── App.jsx            # Application root route definitions
            └── main.jsx           # React DOM client entry point
```

---

## ⚡ Getting Started

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster or local MongoDB instance
- (Optional) A [Razorpay](https://razorpay.com/) test account for payments

---

### Installation & Environment Setup

#### 1. Clone the repository
```bash
git clone https://github.com/SwapnilPatil28/E-Commerce-App.git
cd E-Commerce-App
```

#### 2. Install all dependencies
You can install dependencies for both the backend and frontend in one step:
```bash
npm run install:all
```
*(Or navigate to each folder separately: `cd ecomapp/backend && npm install`, then `cd ../frontend && npm install`).*

---

#### 3. Configure Backend Environment
Navigate to `ecomapp/backend/` and create your `.env` file from the example:
```bash
cp ecomapp/backend/.env.example ecomapp/backend/.env
```
Fill in your configuration:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/NeoMart?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### 4. Configure Frontend Environment
Navigate to `ecomapp/frontend/` and create your `.env` file from the example:
```bash
cp ecomapp/frontend/.env.example ecomapp/frontend/.env
```
Default configuration:
```env
VITE_API_URL=http://localhost:5000/customers
VITE_PRODUCT_API_URL=http://localhost:5000/productapi
```

---

### Running Locally

You can launch both services using the root npm commands or individual terminal tabs:

#### Option A: Using Root Helper Commands
```bash
# Terminal 1 - Start the backend
npm run dev:backend

# Terminal 2 - Start the frontend
npm run dev:frontend
```

#### Option B: Manual Folder Execution
```bash
# Terminal 1 (Backend)
cd ecomapp/backend
npm run dev

# Terminal 2 (Frontend)
cd ecomapp/frontend
npm run dev
```

The application will be accessible at:
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 🔌 API Reference

### 👤 Customer & Auth Endpoints (`/customers`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/customers/register` | Register new customer account | No |
| `POST` | `/customers/login` | Login and obtain HttpOnly JWT cookie | No |
| `POST` | `/customers/logout` | Clear auth token cookie | Yes |
| `GET` | `/customers/profile` | Get current authenticated customer | Yes |
| `PATCH` | `/customers/change-password` | Update account password | Yes |

### 🛒 Cart Endpoints (`/customers/cart`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/customers/cart` | Get customer cart items | Yes |
| `POST` | `/customers/cart/add` | Add product to cart | Yes |
| `PATCH` | `/customers/cart/update` | Update item quantity in cart | Yes |
| `DELETE` | `/customers/cart/remove/:productId` | Remove item from cart | Yes |
| `DELETE` | `/customers/cart/clear` | Clear all items from cart | Yes |

### 📦 Orders & Payments (`/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/orders/create` | Create a new order and generate Razorpay order ID | Yes |
| `POST` | `/orders/verify-payment` | Verify Razorpay payment signature & update order | Yes |
| `GET` | `/orders/my-orders` | Fetch customer order history | Yes |
| `GET` | `/orders/:id` | Fetch specific order details | Yes |

### 🏷️ Products (`/productapi`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/productapi/products` | Get list of products with search & pagination | No |
| `GET` | `/productapi/products/:id` | Get details for a single product | No |
| `GET` | `/productapi/categories` | Get all product categories | No |

---

## 🧪 Testing & Validation

To verify the frontend code quality and production build:
```bash
# Run ESLint check
npm run lint:frontend

# Build frontend production bundle
npm run build:frontend
```

---

## 🚀 Pushing to GitHub with GitHub Desktop

Because this repository is already connected to GitHub:
1. Open **GitHub Desktop**.
2. Select repository: **`E-Commerce-App`**.
3. You will see:
   - Untracked `node_modules` safely removed from Git.
   - Refactored folder structure (`ecomapp/frontend` & `ecomapp/backend`).
   - `.env` files safely ignored by `.gitignore`.
   - Updated documentation and environment templates.
4. Type a summary message (e.g., `feat: Full-stack refactor with Express backend, MongoDB, Razorpay, and clean docs`).
5. Click **Commit to main**.
6. Click **Push origin**.

---

## 👨‍💻 Author

Built with ❤️ by **[Swapnil Patil](https://github.com/SwapnilPatil28)**
