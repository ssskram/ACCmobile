using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class AnimalGeneralInfo
    {
        [Display(Prompt = "Type")]
        public string Type { get; set; }

        [Display(Prompt = "Breed")]
        public string Breed { get; set; }

        [Display(Prompt = "Coat")]
        public string Coat { get; set; }

        [Display(Prompt = "Sex")]
        public string Sex { get; set; }

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
    }
        // begin dropdown values
        public enum AnimalType
        {
            Dog,
            Cat,
            Other,
        };
        public enum AnimalSex
        {
            Male,
            Female,
            Unknown,
        };

}