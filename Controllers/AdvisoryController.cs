using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ACCmobile.Models;
using Microsoft.AspNetCore.Authorization;

namespace ACCmobile.Controllers
{
    [Authorize]
    public class AdvisoryController : Controller
    {   
        public IActionResult AdvisoryForm()
        {
            return View();
        }
        public IActionResult Create()
        {
            return View("~/Views/Home/Index.cshtml");
        }
    }
}