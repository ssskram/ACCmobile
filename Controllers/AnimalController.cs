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
        // initialize httpclient to be used by all methods
        HttpClient client = new HttpClient();

        // open new animal form
        public IActionResult AnimalForm()
        {
            return View();
        }

        // open partial view
        // called by ajax on client side
        public IActionResult AddAnimal()
        {
            return PartialView();
        }

        // Post animal
        public async Task<IActionResult> PostAnimal(AnimalViewModel model)
        {
            // execute post request 
            // then return here
            await Execute(model);
            // stay on animal form
            // incase there are more to add
            return RedirectToAction(nameof(AnimalController.AnimalForm));
        }
        public async Task Execute(AnimalViewModel model)
        {
            // get necessary header values for api call from environment variables
            var SessionToken = HttpContext.Session.GetString("SessionToken");
            var AddressID = HttpContext.Session.GetString("AddressID");
            var IncidentID = HttpContext.Session.GetString("IncidentID");
            // where you postin?
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items";
            // clear headers
            client.DefaultRequestHeaders.Clear();
            // add headers
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ("Bearer", SessionToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");
            // craft repo-friendly api string with necessary values
            var json = 
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AnimalsItem' }}, 'Type' : '{0}', 'Breed' : '{1}', 'Coat' : '{2}', 'Sex' : '{3}', 'LicenseNumber' : '{4}', 'RabbiesVacNo' : '{5}', 'RabbiesVacExp' : '{6}', 'Veterinarian' : '{7}', 'LicenseYear' : '{8}', 'Age' : '{9}', 'AddressID' : '{10}', 'AdvisoryID' : '{11}', 'Name' : '{12}', 'Comments' : '{13}' }}",
                    model.Type, // 0
                    model.Breed, // 1
                    model.Coat, //2
                    model.Sex, // 3
                    model.LicenseNumber, // 4
                    model.RabbiesVacNo, // 5
                    model.RabbiesVacExp, // 6
                    model.Veterinarian, // 7
                    model.LicenseYear, // 8
                    model.Age, // 9
                    AddressID, // 10
                    IncidentID, // 11
                    model.AnimalName, // 12
                    model.Comments); // 13

            client.DefaultRequestHeaders.Add("ContentLength", json.Length.ToString());
            try // post
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
