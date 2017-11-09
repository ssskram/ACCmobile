using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ACCmobile.Models;

namespace ACCmobile.Controllers
{
    public class AdvisoryController : Controller
    {       
         public IActionResult AdvisoryForm()
        {
            return View();
        }
    }
}
