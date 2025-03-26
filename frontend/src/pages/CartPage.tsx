import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/cartItem";
import { useState, useEffect } from "react";

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();
  const [localCart, setLocalCart] = useState(cart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(localCart));
  }, [localCart]);

  const total = localCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  const updateQuantity = (bookId: number, newQuantity: number) => {
    setLocalCart((prevCart) =>
      prevCart.map((item) =>
        item.bookId === bookId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <>
      <h2>Your Cart:</h2>
      <div>
        {localCart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {localCart.map((item: CartItem) => (
                <tr key={item.bookId}>
                  <td>{item.title}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.bookId, Number(e.target.value))
                      }
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromCart(item.bookId)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>Total</td> <td></td> <td></td> <td>${total.toFixed(2)}</td>{" "}
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => clearCart()}
                  >
                    {" "}
                    Clear Cart
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <h3>Checkout</h3>
      <button onClick={() => navigate("/")}>Continue Browsing</button>
    </>
  );
}

export default CartPage;
