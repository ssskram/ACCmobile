using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using accmobile.Models;
using Microsoft.AspNetCore.Authorization;
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

        [HttpPost ("[action]")]
        public async Task deleteAnimal ([FromBody] string id) {
            await refreshtoken ();
            var token = refreshtoken ().Result;
            var deleteUrl =
                string.Format ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items({0})",
                    id); // 0
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            client.DefaultRequestHeaders.Add ("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add ("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add ("IF-MATCH", "*");
            try {
                HttpResponseMessage response = client.DeleteAsync (deleteUrl).Result;
                response.EnsureSuccessStatusCode ();
                await response.Content.ReadAsStringAsync ();
            } catch (Exception ex) {
                System.Diagnostics.Debug.WriteLine (ex.Message);
            }
        }
        // POST

        [HttpPost ("[action]")]
        public async Task post ([FromBody] allAnimals model) {
            await refreshtoken ();
            var token = refreshtoken ().Result;
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            client.DefaultRequestHeaders.Add ("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add ("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            var json =
                String.Format ("{{'__metadata': {{ 'type': 'SP.Data.AnimalsItem' }}, 'Type' : '{0}' , 'Breed' : '{1}', 'Coat' : '{2}', 'Sex' : '{3}', 'LicenseNumber' : '{4}', 'RabbiesVacNo' : '{5}', 'RabbiesVacExp' : '{6}', 'Veterinarian' : '{7}', 'LicenseYear' : '{8}', 'Age' : '{9}', 'AdvisoryID' : '{10}', 'Name' : '{11}', 'Comments' : '{12}' }}",
                    model.animalType, // 0
                    model.animalBreed, // 1
                    model.animalCoat, //2
                    model.animalSex, // 3
                    model.LicenseNo, // 4
                    model.RabbiesVacNo, // 5
                    model.RabbiesVacExp, // 6
                    model.Vet, // 7
                    model.LicenseYear, // 8
                    model.animalAge, // 9
                    model.incidentID, // 10
                    model.animalName, // 11
                    model.Comments); // 12

            client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            try // post
            {
                StringContent strContent = new StringContent (json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync (sharepointUrl, strContent).Result;
                response.EnsureSuccessStatusCode ();
                var content = await response.Content.ReadAsStringAsync ();
            } catch (Exception ex) {
                System.Diagnostics.Debug.WriteLine (ex.Message);
            }
        }

        [HttpPost ("[action]")]
        public async Task put ([FromBody] allAnimals model) {
            await refreshtoken ();
            var token = refreshtoken ().Result;
            var postUrl =
                string.Format ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items({0})",
                    model.itemID); // 0
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            client.DefaultRequestHeaders.Add ("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add ("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "MERGE");
            client.DefaultRequestHeaders.Add ("IF-MATCH", "*");
            var json =
                String.Format ("{{'__metadata': {{ 'type': 'SP.Data.AnimalsItem' }}, 'Type' : '{0}', 'Breed' : '{1}', 'Coat' : '{2}', 'Sex' : '{3}', 'LicenseNumber' : '{4}', 'RabbiesVacNo' : '{5}', 'RabbiesVacExp' : '{6}', 'Veterinarian' : '{7}', 'LicenseYear' : '{8}', 'Age' : '{9}', 'Name' : '{10}', 'Comments' : '{11}' }}",
                    model.animalType, // 0
                    model.animalBreed, // 1
                    model.animalCoat, //2
                    model.animalSex, // 3
                    model.LicenseNo, // 4
                    model.RabbiesVacNo, // 5
                    model.RabbiesVacExp, // 6
                    model.Vet, // 7
                    model.LicenseYear, // 8
                    model.animalAge, // 9
                    model.animalName, // 10
                    model.Comments); // 11
            client.DefaultRequestHeaders.Add ("ContentLength", json.Length.ToString ());
            try // post
            {
                StringContent strContent = new StringContent (json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/json;odata=verbose");
                HttpResponseMessage response = client.PostAsync (postUrl, strContent).Result;
                response.EnsureSuccessStatusCode ();
                var content = await response.Content.ReadAsStringAsync ();
            } catch (Exception ex) {
                System.Diagnostics.Debug.WriteLine (ex.Message);
            }
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