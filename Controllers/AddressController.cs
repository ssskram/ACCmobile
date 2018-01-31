using System;
using System.Web;
using System.Text.RegularExpressions;
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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace ACCmobile.Controllers
{
    [Authorize]
    public class AddressController : Controller
    {   
        // initialize httpclient to be used by all public methods
        HttpClient client = new HttpClient();

        // Open new address form
        public async Task<IActionResult> AddressForm()
        {
            await RefreshToken();
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            ViewData["apistring"] = 
                String.Format 
                ("https://maps.googleapis.com/maps/api/js?key={0}&libraries=places,visualization&callback=initMap",
                    googleapikey); // 0
            await HeatMapData();
            var relay = new AddressViewModel
            {
                MapCoordinates = HttpContext.Session.GetString("HeatMap")
            };
            return View(relay);
        }

        // Gather access token for api calls, persist as system variable
        [HttpPost]
        public async Task RefreshToken()
        {
            var MSurl = "https://accounts.accesscontrol.windows.net/f5f47917-c904-4368-9120-d327cf175591/tokens/OAuth/2";
            var clientid = Environment.GetEnvironmentVariable("SPClientID");
            var clientsecret = Environment.GetEnvironmentVariable("SPClientSecret");
            var refreshtoken = Environment.GetEnvironmentVariable("refreshtoken");
            var redirecturi = Environment.GetEnvironmentVariable("redirecturi");
            var SPresource = Environment.GetEnvironmentVariable("spresourceid");
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
                string token = results.access_token.ToString();
                HttpContext.Session.SetString("SessionToken", token);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }
        public async Task HeatMapData()
        {
            // craft json load
            var SessionToken = HttpContext.Session.GetString("SessionToken");
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Address')/items?$select=AddressID";
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue ("Bearer", SessionToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            // execute get request
            try
            {              
            string content = await client.GetStringAsync(sharepointUrl);
            dynamic jo = JObject.Parse(content)["value"];
            string bingo = "";
                foreach (var item in jo)
                {
                    string coord = item.AddressID.ToString();
                    var clean = Regex.Replace(coord, "[()]", "");
                    var bracketed = "[" + clean + "],";
                    bingo += bracketed;
                }
            bingo = bingo.TrimEnd(',');
            var almost = "[" + bingo + "]";
            HttpContext.Session.SetString("HeatMap", almost);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }

        // Check to see if address exists
        // If yes, get addressid and pass along
        // If no, post new address
        public async Task<IActionResult> Create(AddressViewModel model)
        {
            await Execute(model);
            HttpContext.Session.SetString("Address", model.AddressClass);
            return RedirectToAction(nameof(IncidentController.IncidentForm), "Incident");
        }
        public async Task Execute(AddressViewModel model)
        {
            var SessionToken = HttpContext.Session.GetString("SessionToken");
            // craft json load
            var sharepointUrl = 
                String.Format
                ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Address')/items?$filter= Address eq '{0}'",
                    model.AddressClass); // 0
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue ("Bearer", SessionToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            // execute get request
            try
            {              
                string content = await client.GetStringAsync(sharepointUrl);
                if (content.Contains(model.AddressClass)) // address exists
                {
                    // assign existing addressid to variable and set as tempdata for next controller
                    var oldaddressid = JObject.Parse(content)["d"]["results"][0]["AddressID"];
                    string oldaddress = oldaddressid.ToString();
                    HttpContext.Session.SetString("AddressID", oldaddress);
                }
                else // post new address 
                {
                    string newaddress = model.AddressID.ToString();
                    HttpContext.Session.SetString("AddressID", newaddress);
                    await Post(model);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }

        // post new address
        public async Task Post(AddressViewModel model)
        {
            var SessionToken = HttpContext.Session.GetString("SessionToken");
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Address')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue ("Bearer", SessionToken);
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
