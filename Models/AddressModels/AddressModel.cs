using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class AddressModel
    {
        [Display(Prompt = "Enter an address")]
        public string AddressRelay { get; set; }

        // begin hidden fields
        public string AddressID { get; set; }
        public string Address { get; set; }
    }
}