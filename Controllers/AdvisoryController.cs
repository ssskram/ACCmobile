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

namespace ACCmobile.Controllers
{
    [Authorize]
    public class AdvisoryController : Controller
    {   
        // initialize httpclient to be used by all public methods
        HttpClient client = new HttpClient();

        // Open new advisory form
        public async Task<IActionResult> AdvisoryForm()
        {
            var tokenhelper = new Functions();
            await tokenhelper.RefreshToken();
            var relay = new AdvisoryGeneralInfo
                {
                    AccessToken = (TempData["accesstoken"].ToString()),
                    AdvisoryID = (Guid.NewGuid().ToString())
                };
            return View(relay);
        }

        // // Gather access token for api calls
        // [HttpPost]
        // public async Task RefreshToken()
        // {
        //     var MSurl = "https://accounts.accesscontrol.windows.net/f5f47917-c904-4368-9120-d327cf175591/tokens/OAuth/2";
        //     var clientid = Environment.GetEnvironmentVariable("SPClientID");
        //     var clientsecret = Environment.GetEnvironmentVariable("SPClientSecret");
        //     var refreshtoken = Environment.GetEnvironmentVariable("refreshtoken");
        //     var redirecturi = Environment.GetEnvironmentVariable("redirecturi");
        //     var SPresource = Environment.GetEnvironmentVariable("spresourceid");
        //     client.DefaultRequestHeaders.Clear();
        //     client.DefaultRequestHeaders.Add("Accept", "application/x-www-form-urlencoded");
        //     client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");

        //     var json =
        //         String.Format 
        //     ("grant_type=refresh_token&client_id={0}&client_secret={1}&refresh_token={2}&redirect_uri={3}&resource={4}",
        //         clientid, // 0
        //         clientsecret, // 1
        //         refreshtoken, // 2
        //         redirecturi, // 3
        //         SPresource); // 4

        //     client.DefaultRequestHeaders.Add("ContentLength", json.Length.ToString());
        //     try
        //     {
        //         StringContent strContent = new StringContent(json);               
        //         strContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/x-www-form-urlencoded");
        //         HttpResponseMessage response = client.PostAsync(MSurl, strContent).Result;
                        
        //         response.EnsureSuccessStatusCode();
        //         var content = await response.Content.ReadAsStringAsync();
        //         dynamic results = JsonConvert.DeserializeObject<dynamic>(content);
        //         TempData["accesstoken"] = results.access_token; 
        //     }
        //     catch (Exception ex)
        //     {
        //         System.Diagnostics.Debug.WriteLine(ex.Message);
        //     }
        // }

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
