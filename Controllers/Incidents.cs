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
    [Route("api/[controller]")]
    public class incidents : Controller
    {
        HttpClient client = new HttpClient();

        // GET

        List<allIncidents> AllIncidents = new List<allIncidents>();

        [HttpGet("[action]")]
        public async Task<object> all()
        {
            await refreshtoken();
            var token = refreshtoken().Result;
            string analogUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('GeocodedAdvises')/items?$top=5000";
            await getAnalogIncidents(token, analogUrl);
            string digitalUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items?$top=5000";
            await getElectronicIncidents(token, digitalUrl);
            List<allIncidents> sortedIssues = AllIncidents.OrderBy(o => o.date).ToList();
            return (AllIncidents);
        }

        public async Task getAnalogIncidents(string token, string url)
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
                DateTime utc_date = item.Date;
                allIncidents adv = new allIncidents()
                {
                    link = item.link,
                    date = utc_date,
                    address = item.address,
                    itemId = item.Id,
                    note = item.Note
                };
                AllIncidents.Add(adv);
            }
            if (Next != null)
            {
                url = Next;
                await getAnalogIncidents(url, token);
            }
            else
            {
                return;
            }
        }
        public async Task getElectronicIncidents(string token, string url)
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
                string Link =
                    String.Format
                    ("Report",
                    item.AdvisoryID); // 0
                DateTime utc_date = item.Created;
                allIncidents adv = new allIncidents()
                {
                    uuid = item.AdvisoryID,
                    link = Link,
                    date = utc_date,
                    address = item.Address,
                    itemId = item.Id,
                    coords = item.AddressID,
                    reasonForVisit = item.ReasonforVisit,
                    note = item.Note,
                    ownersLastName = item.OwnersLastName,
                    ownersFirstName = item.OwnersFirstName,
                    ownersTelephoneNumber = item.OwnersTelephone,
                    pghCode = item.ADVPGHCode,
                    citationNumber = item.CitationNumber,
                    comments = item.Comments,
                    callOrigin = item.CallOrigin,
                    submittedBy = item.SubmittedBy,
                    modifiedBy = item.ModifiedBy,
                    officerInitials = item.Officers,
                    open = item.Open,
                    zip = item.Zip
                };
                AllIncidents.Add(adv);
            }
            if (Next != null)
            {
                url = Next;
                await getElectronicIncidents(url, token);
            }
            else
            {
                return;
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