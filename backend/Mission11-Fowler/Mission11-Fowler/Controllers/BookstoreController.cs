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
        public IActionResult Get(int pageHowMany = 5, int pageNum = 1)
        {
            var something = _context.Books.Skip((pageNum - 1) * pageHowMany)
                .Take(pageHowMany)
                .ToList();
            
            var totalNumber = _context.Books.Count();
            
            return Ok(new
            {
                Books = something,
                TotalNumber = totalNumber
            });
        }

        public IActionResult GetBooksView()
        {
            var books = _context.Books.ToList();
            return View(books);
        }
    }
}
