using System;
using System.Web;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ACCmobile.Models;
using ACCmobile.Models.AccountModels;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using System.Net;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Collections.Specialized;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace ACCmobile.Controllers
{
    [Authorize]
    public class Address : Controller
    {   
        HttpClient client = new HttpClient();

        public async Task<IActionResult> Validation()
        {
            await RefreshToken();
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            ViewData["apistring"] = 
                String.Format 
                ("https://maps.googleapis.com/maps/api/js?key={0}&libraries=places,visualization&callback=initMap",
                    googleapikey); // 0
            return View();
        }

        public IActionResult Next(AddressModel model)
        {
            HttpContext.Session.SetString("Address", model.Address);
            HttpContext.Session.SetString("AddressID", model.AddressID);
            return RedirectToAction(nameof(New_Incident.Description), "New_Incident");
        }

        [HttpPost]
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
            try // POST to ms access control service
            {
                StringContent strContent = new StringContent(json);           
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/x-www-form-urlencoded");
                HttpResponseMessage response = client.PostAsync(MSurl, strContent).Result;
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                dynamic results = JsonConvert.DeserializeObject<dynamic>(content);
                string token = results.access_token.ToString();
                HttpContext.Session.SetString("SessionToken", token);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message);
            }
        }
    }
}
