using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class Address
    {
        [Display(Prompt = "Enter address")]
        public string AddressClass { get; set; }

        // begin hidden fields
        public string AddressID { get; set; }
    }
}