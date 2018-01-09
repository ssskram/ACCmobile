using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class AnimalGeneralInfo
    {
        [Display(Prompt = "Type")]
        public string TypeRelay { get; set; }

        [Display(Prompt = "Breed")]
        public string BreedRelay { get; set; }

        [Display(Prompt = "Coat")]
        public string CoatRelay { get; set; }

        [Display(Prompt = "Sex")]
        public string SexRelay { get; set; }

        [Display(Prompt = "License #")]
        public string LicenseNumber { get; set; }

        [Display(Prompt = "Rabbies Vac. #")]
        public string RabbiesVacNo { get; set; }

        [Display(Prompt = "Rabbies Vac. Exp.")]
        public string RabbiesVacExp { get; set; }

        [Display(Prompt = "Veterinarian")]
        [DataType(DataType.MultilineText)]
        public string Veterinarian { get; set; }

        [Display(Prompt = "License Year")]
        public string LicenseYear { get; set; }

        [Display(Prompt = "Age")]
        public string Age { get; set; }

        [Display(Prompt = "Name")]
        public string AnimalName { get; set; }

        // begin hidden fields
        public string AccessToken { get; set; }  
        public string AddressID { get; set; } 
        public string AdvisoryID { get; set;}
        public string Type { get; set; }
        public string Breed { get; set; }
        public string Coat { get; set; }
        public string Sex { get; set; }

        // begin form fields
        public string AnimalHeading { get; set; }
    }
}