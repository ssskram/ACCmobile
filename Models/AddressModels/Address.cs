using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class Address
    {
        [Display(Prompt = "Enter address")]
        public string AddressRelay { get; set; }

        // begin hidden fields
        public string AddressID { get; set; }
        public string AddressClass { get; set; }
    }
}