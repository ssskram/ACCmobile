using System;
using System.Web;
using System.Collections.Generic;
using System.Globalization;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ACCmobile.Models;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace ACCmobile.Controllers
{
    [Authorize]
    public class Get_Incidents : Controller
    {   
        HttpClient client = new HttpClient();

        // return all incidents
        public async Task<IActionResult> ByAddress()
        {
            await RefreshToken();

            // instantiate empty string to populate with heat map coords
            string HeatMapData = "";

            // instantiate list to populate with paper and electronic incidents
            List<AllIncidents> Advises = new List<AllIncidents>();

            // get and set advises
            await GetAdvises();
            var papercontent = GetAdvises().Result; 
            dynamic PaperAdvises = JObject.Parse(papercontent)["value"];
                foreach (var item in PaperAdvises)
                {
                    DateTime dt = item.Date;
                    AllIncidents adv = new AllIncidents() 
                    {
                        Link = item.link,
                        Date = item.Date,
                        Address = item.address,
                        Coords = item.Geo
                    };
                    Advises.Add(adv);  
                    // write coords to heatmap data if incident occured within last year
                    if (dt.Year == DateTime.Now.Year - 2)
                    {
                        string coord = adv.Coords.ToString();
                        var clean = Regex.Replace(coord, "[()]", "");
                        var bracketed = "[" + clean + "],";
                        HeatMapData += bracketed;
                    }
                }

            // get and set incidents
            await GetIncidents();
            var electroniccontent = GetIncidents().Result;
            dynamic ElectronicIncidents = JObject.Parse(electroniccontent)["value"];
                foreach (var item in ElectronicIncidents)
                {
                    string Link = 
                        String.Format 
                        ("Open?id={0}",
                        item.AdvisoryID); // 0
                    DateTime utc_date = item.Created;
                    DateTime easternTime = utc_date.AddHours(-5);
                    var dateformat = "MM/dd/yyyy HH:mm";
                    AllIncidents adv = new AllIncidents() 
                    {
                        Link = Link,
                        Date = easternTime.ToString(dateformat),
                        Address = item.Address,
                        Coords = item.AddressID
                    };
                    Advises.Add(adv); 

                    // write coords to heatmap data if incident occured within last year
                    if (easternTime.Year == DateTime.Now.Year - 2)
                    {
                        string coord = adv.Coords.ToString();
                        var clean = Regex.Replace(coord, "[()]", "");
                        var bracketed = "[" + clean + "],";
                        HeatMapData += bracketed;
                    }
                }

            // clean and set heatmap data
            HeatMapData = HeatMapData.TrimEnd(',');
            var done = "[" + HeatMapData + "]";
            ViewBag.heatmap = done;
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            ViewData["apistring"] = 
                String.Format 
                ("https://maps.googleapis.com/maps/api/js?key={0}&libraries=places,visualization&callback=initMap",
                    googleapikey); // 0

            return View(Advises);
        }

        // Return specific incident
        public async Task<IActionResult> Open(string id)
        {
            await GetIncident(id);
            var incidentcontent = GetIncident(id).Result; 
            dynamic incidentitem = JObject.Parse(incidentcontent)["value"][0];
            DateTime utc_date = incidentitem.Created;
            DateTime easternTime = utc_date.AddHours(-5);
            var dateformat = "MM/dd/yyyy HH:mm";
            IncidentReport adv = new IncidentReport() 
            {
                OwnersLastName = incidentitem.OwnersLastName,
                OwnersFirstName = incidentitem.OwnersFirstName,
                OwnersTelephoneNumber = incidentitem.OwnersTelephone,
                PGHCode = incidentitem.ADVPGHCode,
                CitationNumber = incidentitem.CitationNumber,
                ReasonForVisit = incidentitem.ReasonforVisit,
                Comments = incidentitem.Comments,
                CallOrigin = incidentitem.CallOrigin,
                IncidentID = incidentitem.AdvisoryID,
                Address = incidentitem.Address,
                AddressID = incidentitem.AddressID,
                Date = easternTime.ToString(dateformat),
                SubmittedBy = incidentitem.SubmittedBy
            };
            await GetAnimals(id);
            var animalcontent = GetAnimals(id).Result; 
            dynamic animalitems = JObject.Parse(animalcontent)["value"];
            List<GetAnimals> Animals = new List<GetAnimals>();
            foreach (var item in animalitems)
            {
                GetAnimals amnl = new GetAnimals() 
                {
                    AnimalName = item.Name,
                    Type = item.Type,
                    Breed = item.Breed,
                    Coat = item.Coat,
                    Sex = item.Sex,
                    Age = item.Age,
                    LicenseNumber = item.LicenseNumber,
                    RabbiesVacNo = item.RabbiesVacNo,
                    RabbiesVacExp = item.RabbiesVacExp,
                    Veterinarian = item.Veterinarian,
                    LicenseYear = item.LicenseYear,
                    Comments = item.Comments
                };
                Animals.Add(amnl); 
            }
            ViewBag.Animals = Animals;
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            ViewData["apistring"] = 
            String.Format 
            ("https://maps.googleapis.com/maps/api/js?key={0}&libraries=places,visualization&callback=initMap",
                googleapikey); // 0
            return View("~/Views/Get_Incidents/IncidentReport.cshtml", adv);
        }

        // api calls

        // Get access token, & set to session      
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

        // get all advises from pdf library
        public async Task<string> GetAdvises()
        {
            var token = HttpContext.Session.GetString("SessionToken");
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('GeocodedAdvises')/items?$top=5000";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ( "Bearer", token);
            string listitems = await client.GetStringAsync(sharepointUrl);
            return listitems;
        }

        // get all incidents from incident table
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

        // get incident selected from table
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

        // get all animals associated with selected incident
        public async Task<string> GetAnimals(string id)
        {
            var token = HttpContext.Session.GetString("SessionToken");
            var sharepointUrl = 
            String.Format 
            ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items?$filter=AdvisoryID eq '{0}'",
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
