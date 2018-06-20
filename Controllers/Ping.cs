using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace accmobile.Controllers
{
    [Route("api/[controller]")]
    public class ping : Controller
    {
        [HttpGet("[action]")]
        public IActionResult pong()
        {
            bool isAuthenticated = User.Identity.IsAuthenticated;
            return Ok(isAuthenticated);
        }
    }
}
