using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace ACCmobile.Models
{
    public class AdvisoryGeneralInfo
    {
        [Required, Display(Prompt = "Owners Last Name")]
        public string OwnersLastName { get; set; }

        [Required, Display(Prompt = "Owners First Name")]
        public string OwnersFirstName { get; set; }

        [Display(Prompt = "Owners Phone Number")]
        public string OwnersTelephoneNumber { get; set; }

        [Display(Prompt = "ADV. PGH Code")]
        [EnumDataType(typeof(Codes))]
        public Codes PGHCode { get; set; }

        [Display(Prompt = "Citation Number")]
        public string CitationNumber { get; set; }

        [Required, Display(Prompt = "Reason for Visit")]
        [EnumDataType(typeof(Reasons))]
        public string ReasonForVisit { get; set; }
        
        [Display(Prompt = "Comments")]
        [DataType(DataType.MultilineText)]
        public string Comments { get; set; }
        
        // begin hidden fields
        public string AccessToken { get; set; }
        public string AddressID { get; set; }
        public string AdvisoryID { get; set; }
    }
        // begin dropdown values
        public enum Codes
        {
            [Display(Name = "633.02a")]
            TwoA = 1,
            [Display(Name = "633.03")]
            Three = 2,
            [Display(Name = "633.05")]
            Five = 3,
            [Display(Name = "633.07a")]
            SevenA = 4,
            [Display(Name = "633.09a")]
            NineA = 5,
            [Display(Name = "633.09b")]
            NineB = 6,
            [Display(Name = "633.09c")]
            NineC = 7,
            [Display(Name = "633.10a")]
            TenA = 8,
            [Display(Name = "633.10b")]
            TenB = 9,
            [Display(Name = "633.12")]
            Twelve = 10,
            [Display(Name = "633.23")]
            TwentyThree = 11,
            [Display(Name = "633.24")]
            TwentyFour = 12,
        };
        public enum Reasons
        {
            [Display(Name = "Barking (09b)")]
            Barking = 1,
            Wellness = 2,
            [Display(Name = "Food, water, shelter")]
            FWS = 3,
            Conditions = 4,
            [Display(Name = "Animal waste in yard (09a)")]
            AnimalWasteYard = 5,
            [Display(Name = "Animal waste off property (09c)")]
            AnimalWasteElsewhere = 6,
            [Display(Name = "Feeding wildlife")]
            FeedingWildlife = 7,
            [Display(Name = "Count cats")]
            CountCats = 8,
            [Display(Name = "Count animals")]
            CountAnimals = 9,
            [Display(Name = "Feeding stray cats")]
            FeedingStrays = 10,
            [Display(Name = "Running at large (08)")]
            RunningatLarge = 11,
            Other = 12,
        };
}