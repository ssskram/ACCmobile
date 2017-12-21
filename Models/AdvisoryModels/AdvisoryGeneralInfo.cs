using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class AdvisoryGeneralInfo
    {
        [Display(Name = "Owners Last Name")]
        public string OwnersLastName { get; set; }
        [Display(Name = "Owners First Name")]
        public string OwnersFirstName { get; set; }
        [Display(Name = "Owners Phone Number")]
        public string OwnersTelephoneNumber { get; set; }
        [Display(Name = "ADV. PGH Code")]
        public string PGHCode { get; set; }
        [Display(Name = "Citation Number")]
        public string CitationNumber { get; set; }
        [Display(Name = "Reason for Visit")]
        public string ReasonForVisit { get; set; }
        [DataType(DataType.MultilineText)]
        public string Comments { get; set; }
        public string AccessToken { get; set; }
        public string AddressID { get; set; }
        public string AdvisoryID { get; set; }
    }
}