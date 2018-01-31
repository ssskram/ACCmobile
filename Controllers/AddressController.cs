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

    // methods to handle loading of address module

        // open new address form
        public async Task<IActionResult> AddressForm()
        {
            // generate new SP access token, and return here
            await RefreshToken();
            // get google API key from environment variable
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            // craft repo-friendly api string for google
            ViewData["apistring"] = 
                String.Format 
                ("https://maps.googleapis.com/maps/api/js?key={0}&libraries=places,visualization&callback=initMap",
                    googleapikey); // 0
            // gather collection of coordinates to heatmap, and return here
            await HeatMapData();
            // generate new address model to pass to view
            var addressmodel = new AddressViewModel
            {
                // set MapCoordinates field to string of coordinates generated 
                // and set to session variable in HeatMapData() method 
                MapCoordinates = HttpContext.Session.GetString("HeatMap")
            };
            // return view, passing new addressviewmodel along
            // coordinates within hidden field will be ingested by js method on client side
            return View(addressmodel);
        }

        // gather access token for SP api calls, and persist as session variable
        [HttpPost]
        public async Task RefreshToken()
        {
            // get necessary header values for api call from environment variables
            // (these were configured in startup)
            var MSurl = "https://accounts.accesscontrol.windows.net/f5f47917-c904-4368-9120-d327cf175591/tokens/OAuth/2";
            var clientid = Environment.GetEnvironmentVariable("SPClientID");
            var clientsecret = Environment.GetEnvironmentVariable("SPClientSecret");
            var refreshtoken = Environment.GetEnvironmentVariable("refreshtoken");
            var redirecturi = Environment.GetEnvironmentVariable("redirecturi");
            var SPresource = Environment.GetEnvironmentVariable("spresourceid");
            // initialize httpclient and and clear headers
            // then, add a few
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/x-www-form-urlencoded");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");
            // craft repo-friendly api string with necessary values
            var json =
                String.Format 
            ("grant_type=refresh_token&client_id={0}&client_secret={1}&refresh_token={2}&redirect_uri={3}&resource={4}",
                clientid, // 0
                clientsecret, // 1
                refreshtoken, // 2
                redirecturi, // 3
                SPresource); // 4

            client.DefaultRequestHeaders.Add("ContentLength", json.Length.ToString());
            try // POST to ms access control service
            {
                // using newtonsoft
                // generate string from var json
                StringContent strContent = new StringContent(json);         
                // add headers      
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/x-www-form-urlencoded");
                // post and prepare for response
                HttpResponseMessage response = client.PostAsync(MSurl, strContent).Result;
                response.EnsureSuccessStatusCode();
                // write response to var content
                var content = await response.Content.ReadAsStringAsync();
                // deserialize into dynamic object, results
                dynamic results = JsonConvert.DeserializeObject<dynamic>(content);
                // parse out token from deserialized object
                string token = results.access_token.ToString();
                // set token to session variable
                HttpContext.Session.SetString("SessionToken", token);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }

        // gather desirable coordinates to heatmap
        public async Task HeatMapData()
        {
            // get sp access token and set to variable
            var SessionToken = HttpContext.Session.GetString("SessionToken");
            // what you gettin?
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Address')/items?$select=AddressID";
            // clear the headers
            client.DefaultRequestHeaders.Clear();
            // set the headers
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ("Bearer", SessionToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            try // execute get request
            {
            // set response to content string
            string content = await client.GetStringAsync(sharepointUrl);
            // parse out content into dynamic object, parsed
            dynamic parsed = JObject.Parse(content)["value"];
            // create empty string, and call it bingo, just because
            string bingo = "";
            // and now it gets wierd...
            // coordinates need to be pulled out of the object, parsed
            // then coordinates need to be formatted, within and amongst themselves
            // so google will accept them when passed to the visualization api 
            foreach (var item in parsed)
            {
                // pull out AddressId (coordinates) and set to coord
                string coord = item.AddressID.ToString();
                // remove all brackets and parentheses
                // leaving only coords delimited with comma
                var clean = Regex.Replace(coord, "[()]", "");
                // bookend coords with brackets
                var bookendbrackets = "[" + clean + "],";
                // add product to empty bingo var
                bingo += bookendbrackets;
            }
            // once bingo contains all desirable coords, take the comma off of the end
            bingo = bingo.TrimEnd(',');
            // bookend with brackets
            var almost = "[" + bingo + "]";
            // and finally, set to session variable
            HttpContext.Session.SetString("HeatMap", almost);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }

    // methods to handle moving past address module

        // address has been validated
        // "Next" has been clicked...
        // if address already exists in table, then those coordinates need to be collected and passed forward
        // if address does not yet exist, then post to table
        public async Task<IActionResult> Next(AddressViewModel model)
        {
            // check address entered against existing addresses in table
            // post if necessary
            // then return here
            await CheckAddress(model);
            // regardless of whether address needs to post or not, assign valided address to session variable
            HttpContext.Session.SetString("Address", model.AddressClass);
            // proceed to incident module
            return RedirectToAction(nameof(IncidentController.IncidentForm), "Incident");
        }

        // check address against table
        public async Task CheckAddress(AddressViewModel model)
        {
            // get sp access token and set to variable
            var SessionToken = HttpContext.Session.GetString("SessionToken");
            // craft GET request for specific address entered
            var sharepointUrl = 
                String.Format
                ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Address')/items?$filter= Address eq '{0}'",
                    model.AddressClass); // 0
            // clear the headers
            client.DefaultRequestHeaders.Clear();
            // set the headers
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ("Bearer", SessionToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            try // execute get request
            {    
                // set response to content string          
                string content = await client.GetStringAsync(sharepointUrl);
                if (content.Contains(model.AddressClass)) // address exists in string
                {
                    // parse out coordinates
                    var oldaddressid = JObject.Parse(content)["d"]["results"][0]["AddressID"];
                    // set to string
                    string oldaddress = oldaddressid.ToString();
                    // set string to session variable
                    HttpContext.Session.SetString("AddressID", oldaddress);
                }
                else // post new address 
                {
                    // set coords to string
                    string newaddress = model.AddressID.ToString();
                    // set string to session variable
                    HttpContext.Session.SetString("AddressID", newaddress);
                    // pass data model to Post method
                    // then, return here
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
            // get sp access token and set to variable
            var SessionToken = HttpContext.Session.GetString("SessionToken");
            // where you postin?
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Address')/items";
            // clear the headers
            client.DefaultRequestHeaders.Clear();
            // set the headers
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ("Bearer", SessionToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");
            // craft repo-friendly api string with necessary values
            var json = 
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AddressListItem' }}, 'Address' : '{0}', 'AddressID' : '{1}' }}",
                    model.AddressClass, // 0
                    model.AddressID); // 1
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
