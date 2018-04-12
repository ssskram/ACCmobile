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

        // list to populate with "paper" and electronic incidents
        List<AllIncidents> Advises = new List<AllIncidents>();
        
        // get all incidents
        public async Task<IActionResult> All()
        {   
            // // get and set advises
            string url = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('GeocodedAdvises')/items?$top=3000";
            await refreshtoken();
            string token = refreshtoken().Result;
            await GetAdvises(url, token);
            
            // get and set incidents
            await GetIncidents(token);
            var electroniccontent = GetIncidents(token).Result;
            dynamic ElectronicIncidents = JObject.Parse(electroniccontent)["value"];
            foreach (var item in ElectronicIncidents)
            {
                string Link =
                    String.Format
                    ("Report?id={0}",
                    item.AdvisoryID); // 0
                DateTime utc_date = item.Created;
                DateTime easternTime = utc_date.AddHours(-4);
                var dateformat = "MM/dd/yyyy HH:mm";
                AllIncidents adv = new AllIncidents()
                {
                    Link = Link,
                    Date = easternTime.ToString(dateformat),
                    Address = item.Address,
                    ReasonForVisit = item.ReasonforVisit,
                    id = item.Id,
                    Coords = item.AddressID
                };
                Advises.Add(adv);
            }
            return View("~/Views/Incidents/Get/All.cshtml", Advises);
        }

        // get open incidents
        public async Task<IActionResult> Open()
        {
            // instantiate empty string to populate with coords
            string Points = "";

            // list to populate with electronic incidents
            List<AllIncidents> Advises = new List<AllIncidents>();

            // get and set incidents
            await GetOpenIncidents();
            var electroniccontent = GetOpenIncidents().Result;
            dynamic ElectronicIncidents = JObject.Parse(electroniccontent)["value"];
            foreach (var item in ElectronicIncidents)
            {
                string Link =
                    String.Format
                    ("Report?id={0}",
                    item.AdvisoryID); // 0
                DateTime utc_date = item.Created;
                DateTime easternTime = utc_date.AddHours(-4);
                var dateformat = "MM/dd/yyyy HH:mm";
                AllIncidents adv = new AllIncidents()
                {
                    Link = Link,
                    Date = easternTime.ToString(dateformat),
                    Address = item.Address,
                    id = item.Id,
                    ReasonForVisit = item.ReasonforVisit,
                    Coords = item.AddressID
                };
                Advises.Add(adv);
                string coord = adv.Coords.ToString();
                string itemID = adv.id.ToString();
                string merged = coord + "," + itemID;
                var clean = Regex.Replace(merged, "[()]", "");
                var bracketed = "[" + clean + "],";
                Points += bracketed;
            }

            // clean and set points data
            Points = Points.TrimEnd(',');
            var done = "[" + Points + "]";
            ViewBag.points = done;
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            ViewData["apistring"] =
                String.Format
                ("https://maps.googleapis.com/maps/api/js?key={0}&libraries=places,visualization&callback=initMap",
                    googleapikey); // 0

            return View("~/Views/Incidents/Get/Open.cshtml", Advises);
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
                Coords = incidentitem.AddressID,
                Date = easternTime.ToString(dateformat),
                SubmittedBy = incidentitem.SubmittedBy,
                ModifiedBy = incidentitem.ModifiedBy,
                Officers = incidentitem.Officers,
                itemID = incidentitem.Id,
                Open = incidentitem.Open
            };
            if (incidentitem.Open == "Yes")
            {
                ViewBag.Open = ("Open incident");
            }
            else
            {
                ViewBag.Open = "Closed incident";
            }
            // clean coords for map
            char[] comma = {',',' '};
            string coord = incidentitem.AddressID;
            string coord_clean = Regex.Replace(coord, "[()]", "");
            string lat_dirty = coord_clean.Split(' ').First();
            string lat = lat_dirty.TrimEnd(comma);
            string lng = coord_clean.Split(' ').Last();
            ViewBag.Lat = lat;
            ViewBag.Long = lng;
            string encodedaddress = System.Web.HttpUtility.UrlPathEncode(incidentitem.Address.ToString()); 
            ViewBag.directions = 
                String.Format
                ("https://www.google.com/maps/dir/?api=1&destination={0}",
                    encodedaddress); // 0
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
                    RabiesVacNo = item.RabbiesVacNo,
                    RabiesVacExp = item.RabbiesVacExp,
                    Veterinarian = item.Veterinarian,
                    LicenseYear = item.LicenseYear,
                    Comments = item.Comments,
                    itemID = item.Id
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
        public async Task GetAdvises(string url, string token)
        {
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            string listitems = await client.GetStringAsync(url);
            dynamic Next = JObject.Parse(listitems)["odata.nextLink"];
            dynamic PaperAdvises = JObject.Parse(listitems)["value"];
            foreach (var item in PaperAdvises)
            {
                DateTime dt = item.Date;
                AllIncidents adv = new AllIncidents()
                {
                    Link = item.link,
                    Date = item.Date,
                    Address = item.address,
                    id = item.Id,
                    Coords = item.Geo
                };
                Advises.Add(adv);
            }
            if (Next != null)
            {
                url = Next;
                await GetAdvises(url, token);
            }
            else 
            {
                return;
            }
        }

        // get all incidents
        public async Task<string> GetIncidents(string token)
        {
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items?$top=5000";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            string listitems = await client.GetStringAsync(sharepointUrl);
            return listitems;
        }

        // get open incidents
        public async Task<string> GetOpenIncidents()
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items?$top=5000&$filter=Open eq 'Yes'";
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
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            ViewData["apistringmap"] =
                String.Format
                ("https://maps.googleapis.com/maps/api/js?key={0}&callback=initMap",
                    googleapikey); // 0
            // clean coords for map
            char[] comma = {',',' '};
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

        // post incident description, pass to animal
        public async Task<IActionResult> Next(NewDescription model)
        {
            await PostIncident(model);
            TempData["IncidentID"] = model.IncidentID;
            TempData["Address"] = model.Address;
            TempData["OwnersFirstName"] = model.OwnersFirstName;
            TempData["OwnersLastName"] = model.OwnersLastName;
            TempData["ReasonforVisit"] = model.ReasonForVisit;
            TempData["Coords"] = model.Coords;
            return Redirect("Animal");
        }

        // open animal view
        public async Task<IActionResult> Animal()
        {
            string id = TempData.Peek("IncidentID").ToString();
            string address = TempData.Peek("Address").ToString();
            string coords = TempData.Peek("Coords").ToString();
            await CountAnimals(id);
            ViewBag.Animals = CountAnimals(id).Result;
            ViewBag.IncidentAddress = address;
            ViewBag.IncidentFirstName = TempData.Peek("OwnersFirstName");
            ViewBag.IncidentLastName = TempData.Peek("OwnersLastName");
            ViewBag.IncidentReason = TempData.Peek("ReasonforVisit");
            var animalmodel = new NewAnimal
            {
                IncidentID = id,
                Address = address,
                Coords = coords
            };
            return View("~/Views/Incidents/New/Animal.cshtml", animalmodel);
        }

        // add another animal
        public IActionResult _Animal()
        {
            string id = TempData.Peek("IncidentID").ToString();
            string address = TempData.Peek("Address").ToString();
            string coords = TempData.Peek("Coords").ToString();
            var animalmodel = new NewAnimal
            {
                IncidentID = id,
                Address = address,
                Coords = coords
            };
            return PartialView("~/Views/Incidents/New/_Animal.cshtml", animalmodel);
        }

        // post animal
        public async Task<IActionResult> PostAnimal(NewAnimal model)
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");
            var Name = model.AnimalName;
            if (Name != null && Name.Contains("'"))
            {
                Name = Name.Replace("'", "");
            }
            var Age = model.Age;
            if (Age != null && Age.Contains("'"))
            {
                Age = Age.Replace("'", "");
            }
            var LicenseNumber = model.LicenseNumber;
            if (LicenseNumber != null && LicenseNumber.Contains("'"))
            {
                LicenseNumber = LicenseNumber.Replace("'", "");
            }
            var LicenseYear = model.LicenseYear;
            if (LicenseYear != null && LicenseYear.Contains("'"))
            {
                LicenseYear = LicenseYear.Replace("'", "");
            }
            var RabiesVacExp = model.RabiesVacExp;
            if (RabiesVacExp != null && RabiesVacExp.Contains("'"))
            {
                RabiesVacExp = RabiesVacExp.Replace("'", "");
            }
            var RabiesVacNo = model.RabiesVacNo;
            if (RabiesVacNo != null && RabiesVacNo.Contains("'"))
            {
                RabiesVacNo = RabiesVacNo.Replace("'", "");
            }
            var json =
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AnimalsItem' }}, 'Type' : '{0}', 'Breed' : '{1}', 'Coat' : '{2}', 'Sex' : '{3}', 'LicenseNumber' : '{4}', 'RabbiesVacNo' : '{5}', 'RabbiesVacExp' : '{6}', 'Veterinarian' : '{7}', 'LicenseYear' : '{8}', 'Age' : '{9}', 'AddressID' : '{10}', 'AdvisoryID' : '{11}', 'Name' : '{12}', 'Comments' : '{13}', 'Address' : '{14}' }}",
                    model.Type, // 0
                    model.Breed, // 1
                    model.Coat, //2
                    model.Sex, // 3
                    LicenseNumber, // 4
                    RabiesVacNo, // 5
                    RabiesVacExp, // 6
                    model.Veterinarian, // 7
                    LicenseYear, // 8
                    Age, // 9
                    model.Coords, // 10
                    model.IncidentID, // 11
                    Name, // 12
                    model.Comments, // 13
                    model.Address); // 14

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
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");
            var OwnersFirstName = model.OwnersFirstName;
            if (OwnersFirstName != null && OwnersFirstName.Contains("'"))
            {
                OwnersFirstName = OwnersFirstName.Replace("'", "");
            }
            var OwnersLastName = model.OwnersLastName;
            if (OwnersLastName != null && OwnersLastName.Contains("'"))
            {
                OwnersLastName = OwnersLastName.Replace("'", "");
            }
            var OwnersTelephone = model.OwnersTelephoneNumber;
            if (OwnersTelephone != null && OwnersTelephone.Contains("'"))
            {
                OwnersTelephone = OwnersTelephone.Replace("'", "");
            }
            var CitationNumber = model.CitationNumber;
            if (CitationNumber != null && CitationNumber.Contains("'"))
            {
                CitationNumber = CitationNumber.Replace("'", "");
            }
            var Comments = model.Comments;
            if (Comments != null && Comments.Contains("'"))
            {
                Comments = Comments.Replace("'", "");
            }
            var json =
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AdvisesItem' }}, 'OwnersFirstName' : '{0}', 'OwnersLastName' : '{1}', 'OwnersTelephone' : '{2}', 'ReasonforVisit' : '{3}', 'ADVPGHCode' : '{4}', 'CitationNumber' : '{5}', 'Comments' : '{6}', 'AddressID' : '{7}', 'AdvisoryID' : '{8}', 'SubmittedBy' : '{9}', 'CallOrigin' : '{10}', 'Address' : '{11}', 'ModifiedBy' : '{12}', 'Officers' : '{13}', 'Open' : '{14}' }}",
                    OwnersFirstName, // 0
                    OwnersLastName, // 1
                    OwnersTelephone, // 2
                    model.ReasonForVisit, // 3
                    model.PGHCode, // 4
                    CitationNumber, // 5
                    Comments, // 6
                    model.Coords, // 7 
                    model.IncidentID, // 8
                    SubmittedBy, //9
                    model.CallOrigin, // 10
                    model.Address, // 11
                    SubmittedBy, // 12
                    model.Officers, // 13
                    model.Open); // 14

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

        public async Task<int> CountAnimals(string id)
        {
            int counter = 0;
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
            dynamic animalitems = JObject.Parse(listitems)["value"];
            foreach (var item in animalitems)
            {
                counter++;
            }
            return counter;
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

    // put methods
    [Authorize]
    public class UpdateIncident : Controller
    {
        HttpClient client = new HttpClient();


        private readonly UserManager<ApplicationUser> _userManager;
        public UpdateIncident(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // add another animal to an existing incident
        public IActionResult AddAnother(GetIncident model)
        {
            TempData["IncidentID"] = model.IncidentID;
            TempData["Address"] = model.Address;
            TempData["OwnersFirstName"] = model.OwnersFirstName;
            TempData["OwnersLastName"] = model.OwnersLastName;
            TempData["ReasonforVisit"] = model.ReasonForVisit;
            TempData["Coords"] = model.Coords;
            return Redirect("Animal");
        }

        // put updated incident
        public async Task PutIncident(GetIncident model)
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            string ModifiedBy = _userManager.GetUserName(HttpContext.User);
            var postUrl = 
                string.Format
                ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items({0})",
                model.itemID); // 0
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ("Bearer", token);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "MERGE");
            client.DefaultRequestHeaders.Add("IF-MATCH", "*");
            var json = 
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AdvisesItem' }}, 'OwnersFirstName' : '{0}', 'OwnersLastName' : '{1}', 'OwnersTelephone' : '{2}', 'ReasonforVisit' : '{3}', 'ADVPGHCode' : '{4}', 'CitationNumber' : '{5}', 'Comments' : '{6}', 'CallOrigin' : '{7}', 'Officers' : '{8}', 'ModifiedBy' : '{9}', 'Open' : '{10}', 'AddressID' : '{11}', 'Address' : '{12}' }}",
                    model.OwnersFirstName, // 0
                    model.OwnersLastName, // 1
                    model.OwnersTelephoneNumber, // 2
                    model.ReasonForVisitRelay, // 3
                    model.PGHCodeRelay, // 4
                    model.CitationNumber, // 5
                    model.Comments, // 6
                    model.CallOrigin, // 7
                    model.OfficersRelay, // 8
                    ModifiedBy, // 9
                    model.Open, // 10
                    model.Coords,  // 11 
                    model.AddressRelay); // 12

            client.DefaultRequestHeaders.Add("ContentLength", json.Length.ToString());
            try // post
            {
                StringContent strContent = new StringContent(json);               
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync(postUrl, strContent).Result;
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }

        // put updated animal
        public async Task PutAnimal(GetIncident model)
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            var postUrl = 
                string.Format
                ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items({0})",
                model.animalitemID); // 0
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ("Bearer", token);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "MERGE");
            client.DefaultRequestHeaders.Add("IF-MATCH", "*");
            var json =
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AnimalsItem' }}, 'Type' : '{0}', 'Breed' : '{1}', 'Coat' : '{2}', 'Sex' : '{3}', 'LicenseNumber' : '{4}', 'RabbiesVacNo' : '{5}', 'RabbiesVacExp' : '{6}', 'Veterinarian' : '{7}', 'LicenseYear' : '{8}', 'Age' : '{9}', 'Name' : '{10}', 'Comments' : '{11}' }}",
                    model.TypeRelay, // 0
                    model.BreedRelay, // 1
                    model.CoatRelay, //2
                    model.SexRelay, // 3
                    model.LicenseNumber, // 4
                    model.RabiesVacNo, // 5
                    model.RabiesVacExp, // 6
                    model.Veterinarian, // 7
                    model.LicenseYear, // 8
                    model.Age, // 9
                    model.AnimalName, // 10
                    model.AnimalComments); // 11

            client.DefaultRequestHeaders.Add("ContentLength", json.Length.ToString());
            try // post
            {
                StringContent strContent = new StringContent(json);               
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync(postUrl, strContent).Result;
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                await LastModified(model);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }
        public async Task DeleteAnimal(GetIncident model)
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            var deleteUrl = 
                string.Format
                ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items({0})",
                model.animalitemID); // 0
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ( "Bearer", token);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("IF-MATCH", "*");
            try
            {
                HttpResponseMessage response = client.DeleteAsync(deleteUrl).Result;
                response.EnsureSuccessStatusCode();
                await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }   
        }

        public async Task LastModified(GetIncident model)
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            string ModifiedBy = _userManager.GetUserName(HttpContext.User);
            var postUrl = 
                string.Format
                ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items({0})",
                model.itemID); // 0
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ("Bearer", token);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "MERGE");
            client.DefaultRequestHeaders.Add("IF-MATCH", "*");
            var json = 
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AdvisesItem' }}, 'ModifiedBy' : '{0}' }}",
                    ModifiedBy); // 0

            client.DefaultRequestHeaders.Add("ContentLength", json.Length.ToString());
            try // post
            {
                StringContent strContent = new StringContent(json);               
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync(postUrl, strContent).Result;
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }

        // open animal view
        public async Task<IActionResult> Animal()
        {
            string id = TempData.Peek("IncidentID").ToString();
            string address = TempData.Peek("Address").ToString();
            string coords = TempData.Peek("Coords").ToString();
            await CountAnimals(id);
            ViewBag.Animals = CountAnimals(id).Result;
            ViewBag.IncidentAddress = address;
            ViewBag.IncidentFirstName = TempData.Peek("OwnersFirstName");
            ViewBag.IncidentLastName = TempData.Peek("OwnersLastName");
            ViewBag.IncidentReason = TempData.Peek("ReasonforVisit");
            var animalmodel = new NewAnimal
            {
                IncidentID = id,
                Address = address,
                Coords = coords
            };
            return View("~/Views/Incidents/New/Animal.cshtml", animalmodel);
        }

        // API calls

        public async Task<int> CountAnimals(string id)
        {
            int counter = 0;
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
            dynamic animalitems = JObject.Parse(listitems)["value"];
            foreach (var item in animalitems)
            {
                counter++;
            }
            return counter;
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