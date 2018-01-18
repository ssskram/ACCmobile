using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ACCmobile.Models
{
    public class AnimalCollectionModel
    {
        public List<AnimalViewModel> AnimalItems { get; set; } = new List<AnimalViewModel>();
    }
}