using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace accmobile.Models
{
    public class Survey
    {
        public string name { get; set; }
        public string department { get; set; }
        public string body { get; set; }
        public string futureUserTesting { get; set; }
    }                   
}