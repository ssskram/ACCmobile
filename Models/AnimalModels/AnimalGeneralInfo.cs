using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class AnimalGeneralInfo
    {
        public string Type { get; set; }
        [Display(Name = "Owners Last Name")]
        public string Breed { get; set; }
        [Display(Name = "Owners First Name")]
        public string Coat { get; set; }
        [Display(Name = "Owners Phone Number")]
        public string Sex { get; set; }
        [Display(Name = "License #")]
        public string LicenseNumber { get; set; }
        [Display(Name = "Rabbies Vac. #")]
        public string RabbiesVacNo { get; set; }
        [Display(Name = "Rabbies Vac. #")]
        public string RabbiesVacExp { get; set; }
        [DataType(DataType.MultilineText)]
        public string Veterinarian { get; set; }
        [Display(Name = "License Year")]
        public string LicenseYear { get; set; }
        public string Age { get; set; }
        public string AccessToken { get; set; }  
        public string AdvisoryID { get; set; } 
    }
}