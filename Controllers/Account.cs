using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using accmobile.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace accmobile.Controllers {
    [Authorize]
    [Route ("[controller]/[action]")]
    public class Account : Controller {
        HttpClient client = new HttpClient ();

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public Account (
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager) {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Login () {
            // Clear the existing external cookie to ensure a clean login process
            await _signInManager.SignOutAsync ();
            await HttpContext.SignOutAsync (IdentityConstants.ExternalScheme);
            return View ();
        }

        [HttpPost]
        [AllowAnonymous]
        public IActionResult ExternalLogin (string provider, string returnUrl = null) {
            // Request a redirect to the external login provider.
            var redirectUrl = Url.Action (nameof (ExternalLoginCallback), "Account", new { returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties (provider, redirectUrl);
            return Challenge (properties, provider);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ExternalLoginCallback (string returnUrl = null, string remoteError = null) {
            // get user group from sp site
            await GetUserGroup ();
            var usergroup = TempData["usergroup"].ToString ();
            var info = await _signInManager.GetExternalLoginInfoAsync ();
            // create user account, and log user in.
            var email = info.Principal.FindFirstValue (ClaimTypes.Email);
            // check email address against domain name and membership in user group
            if (email.Contains ("@pittsburghpa.gov") && (usergroup.Contains (email))) {
                var user = new ApplicationUser { UserName = email, Email = email };
                var add = await _userManager.CreateAsync (user);
                if (add.Succeeded) {
                    add = await _userManager.AddLoginAsync (user, info);
                    if (add.Succeeded) {
                        await _signInManager.ExternalLoginSignInAsync (info.LoginProvider, info.ProviderKey, isPersistent : true, bypassTwoFactor : true);
                    }
                }
                return RedirectToAction (nameof (Home.Index), "Home");
            } else {
                return View ("AccessDenied");
            }
        }

        public async Task GetUserGroup () {
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
            try {
                StringContent strContent = new StringContent (json);
                strContent.Headers.ContentType = MediaTypeHeaderValue.Parse ("application/x-www-form-urlencoded");
                HttpResponseMessage response = client.PostAsync (MSurl, strContent).Result;
                response.EnsureSuccessStatusCode ();
                var content = await response.Content.ReadAsStringAsync ();
                dynamic results = JsonConvert.DeserializeObject<dynamic> (content);

                string accesstoken = results.access_token.ToString ();
                var sharepointUrl = "https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Accmobileusers')/items";
                client.DefaultRequestHeaders.Clear ();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue ("Bearer", accesstoken);
                client.DefaultRequestHeaders.Add ("Accept", "application/json;odata=verbose");
                try {
                    string group = await client.GetStringAsync (sharepointUrl);
                    TempData["usergroup"] = group;
                } catch (Exception ex) {
                    System.Diagnostics.Debug.WriteLine (ex.Message);
                }
            } catch (Exception ex) {
                System.Diagnostics.Debug.WriteLine (ex.Message);
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Logout () {
            await _signInManager.SignOutAsync ();
            return RedirectToAction (nameof (Home.Index), "Home");
        }

        public async Task<IActionResult> AccessDenied (string returnUrl = null) {
            await HttpContext.SignOutAsync (IdentityConstants.ExternalScheme);
            return View ();
        }
    }
}