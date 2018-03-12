using System;
using System.Web;
using System.Collections.Generic;
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
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace ACCmobile.Controllers
{
    // get methods
    [Authorize]
    public class Incidents : Controller
    {
        HttpClient client = new HttpClient();

        // get all incidents
        public async Task<IActionResult> All()
        {
            // empty string to populate with heat map coords
            string HeatMapData = "";
            // list to populate with "paper" and electronic incidents
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
                    ("Report?id={0}",
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

            return View("~/Views/Incidents/Get/All.cshtml", Advises);
        }

        // get single incident
        public async Task<IActionResult> Report(string id)
        {
            await GetIncident(id);
            var incidentcontent = GetIncident(id).Result;
            dynamic incidentitem = JObject.Parse(incidentcontent)["value"][0];
            DateTime utc_date = incidentitem.Created;
            DateTime easternTime = utc_date.AddHours(-5);
            var dateformat = "MM/dd/yyyy HH:mm";
            GetIncident adv = new GetIncident()
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
            List<GetAnimal> Animals = new List<GetAnimal>();
            foreach (var item in animalitems)
            {
                GetAnimal amnl = new GetAnimal()
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
            return View("~/Views/Incidents/Get/Report.cshtml", adv);
        }

        // api calls

        // get all advises from pdf library
        public async Task<string> GetAdvises()
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('GeocodedAdvises')/items?$top=5000";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            string listitems = await client.GetStringAsync(sharepointUrl);
            return listitems;
        }

        // get all incidents
        public async Task<string> GetIncidents()
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            string listitems = await client.GetStringAsync(sharepointUrl);
            return listitems;
        }

        // get incident selected from table
        public async Task<string> GetIncident(string id)
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            var sharepointUrl =
            String.Format
            ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items?$filter=AdvisoryID eq '{0}'",
                id); // 0
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            string listitems = await client.GetStringAsync(sharepointUrl);
            return listitems;
        }

        // get all animals associated with selected incident
        public async Task<string> GetAnimals(string id)
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            var sharepointUrl =
            String.Format
            ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items?$filter=AdvisoryID eq '{0}'",
                id); // 0
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            string listitems = await client.GetStringAsync(sharepointUrl);
            return listitems;
        }

        // Get access token   
        private async Task<string> refreshtoken()
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
            return token;
        }
    }

    // post methods
    [Authorize]
    public class NewIncident : Controller
    {
        HttpClient client = new HttpClient();

        private readonly UserManager<ApplicationUser> _userManager;
        public NewIncident(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // Load address view, and pass along google api key to client
        public IActionResult Address()
        {
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            ViewData["apistring"] =
                String.Format
                ("https://maps.googleapis.com/maps/api/js?key={0}&libraries=places,visualization&callback=initMap",
                    googleapikey); // 0
            return View("~/Views/Incidents/New/Address.cshtml");
        }

        // initialize NewIncident model with address data
        // open description view and pass along google api key
        public IActionResult Description(NewAddress model)
        {
            char[] comma = {',',' '};
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            ViewData["apistringmap"] =
                String.Format
                ("https://maps.googleapis.com/maps/api/js?key={0}&callback=initMap",
                    googleapikey); // 0
            // clean coords for map
            string coord = model.Coords.ToString();
            string coord_clean = Regex.Replace(coord, "[()]", "");
            string lat_dirty = coord_clean.Split(' ').First();
            string lat = lat_dirty.TrimEnd(comma);
            string lng = coord_clean.Split(' ').Last();
            ViewBag.Lat = lat;
            ViewBag.Long = lng;
            var incidentmodel = new NewDescription
            {
                IncidentID = (Guid.NewGuid().ToString()),
                Address = model.Address,
                Coords = model.Coords
            };
            return View("~/Views/Incidents/New/Description.cshtml", incidentmodel);
        }

        // post incident description
        // open animal view
        public async Task<IActionResult> Animal(NewDescription model)
        {
            await PostIncident(model);
            ViewBag.IncidentAddress = model.Address;
            ViewBag.IncidentFirstName = model.OwnersFirstName;
            ViewBag.IncidentLastName = model.OwnersLastName;
            ViewBag.IncidentReason = model.ReasonForVisit;
            var animalmodel = new NewAnimal
            {
                IncidentID = model.IncidentID,
                Address = model.Address,
                Coords = model.Coords
            };
            return View("~/Views/Incidents/New/Animal.cshtml", animalmodel);
        }

        // add another animal
        public IActionResult _Animal()
        {
            return PartialView("~/Views/Incidents/New/_Animal.cshtml");
        }

        // post animal
        public async Task<IActionResult> PostAnimal(NewAnimal model)
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            var AddressID = HttpContext.Session.GetString("AddressID");
            var IncidentID = HttpContext.Session.GetString("IncidentID");
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");
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
            return RedirectToAction("Animal");
        }

        // post incident
        public async Task PostIncident(NewDescription model)
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            string SubmittedBy = _userManager.GetUserName(HttpContext.User);
            var AddressID = HttpContext.Session.GetString("AddressID");
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");
            var json =
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AdvisesItem' }}, 'OwnersFirstName' : '{0}', 'OwnersLastName' : '{1}', 'OwnersTelephone' : '{2}', 'ReasonforVisit' : '{3}', 'ADVPGHCode' : '{4}', 'CitationNumber' : '{5}', 'Comments' : '{6}', 'AddressID' : '{7}', 'AdvisoryID' : '{8}', 'SubmittedBy' : '{9}', 'CallOrigin' : '{10}', 'Address' : '{11}' }}",
                    model.OwnersFirstName, // 0
                    model.OwnersLastName, // 1
                    model.OwnersTelephoneNumber, // 2
                    model.ReasonForVisit, // 3
                    model.PGHCode, // 4
                    model.CitationNumber, // 5
                    model.Comments, // 6
                    AddressID, // 7 
                    model.IncidentID, // 8
                    SubmittedBy, //9
                    model.CallOrigin, // 10
                    model.Address); // 11

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

        private async Task<string> refreshtoken()
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
            return token;
        }
    }
}