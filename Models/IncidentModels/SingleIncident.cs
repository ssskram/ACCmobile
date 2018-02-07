using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class SingleIncident
    {
        public string OwnersLastName { get; set; }
        public string OwnersFirstName { get; set; }
        public string OwnersTelephoneNumber { get; set; }
        public string PGHCode { get; set; }
        public string CitationNumber { get; set; }
        public string ReasonForVisit { get; set; }
        public string Comments { get; set; }
        public string CallOrigin { get; set; }
        public string IncidentID { get; set; }
        public string Address { get; set; }
        public string AddressID { get; set; }
        public string Date { get; set; }
    }
}