using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ACCmobile.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace ACCmobile.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            // returning to index serves as the end of all processes
            // so, clear all session variables
            HttpContext.Session.Remove("SessionToken");
            HttpContext.Session.Remove("AddressID");
            HttpContext.Session.Remove("IncidentID");
            HttpContext.Session.Remove("Address");
            HttpContext.Session.Remove("HeatMap");
            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}