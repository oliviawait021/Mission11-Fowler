import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartSummary from "./CartSummary";

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `category=${encodeURIComponent(cat)}`)
        .join("&");
      const response = await fetch(
        `https://localhost:5000/Bookstore?pageHowMany=${pageSize}&pageNum=${pageNum}&sorted=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ""}`
      );
      const data = await response.json();

      setBooks(data.books);
      setTotalPages(Math.ceil(data.totalNumber / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, sortOrder, selectedCategories]);

  return (
    <>
      <CartSummary />
      <div className="container">
        <div className="d-flex justify-content-end mb-3">
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="btn btn-secondary"
          >
            Sort by Title ({sortOrder === "asc" ? "A-Z" : "Z-A"})
          </button>
        </div>
        <div className="row g-4 align-items-start justify-content-center">
          {books.map((b) => (
            <div key={b.bookId} className="col-md-4 mb-4">
              <div className="card h-100 shadow">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">{b.title}</h5>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li>
                      <strong>Author:</strong> {b.author}
                    </li>
                    <li>
                      <strong>Publisher:</strong> {b.publisher}
                    </li>
                    <li>
                      <strong>ISBN:</strong> {b.isbn}
                    </li>
                    <li>
                      <strong>Classification/Category:</strong>{" "}
                      {b.classification}/{b.category}
                    </li>
                    <li>
                      <strong>Number of Pages:</strong> {b.pageCount} pages
                    </li>
                    <li>
                      <strong>Price:</strong> ${b.price.toFixed(2)}
                    </li>
                  </ul>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      const newItem = {
                        bookId: b.bookId,
                        title: b.title,
                        price: b.price,
                        quantity: 1,
                      };
                      addToCart(newItem);
                      navigate("/cart");
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setPageNum(index + 1)}
          disabled={pageNum === index + 1}
        >
          {index + 1}
        </button>
      ))}
      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>

      <br />
      <label> Results per page:</label>
      <select
        value={pageSize}
        onChange={(p) => {
          setPageSize(Number(p.target.value));
          setPageNum(1);
        }}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
    </>
  );
}

export default BookList;
