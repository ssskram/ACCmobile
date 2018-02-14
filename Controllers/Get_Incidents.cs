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

        // return all incidents by address
        public async Task<IActionResult> ByAddress()
        {
            string HeatMapData= "";
            await RefreshToken();
            await GetAdvises();
            //await HeatMapData();
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            ViewData["apistring"] = 
                String.Format 
                ("https://maps.googleapis.com/maps/api/js?key={0}&libraries=places,visualization&callback=initMap",
                    googleapikey); // 0
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
                    char[] lat = {'"','l','a','t',':',' ' };
                    string name = item.Name.ToString();
                    string adv_trimmed = name.TrimStart(adv_char);
                    string pdf_trimmed = adv_trimmed.TrimEnd(pdf_char);

                    string date = pdf_trimmed.Split(' ').First();
                    string date_trimmed= date.TrimEnd(whitespace);
                    string date_trimmed2 = date_trimmed.Replace(".", "-");
                    //string date_trimmed3 = date_trimmed.Replace("-", "/");
                    string date_cleaned = "20" + date_trimmed2;
                    DateTime datecleaned2; 
                    bool parsed = DateTime.TryParseExact(date_cleaned, "yyyy-M-d", CultureInfo.InvariantCulture,
                               DateTimeStyles.AllowWhiteSpaces,
                               out datecleaned2);
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
                    string formatted_coords_lat = formatted_coords_clean.Remove(0, formatted_coords_clean.IndexOf(' ') + 1);
                    string formatted_coords_lat2 = formatted_coords_lat.TrimStart(lat);
                    string longitude_dirty = formatted_coords_lat2.Split(' ').Last();
                    string longitude = longitude_dirty.TrimEnd(whitespace);
                    string latitude = formatted_coords_lat2.Split(' ').FirstOrDefault();
                    var finalcoord =
                        String.Format 
                        ("({0} {1})",
                        latitude, // 0
                        longitude); // 1
                    var dateformat = "MM/dd/yyyy HH:mm";
                    AllIncidents adv = new AllIncidents() 
                    {
                        Link = doclink,
                        Date = datecleaned2.ToString(dateformat),
                        Address = formatted_address,
                        Coords = finalcoord,
                        Format = "Paper"
                    };
                    Advises.Add(adv);  
                    string coord = adv.Coords.ToString();
                    var clean = Regex.Replace(coord, "[()]", "");
                    var bracketed = "[" + clean + "],";
                    HeatMapData += bracketed;
                }
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
                        Coords = item.AddressID,
                        Format = "Eletronic"
                    };
                    Advises.Add(adv); 
                    string coord = adv.Coords.ToString();
                    var clean = Regex.Replace(coord, "[()]", "");
                    var bracketed = "[" + clean + "],";
                    HeatMapData += bracketed;
                }
            HeatMapData = HeatMapData.TrimEnd(',');
            var done = "[" + HeatMapData + "]";
            ViewBag.heatmap = done;
            return View(Advises);
        }

        // Open individual incident
        public async Task<IActionResult> Open(string id)
        {
            await GetIncident(id);
            var incidentcontent = GetIncident(id).Result; 
            dynamic incidentitem = JObject.Parse(incidentcontent)["value"][0];
            DateTime utc_date = incidentitem.Created;
            DateTime easternTime = utc_date.AddHours(-5);
            var dateformat = "MM/dd/yyyy";
            SingleIncident adv = new SingleIncident() 
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
            return View("~/Views/Get_Incidents/IncidentReport.cshtml", adv);
        }

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

        // api calls

        // get all advises from pdf library
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

        // get incident chosen from table
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

        // get all animals associated with chosen incident
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
