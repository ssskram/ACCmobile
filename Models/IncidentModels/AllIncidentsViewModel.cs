using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class AllIncidents
    {
        public string Link { get; set; }
        public string Date { get; set; }
        public string Address { get; set; }
        public string Coords { get; set; }
    }
}