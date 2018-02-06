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
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace ACCmobile.Controllers
{
    [Authorize]
    public class GetIncidentsController : Controller
    {   
        // initialize httpclient to be used by all methods
        HttpClient client = new HttpClient();

        // return all incidents by address
        public async Task<IActionResult> ByAddress()
        {
            await RefreshToken();
            await GetAdvises();
            var papercontent = GetAdvises().Result; 
            dynamic PaperAdvises = JObject.Parse(papercontent)["value"];
            await GetIncidents();
            var electroniccontent = GetIncidents().Result;
            dynamic ElectronicIncidents = JObject.Parse(electroniccontent)["value"];
            List<AllIncidents> Advises = new List<AllIncidents>();

                foreach (var item in PaperAdvises)
                {
                    var uncodedName = item.Name.ToString();
                    var encodedName = System.Web.HttpUtility.UrlPathEncode(uncodedName);
                    var doclink =
                        String.Format
                        ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/ScannedAdvises/{0}",
                            encodedName); // 0

                    char[] whitespace = {' ',' '};
                    char[] period = {'.',' '};
                    char[] brackets={'{','}',' '};
                    char[] adv_char = {'A', 'D','V','a','d','v',' ' };
                    char[] pdf_char = {'P','D','F','p','d','f',' ' };
                    string name = item.Name.ToString();
                    string adv_trimmed = name.TrimStart(adv_char);
                    string pdf_trimmed = adv_trimmed.TrimEnd(pdf_char);
                    string date = pdf_trimmed.Split(' ').First();
                    string date_trimmed= date.TrimEnd(whitespace);
                    string address = pdf_trimmed.Remove(0, pdf_trimmed.IndexOf(' ') + 1);
                    string address_nowhitespace = address.TrimStart(whitespace);
                    string address_trimmed = address_nowhitespace.TrimEnd(period);
                    string address_formatted = 
                        String.Format 
                        ("{0}, Pittsburgh PA",
                            address_trimmed); // 0
                    string address_encoded = address_formatted.Replace(" ", "+");
                    var key = Environment.GetEnvironmentVariable("googleapikey");
                    var geo_call =
                        String.Format 
                        ("https://maps.googleapis.com/maps/api/geocode/json?address={0}&key={1}",
                        address_encoded, // 0
                        key); // 1
                    client.DefaultRequestHeaders.Clear();
                    string address_geocoded = await client.GetStringAsync(geo_call);
                    dynamic deseralize_4address = JsonConvert.DeserializeObject<dynamic>(address_geocoded)["results"][0];
                    string formatted_address = deseralize_4address.formatted_address.ToString();
                    dynamic deseralize_4coords = JsonConvert.DeserializeObject<dynamic>(address_geocoded)["results"][0]["geometry"];
                    string formatted_coords = deseralize_4coords.location.ToString();
                    var formatted_coords_nobrackets = formatted_coords.TrimEnd(brackets);
                    var formatted_coords_clean = formatted_coords_nobrackets.TrimStart(brackets);

                    AllIncidents adv = new AllIncidents() 
                    {
                        Link = doclink,
                        Date = date_trimmed,
                        Address = formatted_address,
                        Coords = formatted_coords_clean
                    };
                    Advises.Add(adv);  
                }
                foreach (var item in ElectronicIncidents)
                {
                    string Link = 
                        String.Format 
                        ("Open?id={0}",
                        item.AdvisoryID); // 0
                    AllIncidents adv = new AllIncidents() 
                    {
                        Link = Link,
                        Date = item.Created,
                        Address = item.Address,
                        Coords = item.AddressID
                    };
                    Advises.Add(adv); 
                }
            return View("~/Views/GetIncidents/ByAddress.cshtml", Advises);
        }

        // // return all incidents by date
        // public async Task<IActionResult> ByDate()
        // {

        // }

        // // return electronic incidents by animal
        // public async Task<IActionResult> ByAnimal()
        // {

        // }

        // //return electronic incidents by owner
        // public async Task<IActionResult> ByOwner()
        // {

        // }

        // services       
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
            StringContent strContent = new StringContent(json);               
            strContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/x-www-form-urlencoded");
            HttpResponseMessage response = client.PostAsync(MSurl, strContent).Result;       
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            dynamic results = JsonConvert.DeserializeObject<dynamic>(content);
            string token = results.access_token.ToString();
            HttpContext.Session.SetString("SessionToken", token);
        }
        public async Task<string> GetAdvises()
        {
            var token = HttpContext.Session.GetString("SessionToken");
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/GetFolderByServerRelativeUrl('ScannedAdvises')/Files";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ( "Bearer", token);
            string listitems = await client.GetStringAsync(sharepointUrl);
            return listitems;
        }
        public async Task<string> GetIncidents()
        {
            var token = HttpContext.Session.GetString("SessionToken");
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ( "Bearer", token);
            string listitems = await client.GetStringAsync(sharepointUrl);
            return listitems;
        }

        public async Task<IActionResult> Open(string id)
        {
            await GetIncident(id);
            var content = GetIncident(id).Result; 
            dynamic item = JObject.Parse(content)["value"][0];
            GetIncident adv = new GetIncident() 
            {
                OwnersLastName = item.OwnersLastName,
                OwnersFirstName = item.OwnersFirstName,
                OwnersTelephoneNumber = item.OwnersTelephone,
                PGHCode = item.ADVPGHCode,
                CitationNumber = item.CitationNumber,
                ReasonForVisit = item.ReasonforVisit,
                Comments = item.Comments,
                CallOrigin = item.CallOrigin,
                IncidentID = item.AdvisoryID,
                Address = item.Address,
                AddressID = item.AddressID,
                Date = item.Created
            };
            return View("~/Views/GetIncidents/IncidentReport.cshtml", adv);
        }
        public async Task<string> GetIncident(string id)
        {
            var token = HttpContext.Session.GetString("SessionToken");
            var sharepointUrl = 
            String.Format 
            ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items?$filter=AdvisoryID eq '{0}'",
                id); // 0
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ( "Bearer", token);
            string listitems = await client.GetStringAsync(sharepointUrl);
            return listitems;
        }
    }
}
