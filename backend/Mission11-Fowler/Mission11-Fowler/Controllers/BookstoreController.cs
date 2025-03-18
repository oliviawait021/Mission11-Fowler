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
        public IActionResult Get(int pageHowMany = 5, int pageNum = 1, string sorted = null)
        {
            var query = _context.Books.AsQueryable();

            // Apply sorting based on the "sorted" parameter
            if (sorted?.ToLower() == "desc")
            {
                query = query.OrderByDescending(b => b.Title);
            }
            else
            {
                query = query.OrderBy(b => b.Title); // Default sorting (asc)
            }

            var books = query.Skip((pageNum - 1) * pageHowMany)
                .Take(pageHowMany)
                .ToList();

            var totalNumber = _context.Books.Count();

            return Ok(new
            {
                Books = books,
                TotalNumber = totalNumber
            });
        }
    
       
    }
}
