import "./App.css";
import BooksPage from "./pages/BooksPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import AdminBooksPage from "./pages/AdminProjectsPage";

function App() {
  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BooksPage />} />
            <Route path="/Cart" element={<CartPage />} />
            <Route path="/Admin" element={<AdminBooksPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
