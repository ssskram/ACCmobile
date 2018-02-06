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
    public class NewIncidentController : Controller
    {   
        private readonly UserManager<ApplicationUser> _userManager;
        public NewIncidentController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
        HttpClient client = new HttpClient();

        public IActionResult Form()
        {
            var address = HttpContext.Session.GetString("Address");
            var googleapikey = Environment.GetEnvironmentVariable("googleapikey");
            ViewData["apistringmap"] = 
                String.Format 
                ("https://maps.googleapis.com/maps/api/js?key={0}&callback=initMap",
                    googleapikey); // 0
            var incidentmodel = new PostIncident
                {
                    IncidentID = (Guid.NewGuid().ToString()),
                    Address = address
                };
            return View(incidentmodel);
        }

        public async Task<IActionResult> Create(PostIncident model)
        {
            string IncidentID = model.IncidentID.ToString();
            HttpContext.Session.SetString("IncidentID", IncidentID);
            await Execute(model);
            return RedirectToAction(nameof(NewAnimalController.Form), "NewAnimal");
        }
        public async Task Execute(PostIncident model)
        {
            string SubmittedBy = _userManager.GetUserName(HttpContext.User);
            var SessionToken = HttpContext.Session.GetString("SessionToken");
            var AddressID = HttpContext.Session.GetString("AddressID");
            var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items";
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue ("Bearer", SessionToken);
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
    }
}
