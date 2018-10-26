using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using accmobile.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace accmobile.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    public class incidents : Controller {
        HttpClient client = new HttpClient ();

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public incidents (
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager) {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // GET

        List<allIncidents> AllIncidents = new List<allIncidents> ();

        [HttpGet ("[action]")]
        public async Task<object> all () {
            await refreshtoken ();
            var token = refreshtoken ().Result;
            string analogUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('GeocodedAdvises')/items?$top=5000";
            await getAnalogIncidents (token, analogUrl);
            string digitalUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items?$top=5000";
            await getElectronicIncidents (token, digitalUrl);
            List<allIncidents> sortedIssues = AllIncidents.OrderBy (o => o.date).ToList ();
            return (AllIncidents);
        }

        [HttpGet ("[action]")]
        public async Task<object> report (string id) {
            await refreshtoken ();
            var token = refreshtoken ().Result;
            await getIncident (token, id);
            var response = getIncident (token, id).Result;
            dynamic incident = JObject.Parse (response) ["value"][0];
            DateTime utc_date = incident.Created;
            allIncidents adv = new allIncidents () {
                uuid = incident.AdvisoryID,
                date = utc_date,
                address = incident.Address,
                itemId = incident.Id,
                coords = incident.AddressID,
                reasonForVisit = incident.ReasonforVisit,
                note = incident.Note,
                ownersLastName = incident.OwnersLastName,
                ownersFirstName = incident.OwnersFirstName,
                ownersTelephoneNumber = incident.OwnersTelephone,
                pghCode = incident.ADVPGHCode,
                citationNumber = incident.CitationNumber,
                comments = incident.Comments,
                callOrigin = incident.CallOrigin,
                submittedBy = incident.SubmittedBy,
                modifiedBy = incident.ModifiedBy,
                officerInitials = incident.Officers,
                open = incident.Open
            };
            return (adv);
        }

        public async Task getAnalogIncidents (string token, string url) {
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            string listitems = await client.GetStringAsync (url);
            dynamic Next = JObject.Parse (listitems) ["odata.nextLink"];
            dynamic PaperAdvises = JObject.Parse (listitems) ["value"];
            foreach (var item in PaperAdvises) {
                DateTime utc_date = item.Date;
                allIncidents adv = new allIncidents () {
                    link = item.link,
                    date = utc_date,
                    address = item.address,
                    itemId = item.Id,
                    note = item.Note
                };
                AllIncidents.Add (adv);
            }
            if (Next != null) {
                url = Next;
                await getAnalogIncidents (url, token);
            } else {
                return;
            }
        }
        public async Task getElectronicIncidents (string token, string url) {
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            string listitems = await client.GetStringAsync (url);
            dynamic Next = JObject.Parse (listitems) ["odata.nextLink"];
            dynamic PaperAdvises = JObject.Parse (listitems) ["value"];
            foreach (var item in PaperAdvises) {
                string Link =
                    String.Format ("Report/id={0}",
                        item.AdvisoryID); // 0
                DateTime utc_date = item.Created;
                allIncidents adv = new allIncidents () {
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
                    open = item.Open
                };
                AllIncidents.Add (adv);
            }
            if (Next != null) {
                url = Next;
                await getElectronicIncidents (url, token);
            } else {
                return;
            }
        }

        public async Task<string> getIncident (string token, string id) {
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Add ("Accept", "application/json");
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            var sharepointUrl =
                String.Format ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items?$filter=AdvisoryID eq '{0}'",
                    id); // 0
            string listitems = await client.GetStringAsync (sharepointUrl);
            return listitems;
        }

        // POST
        [HttpPost ("[action]")]
        public async Task post ([FromBody] allIncidents model) {
            await refreshtoken ();
            var token = refreshtoken ().Result;
            string SubmittedBy = _userManager.GetUserName (HttpContext.User);
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items";
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            client.DefaultRequestHeaders.Add ("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add ("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "POST");
            var json =
                String.Format ("{{'__metadata': {{ 'type': 'SP.Data.AdvisesItem' }}, 'OwnersFirstName' : '{0}', 'OwnersLastName' : '{1}', 'OwnersTelephone' : '{2}', 'ReasonforVisit' : '{3}', 'ADVPGHCode' : '{4}', 'CitationNumber' : '{5}', 'Comments' : '{6}', 'AddressID' : '{7}', 'AdvisoryID' : '{8}', 'SubmittedBy' : '{9}', 'CallOrigin' : '{10}', 'Address' : '{11}', 'ModifiedBy' : '{12}', 'Officers' : '{13}', 'Open' : '{14}', 'Note' : '{15}' }}",
                    model.ownersFirstName, // 0
                    model.ownersLastName, // 1
                    model.ownersTelephoneNumber, // 2
                    model.reasonForVisit, // 3
                    model.pghCode, // 4
                    model.citationNumber, // 5
                    model.comments, // 6
                    model.coords, // 7 
                    model.uuid, // 8
                    SubmittedBy, //9
                    model.callOrigin, // 10
                    model.address, // 11
                    SubmittedBy, // 12
                    model.officerInitials, // 13
                    model.open, // 14
                    model.note); // 15

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
        public async Task put ([FromBody] allIncidents model) {
            await refreshtoken ();
            var token = refreshtoken ().Result;
            string ModifiedBy = _userManager.GetUserName (HttpContext.User);
            var postUrl =
                string.Format ("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items({0})",
                    model.itemId); // 0
            client.DefaultRequestHeaders.Clear ();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue ("Bearer", token);
            client.DefaultRequestHeaders.Add ("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add ("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add ("X-HTTP-Method", "MERGE");
            client.DefaultRequestHeaders.Add ("IF-MATCH", "*");
            var json =
                String.Format ("{{'__metadata': {{ 'type': 'SP.Data.AdvisesItem' }}, 'OwnersFirstName' : '{0}', 'OwnersLastName' : '{1}', 'OwnersTelephone' : '{2}', 'ReasonforVisit' : '{3}', 'ADVPGHCode' : '{4}', 'CitationNumber' : '{5}', 'Comments' : '{6}', 'CallOrigin' : '{7}', 'Officers' : '{8}', 'ModifiedBy' : '{9}', 'Open' : '{10}', 'AddressID' : '{11}', 'Address' : '{12}', 'Note' : '{13}' }}",
                    model.ownersFirstName, // 0
                    model.ownersLastName, // 1
                    model.ownersTelephoneNumber, // 2
                    model.reasonForVisit, // 3
                    model.pghCode, // 4
                    model.citationNumber, // 5
                    model.comments, // 6
                    model.callOrigin, // 7
                    model.officerInitials, // 8
                    ModifiedBy, // 9
                    model.open, // 10
                    model.coords, // 11 
                    model.address, // 12
                    model.note); // 13

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