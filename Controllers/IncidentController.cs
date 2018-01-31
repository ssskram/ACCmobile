using System;
using System.Web;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ACCmobile.Models;
using ACCmobile.Models.AccountViewModels;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using System.Net;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Collections.Specialized;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace ACCmobile.Controllers
{
    [Authorize]
    public class IncidentController : Controller
    {   
        // inject dependency on usermanager
        private readonly UserManager<ApplicationUser> _userManager;
        public IncidentController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        // initialize httpclient to be used by all methods
        HttpClient client = new HttpClient();

        // Open new incident form
        public IActionResult IncidentForm()
        {
            // get address for incident and set to variable
            var address = HttpContext.Session.GetString("Address");
            // craft repo-friendly api string for google
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            ViewData["apistringmap"] = 
                String.Format 
                ("https://maps.googleapis.com/maps/api/js?key={0}&callback=initMap",
                    googleapikey); // 0
            // generate new incident model to pass to view
            var incidentmodel = new IncidentViewModel
                {
                    // generate guid and assign as incident id
                    IncidentID = (Guid.NewGuid().ToString()),
                    // set hidden field Address to incident location
                    // (will be placed as point on map, client side)
                    Address = address
                };
            // return view, passing new incidentviewmodel along
            return View(incidentmodel);
        }

        // Post incident data and continue to animal module
        public async Task<IActionResult> Create(IncidentViewModel model)
        {
            // set incident id to session variable
            string IncidentID = model.IncidentID.ToString();
            HttpContext.Session.SetString("IncidentID", IncidentID);
            // execute post request
            // then return here
            await Execute(model);
            // continue to animal module
            return RedirectToAction(nameof(AnimalController.AnimalForm), "Animal");
        }
        public async Task Execute(IncidentViewModel model)
        {
            // collect current logged in user from _usermanager
            // set to variable
            string SubmittedBy = _userManager.GetUserName(HttpContext.User);
            // get other header values from environment variables
            var SessionToken = HttpContext.Session.GetString("SessionToken");
            var AddressID = HttpContext.Session.GetString("AddressID");
            // where you postin?
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items";
            // clear the headers
            client.DefaultRequestHeaders.Clear();
            // then, add some
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ("Bearer", SessionToken);
            client.DefaultRequestHeaders.Add("Accept", "application/json;odata=verbose");
            client.DefaultRequestHeaders.Add("X-RequestDigest", "form digest value");
            client.DefaultRequestHeaders.Add("X-HTTP-Method", "POST");
            // craft repo-friendly api string with necessary values
            var json = 
                String.Format
                ("{{'__metadata': {{ 'type': 'SP.Data.AdvisesItem' }}, 'OwnersFirstName' : '{0}', 'OwnersLastName' : '{1}', 'OwnersTelephone' : '{2}', 'ReasonforVisit' : '{3}', 'ADVPGHCode' : '{4}', 'CitationNumber' : '{5}', 'Comments' : '{6}', 'AddressID' : '{7}', 'AdvisoryID' : '{8}', 'SubmittedBy' : '{9}' }}",
                    model.OwnersFirstName, // 0
                    model.OwnersLastName, // 1
                    model.OwnersTelephoneNumber, // 2
                    model.ReasonForVisit, // 3
                    model.PGHCode, // 4
                    model.CitationNumber, // 5
                    model.Comments, // 6
                    AddressID, // 7 
                    model.IncidentID, // 8
                    SubmittedBy); // 9
                    
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
    }
}
