using System;
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
using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace ACCmobile.Controllers
{
    [Authorize]
    public class AdvisoryController : Controller
    {   
        public IActionResult AdvisoryForm()
        {
            return View();
        }
        public async Task<IActionResult> Create(AdvisoryGeneralInfo model)
        {
            await Execute(model);
            return View ("~/Views/Home/Index.cshtml");
        }
        static async Task Execute(AdvisoryGeneralInfo model)
        {
            var apiKey = Environment.GetEnvironmentVariable("sendgrid");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("HelpDesk@azurewebservices.us", "Help Desk");
            var subject = model.Address;
            var to = new EmailAddress("paulmarks211@gmail.com", "Paul Marks");
            var plainTextContent = 
                String.Format
                ("<strong>A new advisory form has been submitted.</strong> <br><br> The user's name is {0} {1}, <br><br> The user's email address is {2} <br><br> Phone number  = {3} <br><br> Reason for visit = {4} <br><br> ADV. PGH. Code  = {5} <br><br> Citation number = {6} <br><br> Comments = {7}",
                         model.OwnersFirstName, // 0
                         model.OwnersLastName, // 1
                         model.Address, // 2
                         model.OwnersTelephoneNumber, // 3
                         model.ReasonForVisit, // 4
                         model.PGHCode, // 5
                         model.CitationNumber, // 6 
                         model.Comments); // 7
            var htmlContent = 
                String.Format
                ("<strong>A new advisory form has been submitted.</strong> <br><br> The user's name is {0} {1}, <br><br> The user's email address is {2} <br><br> Phone number  = {3} <br><br> Reason for visit = {4} <br><br> ADV. PGH. Code  = {5} <br><br> Citation number = {6} <br><br> Comments = {7}",
                         model.OwnersFirstName, // 0
                         model.OwnersLastName, // 1
                         model.Address, // 2
                         model.OwnersTelephoneNumber, // 3
                         model.ReasonForVisit, // 4
                         model.PGHCode, // 5
                         model.CitationNumber, // 6 
                         model.Comments); // 7
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }
    }
}
