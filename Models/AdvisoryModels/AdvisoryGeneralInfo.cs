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
        public string PGHCodeRelay { get; set; }

        [Display(Prompt = "Citation Number")]
        public string CitationNumber { get; set; }

        [Display(Prompt = "Reason for Visit")]
        public string ReasonForVisitRelay { get; set; }
        
        [Display(Prompt = "Comments")]
        [DataType(DataType.MultilineText)]
        public string Comments { get; set; }
        
        // begin hidden fields
        public string AccessToken { get; set; }
        public string AddressID { get; set; }
        public string AdvisoryID { get; set; }
        public string ReasonForVisit { get; set; }
        public string PGHCode { get; set; }
    }
}