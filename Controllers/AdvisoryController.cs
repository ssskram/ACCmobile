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
    public class AdvisoryController : Controller
    {   
        // initialize httpclient to be used by all public methods
        HttpClient client = new HttpClient();

        // Open new advisory form
        public IActionResult AdvisoryForm()
        {
            var SessionToken = HttpContext.Session.GetString("SessionToken");
            var relay = new AdvisoryGeneralInfo
                {
                    AccessToken = SessionToken.ToString(),
                    AdvisoryID = (Guid.NewGuid().ToString())
                };
            return View(relay);
        }

        // Post advisory data and continue to animal form
        public async Task<IActionResult> Create(AdvisoryGeneralInfo model)
        {
            TempData["AdvisoryID"] = model.AdvisoryID;
            await Execute(model);
            return RedirectToAction(nameof(AnimalController.AnimalForm), "Animal");
        }
        public async Task Execute(AdvisoryGeneralInfo model)
        {
            var AddressID = (TempData["AddressID"].ToString());
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Advises')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue ("Bearer", model.AccessToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");
            var json = 
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AdvisesItem' }}, 'OwnersFirstName' : '{0}', 'OwnersLastName' : '{1}', 'OwnersTelephone' : '{2}', 'ReasonforVisit' : '{3}', 'ADVPGHCode' : '{4}', 'CitationNumber' : '{5}', 'Comments' : '{6}', 'AddressID' : '{7}', 'AdvisoryID' : '{8}' }}",
                    model.OwnersFirstName, // 0
                    model.OwnersLastName, // 1
                    model.OwnersTelephoneNumber, // 2
                    model.ReasonForVisit, // 3
                    model.PGHCode, // 4
                    model.CitationNumber, // 5
                    model.Comments, // 6
                    AddressID, // 7 
                    model.AdvisoryID); // 8
                    
                
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
