import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { fetchBooks, deleteBook } from "../api/BooksAPI";
import NewBookForm from "../components/NewBookForm";
import EditProjectForm from "../components/EditBooksForm";

const AdminBooksPage = () => {
  const [books, setProjects] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showform, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(pageSize, pageNum, sortOrder, []);

        setProjects(data.books);
        setTotalPages(
          Number.isFinite(data.totalNumBooks) && pageSize > 0
            ? Math.ceil(data.totalNumBooks / pageSize)
            : 0
        );
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [pageSize, pageNum, sortOrder]);

  const handleDelete = async (projectId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await deleteBook(projectId);
      setProjects(books.filter((p) => p.bookId !== projectId));
    } catch (error) {
      alert("Failed to delete projet. Please try again.");
      throw error;
    }
  };

  if (loading) return <p>loading projects</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <h1>Admin Projects</h1>

      {!showform && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          New Project
        </button>
      )}

      {showform && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            setPageNum(1);
            fetchBooks(pageSize, 1, sortOrder, []).then((data) => {
              setProjects(data.books);
              setTotalPages(
                Number.isFinite(data.totalNumBooks) && pageSize > 0
                  ? Math.ceil(data.totalNumBooks / pageSize)
                  : 0
              );
            });
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBook && (
        <EditProjectForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null);
            fetchBooks(pageSize, pageNum, sortOrder, []).then((data) =>
              setProjects(data.books)
            );
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Price</th>
            <th>Page Count</th>
          </tr>
        </thead>
        <tbody>
          {books.map((p) => (
            <tr key={p.bookId}>
              <td>{p.bookId}</td>
              <td>{p.title}</td>
              <td>{p.author}</td>
              <td>{p.isbn}</td>
              <td>{p.classification}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>{p.pageCount}</td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => setEditingBook(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(p.bookId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
};

export default AdminBooksPage;
