using System;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    // address view model
    public class NewAddress
    {
        [Display(Prompt = "Enter an address")]
        public string AddressRelay { get; set; }

        // begin hidden fields
        public string Coords { get; set; }
        public string Address { get; set; }
    }

    // post view models
    public class NewDescription
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
        [Display(Prompt = "Call Origin")]
        public string CallOrigin { get; set; }
        public string OfficersRelay { get; set; }
        public string Open { get; set; }
        
        // begin hidden fields
        public string IncidentID { get; set; }
        public string ReasonForVisit { get; set; }
        public string PGHCode { get; set; }
        public string Address { get; set; }
        public string Coords { get; set; }
        public string Officers { get; set; }
    }

    public class NewAnimal
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

        [Display(Prompt = "Rabies Vac. #")]
        public string RabiesVacNo { get; set; }

        [Display(Prompt = "Rabies Vac. Exp.")]
        public string RabiesVacExp { get; set; }

        [Display(Prompt = "Veterinarian")]
        [DataType(DataType.MultilineText)]
        public string Veterinarian { get; set; }

        [Display(Prompt = "License Year")]
        public string LicenseYear { get; set; }

        [Display(Prompt = "Age")]
        public string Age { get; set; }

        [Display(Prompt = "Name")]
        public string AnimalName { get; set; }
        [Display(Prompt = "Comments")]
        [DataType(DataType.MultilineText)]
        public string Comments { get; set; }

        // begin hidden fields
        public string Type { get; set; }
        public string Breed { get; set; }
        public string Coat { get; set; }
        public string Sex { get; set; }
        public string IncidentID { get; set; }
        public string Address { get; set; }
        public string Coords { get; set; }
        public string AnimalID { get; set; }
    }
    
    // get view models
    public class AllIncidents
    {
        public string Link { get; set; }
        public string id { get; set; }
        public string Date { get; set; }
        public string Address { get; set; }
        public string Coords { get; set; }
        public string ReasonForVisit { get; set; }
        public string googledir { get; set; }
    }

    public class GetIncident
    {
        public string OwnersLastName { get; set; }
        public string OwnersFirstName { get; set; }
        public string OwnersTelephoneNumber { get; set; }
        public string PGHCode { get; set; }
        public string PGHCodeRelay { get; set; }
        public string CitationNumber { get; set; }
        public string ReasonForVisit { get; set; }
        public string ReasonForVisitRelay { get; set; }
        [DataType(DataType.MultilineText)]
        public string Comments { get; set; }
        public string CallOrigin { get; set; }
        public string IncidentID { get; set; }
        public string Address { get; set; }
        public string AddressRelay { get; set; }
        public string Coords { get; set; }
        public string Date { get; set; }
        public string SubmittedBy { get; set; }
        public string itemID { get; set; }
        public string Type { get; set; }
        public string TypeRelay { get; set; }
        public string Breed { get; set; }
        public string BreedRelay { get; set; }
        public string Coat { get; set; }
        public string CoatRelay { get; set; }
        public string Sex { get; set; }
        public string SexRelay { get; set; }
        public string LicenseNumber { get; set; }
        public string RabiesVacNo { get; set; }
        public string RabiesVacExp { get; set; }
        public string Veterinarian { get; set; }
        public string LicenseYear { get; set; }
        public string Age { get; set; }
        public string AnimalName { get; set; }
        public string AnimalComments { get; set; }
        public string animalitemID { get; set; }
        public string OfficersRelay { get; set; }
        public string Officers { get; set; }
        public string ModifiedBy { get; set; }
        public string Open { get; set; }
    }
    
    public class GetAnimal
    {
        public string AnimalName { get; set; }
        public string Type { get; set; }
        public string Breed { get; set; }
        public string Coat { get; set; }
        public string Sex { get; set; }
        public string LicenseNumber { get; set; }
        public string RabiesVacNo { get; set; }
        public string RabiesVacExp { get; set; }
        public string Veterinarian { get; set; }
        public string LicenseYear { get; set; }
        public string Age { get; set; }
        public string Comments { get; set; }
        public string itemID { get; set; }
    }
}