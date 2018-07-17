using System;

namespace accmobile.Models {
    public class allIncidents {
        public string uuid { get; set; }
        public string link { get; set; }
        public DateTime date { get; set; }
        public string address { get; set; }
        public string itemId { get; set; }
        public string coords { get; set; }
        public string reasonForVisit { get; set; }
        public string note { get; set; }
        public string ownersLastName { get; set; }
        public string ownersFirstName { get; set; }
        public string ownersTelephoneNumber { get; set; }
        public string pghCode { get; set; }
        public string citationNumber { get; set; }
        public string comments { get; set; }
        public string callOrigin { get; set; }
        public string submittedBy { get; set; }
        public string modifiedBy { get; set; }
        public string officerInitials { get; set; }
        public string open { get; set; }
    }
}