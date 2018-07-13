using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace accmobile.Controllers {
    public class Home : Controller {
        [Authorize]
        public IActionResult Index () {
            return View ();
        }

        public IActionResult Error () {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View ();
        }
    }
}