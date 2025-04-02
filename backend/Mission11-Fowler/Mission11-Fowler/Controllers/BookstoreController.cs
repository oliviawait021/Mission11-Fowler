using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11_Fowler.Data;

namespace Mission11_Fowler.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookstoreController : ControllerBase
    {
        private BookstoreContext _context;

        public BookstoreController(BookstoreContext temp)
        {
            _context = temp;
        }

        [HttpGet]
        public IActionResult Get(int pageHowMany = 5, int pageNum = 1, string sorted = null, [FromQuery] List<string> category = null)
        {
            var query = _context.Books.AsQueryable();

            // Apply sorting based on the "sorted" parameter
            if (sorted?.ToLower() == "desc")
            {
                query = query.OrderByDescending(b => b.Title);
            }
            else if (category != null && category.Any())
            {
                query = query.Where(b => category.Contains(b.Category));
            }
            else
            {
                query = query.OrderBy(b => b.Title); // Default sorting (asc)
            }

            var books = query.Skip((pageNum - 1) * pageHowMany)
                .Take(pageHowMany)
                .ToList();

            var totalNumber = query.Count();

            return Ok(new
            {
                Books = books,
                TotalNumber = totalNumber
            });
        }

        [HttpGet("GetBookTypes")]
        public IActionResult GetBookTypes()
        {
            var bookTypes = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookTypes);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _context.Books.Add(newBook);
            _context.SaveChanges();

            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _context.Books.Find(bookId);

            existingBook.Title = updatedBook.Title;
            existingBook.Isbn = updatedBook.Isbn;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.Category = updatedBook.Category;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Author = updatedBook.Author;
            existingBook.Price = updatedBook.Price;
            existingBook.PageCount = updatedBook.PageCount;

            _context.Books.Update(existingBook);
            _context.SaveChanges();

            return Ok(updatedBook);
        }

        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _context.Books.Find(bookId);

            if (book == null)
            {
                return NotFound(new { message = "Not found" });
            }

            _context.Books.Remove(book);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
    
