# 🛒 NEO MART - E-Commerce Product Explorer & Cart Management App

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

A modern, high-contrast, Neo-Brutalism styled e-commerce application built with React. This project demonstrates advanced state management, routing, and UI architecture to simulate a real-world online shopping experience.

---

## 🔗 Live Demo
**Deployed Application:** https://neo-mart-tau.vercel.app/

---

## 📸 Screenshots
<div style="display: flex; overflow-x: auto; gap: 20px; padding-bottom: 20px;">
  <img src="ecomapp/src/assets/image%20copy%2011.png" alt="Screenshot 12" style="height: 400px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
  <img src="ecomapp/src/assets/image%20copy%2010.png" alt="Screenshot 11" style="height: 400px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
  <img src="ecomapp/src/assets/image%20copy%209.png" alt="Screenshot 10" style="height: 400px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
  <img src="ecomapp/src/assets/image%20copy%208.png" alt="Screenshot 9" style="height: 400px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
  <img src="ecomapp/src/assets/image%20copy%207.png" alt="Screenshot 8" style="height: 400px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
  <img src="ecomapp/src/assets/image%20copy%206.png" alt="Screenshot 7" style="height: 400px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
  <img src="ecomapp/src/assets/image%20copy%205.png" alt="Screenshot 6" style="height: 400px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
  <img src="ecomapp/src/assets/image%20copy%204.png" alt="Screenshot 5" style="height: 400px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
  <img src="ecomapp/src/assets/image%20copy%203.png" alt="Screenshot 4" style="height: 400px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
  <img src="ecomapp/src/assets/image%20copy.png" alt="Screenshot 2" style="height: 400px; width: auto; flex-shrink: 0; border: 4px solid black; box-shadow: 4px 4px 0px 0px black;" />
</div>

---

## 🚀 Features

### Core Functionalities
- **Product Exploration**: Browse a responsive grid of products fetched from an external API.
- **Smart Search**: Real-time product search with debounce optimization for performance.
- **Advanced Filtering**: Filter products by category and price range.
- **Dynamic Sorting**: Sort products by price (Low-High, High-Low) and relevance.
- **Product Details**: Detailed view with image galleries (Swiper.js), specifications, and ratings.
- **Shopping Cart**: Full cart management (add, remove, update quantities) with real-time total calculation.
- **Wishlist**: Save favorite items for later purchase.
- **Checkout Process**: validated checkout form ensuring data integrity.

### User Experience (UX)
- **Responsive Design**: Mobile-first architecture ensuring seamless experience across devices.
- **Persistent State**: Cart and Wishlist data persists via `localStorage`.
- **Feedback System**: Toast notifications for user actions (add to cart, errors, etc.).
- **Smooth Animations**: Integrated `framer-motion` for page transitions and interactive elements.
- **Neo-Brutalism UI**: Distinct thick borders, hard shadows, and bold typography using Tailwind CSS.

---

## 🛠 Tech Stack

### Frontend Framework
- **[React 19](https://react.dev/)**: Core library for building the user interface.
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling for fast builds.

### Styling & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
- **[Framer Motion](https://www.framer.com/motion/)**: Production-ready animation library.
- **[Swiper](https://swiperjs.com/)**: Modern touch slider for product galleries.
- **[React Icons](https://react-icons.github.io/react-icons/)**: Icon library for consistent iconography.
- **[React Toastify](https://fkhadra.github.io/react-toastify/)**: Notification system.

### State Management & Logic
- **React Context API**: Global state management for Cart and Wishlist.
- **React Router DOM v6**: Client-side routing.
- **Axios**: Promise-based HTTP client for API requests.
- **React Hook Form & Yup**: Form handling and schema validation.
- **UUID**: Unique ID generation.

---

## 📂 Project Structure

```bash
src/
├── assets/           # Static assets (images, fonts)
├── components/       # Reusable UI components
│   ├── Navbar.jsx    # Responsive navigation
│   ├── ProductCard.jsx # Individual product display
│   ├── Footer.jsx    # Site footer
│   └── ...
├── context/          # Global State providers
│   └── CartContext.jsx # Cart & Wishlist logic
├── hooks/            # Custom Hooks
│   ├── useCart.js    # Hook to access cart state
│   ├── useWishlist.js # Hook to access wishlist state
│   ├── useProducts.js # Data fetching hook
│   └── useDebounce.js # Search optimization
├── pages/            # Application Pages
│   ├── Home.jsx      # Landing page
│   ├── Products.jsx  # Product listing with filters
│   ├── ProductDetails.jsx # Single product view
│   ├── Cart.jsx      # Shopping cart view
│   ├── Wishlist.jsx  # Wishlist view
│   └── Checkout.jsx  # Checkout form
├── services/         # API Integration
│   └── api.js        # Axios instance & endpoints
├── utils/            # Helper functions
│   └── helpers.js    # Formatting utilities
├── App.jsx           # Main application wrapper
└── main.jsx          # Entry point
```

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecomapp
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🔌 API Reference

This project uses the [DummyJSON API](https://dummyjson.com/docs/products) as its backend service.

- **Get All Products**: `GET https://dummyjson.com/products`
- **Search Products**: `GET https://dummyjson.com/products/search?q={query}`
- **Get Single Product**: `GET https://dummyjson.com/products/{id}`
- **Get Categories**: `GET https://dummyjson.com/products/categories`

---

## 🧪 Key React Concepts Implemented

- **`useState`**: Handling local component state (search inputs, filters).
- **`useEffect`**: Managing side effects like data fetching and local storage synchronization.
- **`useContext`**: Global state management for the shopping cart and wishlist to avoid prop drilling.
- **Custom Hooks**: Encapsulating logic for reusability (`useDebounce`, `useProducts`).
- **React Router**: Implementing dynamic routing for product details pages (`/products/:id`).

---

## 👨‍💻 Author

Built with 🍵 by Swapnil Patil

