using System;
using System.Web;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ACCmobile.Models;
using ACCmobile.Models.AccountViewModels;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using System.Net;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Collections.Specialized;
using Microsoft.AspNetCore.Http;

namespace ACCmobile.Controllers
{
    [Authorize]
    public class AnimalController : Controller
    {   
        // initialize httpclient to be used by all public methods
        HttpClient client = new HttpClient();

        // Open new animal form
        public IActionResult AnimalForm()
        {
            return View();
        }

        // ajax calls to duplicate partial view
        public IActionResult AddAnimal()
        {
            return PartialView("_AnimalCollection", new AnimalViewModel());
        }

        // Post address data and return to home 
        public async Task<IActionResult> Create(AnimalCollectionModel model)
        {
            await Execute(model);
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }
        public async Task Execute(AnimalCollectionModel model)
        {
            var SessionToken = HttpContext.Session.GetString("SessionToken");
            var AddressID = HttpContext.Session.GetString("AddressID");
            var IncidentID = HttpContext.Session.GetString("IncidentID");
            
            //  end of process...clear session variables
            HttpContext.Session.Remove("SessionToken");
            HttpContext.Session.Remove("AddressID");
            HttpContext.Session.Remove("IncidentID");

            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue ("Bearer", SessionToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");

            var json = 
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AnimalsItem' }}, 'Type' : '{0}' }}", // 'Breed' : '{1}', 'Coat' : '{2}', 'Sex' : '{3}', 'LicenseNumber' : '{4}', 'RabbiesVacNo' : '{5}', 'RabbiesVacExp' : '{6}', 'Veterinarian' : '{7}', 'LicenseYear' : '{8}', 'Age' : '{9}', 'AddressID' : '{10}', 'AdvisoryID' : '{11}', 'Name' : '{12}' }}",
                    model.AnimalItems); // 0
                    // model.Breed, // 1
                    // model.Coat, //2
                    // model.Sex, // 3
                    // model.LicenseNumber, // 4
                    // model.RabbiesVacNo, // 5
                    // model.RabbiesVacExp, // 6
                    // model.Veterinarian, // 7
                    // model.LicenseYear, // 8
                    // model.Age, // 9
                    // AddressID, // 10
                    // IncidentID, // 11
                    // model.AnimalName); // 12
                
            client.DefaultRequestHeaders.Add("ContentLength", json.Length.ToString());
            try
            {
                StringContent strContent = new StringContent(json);               
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync(sharepointUrl, strContent).Result;
                        
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }
    }
}
