using System;
using System.Web;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using accmobile.Models;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;

namespace accmobile.Controllers
{
    [Authorize]
    public class dropdowns : Controller
    {
        HttpClient client = new HttpClient();

        [HttpGet("[action]")]
        public async Task<object> animalBreeds()
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            string url = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('animalBreeds')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            List<breeds> AllBreeds = new List<breeds>();
            string items = await client.GetStringAsync(url);
            dynamic breeds = JObject.Parse(items)["value"];
            foreach (var item in breeds)
            {
                breeds brd = new breeds()
                {
                    breed = item.breed,
                    type = item.AnimalType,
                };
                AllBreeds.Add(brd);
            }
            return(AllBreeds);
        }

        [HttpGet("[action]")]
        public async Task<object> animalCoats()
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            string url = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('animalCoats')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            List<coats> AllCoats = new List<coats>();
            string items = await client.GetStringAsync(url);
            dynamic coats = JObject.Parse(items)["value"];
            foreach (var item in coats)
            {
                coats ct = new coats()
                {
                    coat = item.Coat,
                    type = item.AnimalType,
                };
                AllCoats.Add(ct);
            }
            return(AllCoats);
        }

        [HttpGet("[action]")]
        public async Task<object> vets()
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            string url = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Veterinarians')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            List<vets> AllVets = new List<vets>();
            string items = await client.GetStringAsync(url);
            dynamic vets = JObject.Parse(items)["value"];
            foreach (var item in vets)
            {
                vets vt = new vets()
                {
                    vet = item.Vet,
                };
                AllVets.Add(vt);
            }
            return(AllVets);
        }

        [HttpGet("[action]")]
        public async Task<object> reasonsForVisit()
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            string url = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('reasonsForVisit')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            List<reasons> AllReasons = new List<reasons>();
            string items = await client.GetStringAsync(url);
            dynamic reasons = JObject.Parse(items)["value"];
            foreach (var item in reasons)
            {
                reasons rs = new reasons()
                {
                    reason = item.Reason,
                };
                AllReasons.Add(rs);
            }
            return(AllReasons);
        }

        [HttpGet("[action]")]
        public async Task<object> callOrigins()
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            string url = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('callOrigins')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            List<origins> AllOrigins = new List<origins>();
            string items = await client.GetStringAsync(url);
            dynamic origins = JObject.Parse(items)["value"];
            foreach (var item in origins)
            {
                origins or = new origins()
                {
                    origin = item.Origin,
                };
                AllOrigins.Add(or);
            }
            return(AllOrigins);
        }

        public async Task<object> officerInitials()
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            string url = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('officerInitials')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            List<initials> AllInitials = new List<initials>();
            string items = await client.GetStringAsync(url);
            dynamic initials = JObject.Parse(items)["value"];
            foreach (var item in initials)
            {
                initials ins = new initials()
                {
                    initial = item.Initials,
                };
                AllInitials.Add(ins);
            }
            return(AllInitials);
        }

        public async Task<object> citationNumbers()
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            string url = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('citationNumbers')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);
            List<citations> AllCitations = new List<citations>();
            string items = await client.GetStringAsync(url);
            dynamic citations = JObject.Parse(items)["value"];
            foreach (var item in citations)
            {
                citations cit = new citations()
                {
                    citation = item.Number,
                };
                AllCitations.Add(cit);
            }
            return(AllCitations);
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