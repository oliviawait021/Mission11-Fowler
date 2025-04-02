import { Book } from "../types/Book"; // Adjust path if needed

interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

const API_URL = "https://mission13oliviabackend2.azurewebsites.net/bookstore";

export const fetchBooks = async (
  pageSize: number,
  pageNum: number,
  sorted: string,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  try {
    const params = new URLSearchParams();
    params.append("pageHowMany", pageSize.toString());
    params.append("pageNum", pageNum.toString());
    if (sorted) {
      params.append("sorted", sorted);
    }
    // The backend expects query parameter "category" for filtering,
    // so use that instead of projectTypes.
    if (selectedCategories && selectedCategories.length > 0) {
      selectedCategories.forEach((cat) => {
        params.append("category", cat);
      });
    }

    const response = await fetch(`${API_URL}?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

//Add a new book
export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}AddBook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error("Failed to add book");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding book", error);
    throw error;
  }
};

export const updateBook = async (
  bookId: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}UpdateBook/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBook),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}DeleteBook/${bookId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(
      `Delete request sent for book ${bookId}, status: ${response.status}`
    );

    if (!response.ok) {
      throw new Error(`Failed to delete book: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
