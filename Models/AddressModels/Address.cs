using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class Address
    {
        [Display(Name = "Enter address")]
        public string AddressClass { get; set; }
        public string AddressID { get; set; }
        public string AccessToken { get; set; }
    }
}