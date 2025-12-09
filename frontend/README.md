# DALI E-Commerce - React Frontend

A modern React frontend for the DALI E-Commerce platform, converted from Thymeleaf templates to a React Single Page Application.

## Tech Stack

- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool and dev server
- **React Router DOM 6.21.2** - Client-side routing
- **Axios 1.6.5** - HTTP client for API calls
- **React-Leaflet 4.2.1** - Map integration for store finder
- **Leaflet 1.9.4** - Map library

## Project Structure

```
frontend/
├── public/
│   └── images/
│       └── products/          # Product images
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── AdminHeader.jsx
│   │   ├── Layout.jsx
│   │   ├── AdminLayout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── AddressForm.jsx
│   │   ├── OrderTimeline.jsx
│   │   ├── OrderCard.jsx
│   │   └── StoreMap.jsx
│   ├── context/               # React Context providers
│   │   ├── AuthContext.jsx    # Authentication state
│   │   └── CartContext.jsx    # Shopping cart state
│   ├── pages/                 # Page components
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Stores.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── ChangePassword.jsx
│   │   ├── Profile.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderDetail.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── PaymentSuccess.jsx
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminHome.jsx
│   │       ├── AdminInventory.jsx
│   │       ├── AdminProductDetail.jsx
│   │       ├── AdminOrders.jsx
│   │       └── AdminOrderDetail.jsx
│   ├── services/              # API service layer
│   │   ├── api.js             # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   ├── orderService.js
│   │   ├── checkoutService.js
│   │   ├── addressService.js
│   │   ├── storeService.js
│   │   └── locationService.js
│   ├── styles/
│   │   └── style.css          # Main stylesheet (ported from original)
│   ├── App.jsx                # Main app with routes
│   └── main.jsx               # App entry point
├── index.html
├── package.json
├── vite.config.js
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (FastAPI or Spring Boot)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file and configure:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your API URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Features

### Public Pages
- **Home** - Hero section, product range showcase, why choose us
- **Shop** - Product listing with category filters and search
- **Product Detail** - Individual product view with add to cart
- **Cart** - Shopping cart with quantity management
- **Stores** - Store finder with interactive Leaflet map

### Authentication
- **Login/Register** - User authentication
- **Forgot Password** - Password reset request
- **Reset Password** - Password reset with token

### Protected User Pages
- **Profile** - User profile with orders, addresses, and personal details
- **Checkout** - Multi-step checkout (address → shipping → payment)
- **Order Detail** - View order details with timeline
- **Change Password** - Update user password

### Admin Pages
- **Admin Login** - Admin authentication
- **Admin Dashboard** - Admin home page
- **Inventory** - Product inventory management with stock updates
- **Orders** - Order management with search
- **Order Detail** - View and update order status

## API Integration

The frontend communicates with a RESTful API. Key endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products` - List products
- `GET /api/cart` - Get user cart
- `POST /api/checkout` - Process checkout
- `GET /api/orders` - List user orders
- `GET /api/stores` - List stores

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api` |

## Static Assets

Product images should be placed in `public/images/products/`. The images are referenced in the database by filename only.

For other images (logo, icons, etc.), place them in `public/images/`.

## Notes

- This frontend is designed to work with the FastAPI backend conversion
- The design is preserved exactly from the original Thymeleaf templates
- Authentication uses JWT tokens stored in localStorage
- Cart state is synced with the backend API
