using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class AdvisoryGeneralInfo
    {
        [Display(Prompt = "Owners Last Name")]
        public string OwnersLastName { get; set; }

        [Display(Prompt = "Owners First Name")]
        public string OwnersFirstName { get; set; }

        [Display(Prompt = "Owners Phone Number")]
        public string OwnersTelephoneNumber { get; set; }

        [Display(Prompt = "ADV. PGH Code")]
        public string PGHCode { get; set; }

        [Display(Prompt = "Citation Number")]
        public string CitationNumber { get; set; }

        [Display(Prompt = "Reason for Visit")]
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
            TwoA,
            [Display(Name = "633.03")]
            Three,
            [Display(Name = "633.05")]
            Five,
            [Display(Name = "633.07a")]
            SevenA,
            [Display(Name = "633.09a")]
            NineA,
            [Display(Name = "633.09b")]
            NineB,
            [Display(Name = "633.09c")]
            NineC,
            [Display(Name = "633.10a")]
            TenA,
            [Display(Name = "633.10b")]
            TenB,
            [Display(Name = "633.12")]
            Twelve,
            [Display(Name = "633.23")]
            TwentyThree,
            [Display(Name = "633.24")]
            TwentyFour,
        };
        public enum Reasons
        {
            [Display(Name = "Barking (09b)")]
            Barking,
            Wellness,
            [Display(Name = "Food, water, shelter")]
            FWS,
            Conditions,
            [Display(Name = "Animal waste in yard (09a)")]
            AnimalWasteYard,
            [Display(Name = "Animal waste off property (09c)")]
            AnimalWasteElsewhere,
            [Display(Name = "Feeding wildlife")]
            FeedingWildlife,
            [Display(Name = "Count cats")]
            CountCats,
            [Display(Name = "Count animals")]
            CountAnimals,
            [Display(Name = "Feeding stray cats")]
            FeedingStrays,
            [Display(Name = "Running at large (08)")]
            RunningatLarge,
            Other,
        };
}