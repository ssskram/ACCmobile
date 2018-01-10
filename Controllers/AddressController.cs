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
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Collections.Specialized;

namespace ACCmobile.Controllers
{
    [Authorize]
    public class AddressController : Controller
    {   
        // method for demoing ajax duplicate partial view
        // public IActionResult AddressGeneralInfo()
        // {
        //     return PartialView();
        // }

        // Open new address form
        public async Task<IActionResult> AddressForm()
        {
            await RefreshToken();
            var relay = new Address
                {
                    AccessToken = (TempData["accesstoken"].ToString()),
                    AddressID = (Guid.NewGuid().ToString())
                };
            return View(relay);
        }

        // Gather access token for api calls
        [HttpPost]
        public async Task RefreshToken()
        {
            var MSurl = "https://accounts.accesscontrol.windows.net/f5f47917-c904-4368-9120-d327cf175591/tokens/OAuth/2";
            var clientid = Environment.GetEnvironmentVariable("SPClientID");
            var clientsecret = Environment.GetEnvironmentVariable("SPClientSecret");
            var refreshtoken = Environment.GetEnvironmentVariable("refreshtoken");
            var redirecturi = Environment.GetEnvironmentVariable("redirecturi");
            var SPresource = Environment.GetEnvironmentVariable("spresourceid");
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/x-www-form-urlencoded");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");

            var json =
                String.Format 
            ("grant_type=refresh_token&client_id={0}&client_secret={1}&refresh_token={2}&redirect_uri={3}&resource={4}",
                clientid, // 0
                clientsecret, // 1
                refreshtoken, // 2
                redirecturi, // 3
                SPresource); // 4

            client.DefaultRequestHeaders.Add("ContentLength", json.Length.ToString());
            try
            {
                StringContent strContent = new StringContent(json);               
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/x-www-form-urlencoded");
                HttpResponseMessage response = client.PostAsync(MSurl, strContent).Result;
                        
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                dynamic results = JsonConvert.DeserializeObject<dynamic>(content);
                TempData["accesstoken"] = results.access_token; 
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }

        // Check to see if address exists
        // If yes, get addressid and pass along
        // If no, post new address
        public async Task<IActionResult> Create(Address model)
        {
            await Execute(model);
            return RedirectToAction(nameof(AdvisoryController.AdvisoryForm), "Advisory");
        }
        public async Task Execute(Address model)
        {
            // craft json load
            var sharepointUrl = 
                String.Format
                ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Address')/items?$filter= Address eq '{0}'",
                    model.AddressClass); // 0
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue ("Bearer", model.AccessToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            // execute get request
            try
            {              
                string content = await client.GetStringAsync(sharepointUrl);
                if (content.Contains(model.AddressClass))
                {
                    var oldaddressid = JObject.Parse(content)["d"]["results"][0]["AddressID"];
                    TempData["AddressID"] = oldaddressid.ToString();
                }
                else
                {
                    TempData["AddressID"] = model.AddressID;
                    await Post(model);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }

        // post new address
        public async Task Post(Address model)
        {
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Address')/items";
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue ("Bearer", model.AccessToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");

            var json = 
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AddressListItem' }}, 'Address' : '{0}', 'AddressID' : '{1}' }}",
                    model.AddressClass, // 0
                    model.AddressID); // 1
                
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
