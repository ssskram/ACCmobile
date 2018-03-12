﻿using System;
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
    public class Home : Controller
    {
        public IActionResult Index()
        {
            // returning to index serves as the end of all processes
            // so, clear all session variables
            HttpContext.Session.Remove("AddressID");
            HttpContext.Session.Remove("IncidentID");
            HttpContext.Session.Remove("Address");
            HttpContext.Session.Remove("HeatMap");
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}