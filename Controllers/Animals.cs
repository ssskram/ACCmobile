using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using accmobile.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace accmobile.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class animals : Controller {
        HttpClient client = new HttpClient ();

        // GET

        [HttpGet ("[action]")]
        public async Task<object> all () {
            await refreshtoken ();
            var token = refreshtoken ().Result;
            await getAllAnimals (token);
            var response = getAllAnimals (token).Result;
            List<allAnimals> AllAnimals = new List<allAnimals> ();
            dynamic parsedAnimals = JObject.Parse (response) ["value"];
            foreach (var item in parsedAnimals) {
                allAnimals amn = new allAnimals () {
                    itemID = item.Id,
                    incidentID = item.AdvisoryID,
                    animalName = item.Name,
                    animalType = item.Type,
                    animalBreed = item.Breed,
                    animalCoat = item.Coat,
                    animalSex = item.Sex,
                    animalAge = item.Age,
                    LicenseNo = item.LicenseNumber,
                    LicenseYear = item.LicenseYear,
                    RabbiesVacNo = item.RabbiesVacNo,
                    RabbiesVacExp = item.RabbiesVacExp,
                    Vet = item.Veterinarian,
                    Comments = item.Comments
                };
                AllAnimals.Add (amn);
            }
            return (AllAnimals);
        }

        [HttpGet ("[action]")]
        public async Task<object> report (string id) {
            await refreshtoken ();
            var token = refreshtoken ().Result;
            await getSomeAnimals (token, id);
            var response = getSomeAnimals (token, id).Result;
            List<allAnimals> SomeAnimals = new List<allAnimals> ();
            dynamic parsedAnimals = JObject.Parse (response) ["value"];
            foreach (var item in parsedAnimals) {
                allAnimals amn = new allAnimals () {
                    itemID = item.Id,
                    incidentID = item.AdvisoryID,
                    animalName = item.Name,
                    animalType = item.Type,
                    animalBreed = item.Breed,
                    animalCoat = item.Coat,
                    animalSex = item.Sex,
                    animalAge = item.Age,
                    LicenseNo = item.LicenseNumber,
                    LicenseYear = item.LicenseYear,
                    RabbiesVacNo = item.RabbiesVacNo,
                    RabbiesVacExp = item.RabbiesVacExp,
                    Vet = item.Veterinarian,
                    Comments = item.Comments
                };
                SomeAnimals.Add (amn);
            }
            return (SomeAnimals);
        }

        public async Task<string> getAllAnimals (string token) {
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            string listitems = await client.GetStringAsync ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items?$top=5000");
            return listitems;
        }

        public async Task<string> getSomeAnimals (string token, string id) {
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            var sharepointUrl =
                String.Format ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items?$filter=AdvisoryID eq '{0}'",
                    id); // 0
            string listitems = await client.GetStringAsync (sharepointUrl);
            return listitems;
        }

        private async Task<string> refreshtoken () {
            var MSurl = "https://accounts.accesscontrol.windows.net/f5f47917-c904-4368-9120-d327cf175591/tokens/OAuth/2";
            var clientid = Environment.GetEnvironmentVariable ("SPClientID");
            var clientsecret = Environment.GetEnvironmentVariable ("SPClientSecret");
            var refreshtoken = Environment.GetEnvironmentVariable ("refreshtoken");
            var redirecturi = Environment.GetEnvironmentVariable ("redirecturi");
            var SPresource = Environment.GetEnvironmentVariable ("spresourceid");
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("Accept", "application/x-www-form-urlencoded");
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");

            var json =
                String.Format ("grant_type=refresh_token&client_id={0}&client_secret={1}&refresh_token={2}&redirect_uri={3}&resource={4}",
                    clientid, // 0
                    clientsecret, // 1
                    refreshtoken, // 2
                    redirecturi, // 3
                    SPresource); // 4

            client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            StringContent strContent = new StringContent (json);
            strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/x-www-form-urlencoded");
            HttpResponseMessage response = client.PostAsync (MSurl, strContent).Result;
            response.EnsureSuccessStatusCode ();
            var content = await response.Content.ReadAsStringAsync ();
            dynamic results = JsonConvert.DeserializeObject<dynamic> (content);
            string token = results.access_token.ToString ();
            return token;
        }
    }
}