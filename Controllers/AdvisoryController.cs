using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ACCmobile.Models;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using System.Net;
using Newtonsoft.Json;
using System.Net.Http.Headers;


namespace ACCmobile.Controllers
{
    [Authorize]
    public class AdvisoryController : Controller
    {   
        public IActionResult AdvisoryForm()
        {
            return View();
        }
        // public static void Create()
        // {
        //     using (var http = new HttpClient()) {

        //     http.DefaultRequestHeaders.Add("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ing0Nzh4eU9wbHNNMUg3TlhrN1N4MTd4MXVwYyIsImtpZCI6Ing0Nzh4eU9wbHNNMUg3TlhrN1N4MTd4MXVwYyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvY2l0eW9mcGl0dHNidXJnaC5zaGFyZXBvaW50LmNvbUBmNWY0NzkxNy1jOTA0LTQzNjgtOTEyMC1kMzI3Y2YxNzU1OTEiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBAZjVmNDc5MTctYzkwNC00MzY4LTkxMjAtZDMyN2NmMTc1NTkxIiwiaWF0IjoxNTEyODYyNzEzLCJuYmYiOjE1MTI4NjI3MTMsImV4cCI6MTUxMjg2NjYxMywiYWN0b3IiOiJhYjdhNzU0Ni1hMTVkLTQzMGUtYmM1MC0xODhjOTdhYzU1ZDFAZjVmNDc5MTctYzkwNC00MzY4LTkxMjAtZDMyN2NmMTc1NTkxIiwiaWRlbnRpdHlwcm92aWRlciI6InVybjpmZWRlcmF0aW9uOm1pY3Jvc29mdG9ubGluZSIsIm5hbWVpZCI6IjEwMDM3RkZFOThGOTJDNzAifQ.Z_YaBwPitPSy4PgN3J13B2BVTDMlCIxX7J5vbWWG-o77k2uLqTaUIFtuudjwsCpBWTJAuNM4Fh_D8Qdgq9-4hezpUKDBONL7MnPYji0bhWsDm1SS5tIpWxStvWYXXUHpRSWjNObFKOgLkue3xi04YSrj_7LMuZ_irtBQWC-NnYihBM28JJZLHKI83qEU7cBMPF1w86w_gpIRxHdf43x0fBaJVrFDgWsUap7qP3_E19AcWVIieMF8K5Iv2v-nvcuL1vz-CrMeHZB5QtlVcAG8FZA_L-kyR9sGw-V4fQtWP-WFWPSzcZUUFkHKiWzBSgxmz3kL-LKE1XDaV3H-m9JQ9g");

        //     var data = new AdvisoryGeneralInfo {
        //         Address = "Address",
        //         OwnersLastName  = "OwnersLastName"
        //     };

        //     var content = new StringContent(JsonConvert.SerializeObject(data));
        //     content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

        //     var request = http.PostAsync("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Advises')/items", content);

        //     var response = request.Result.Content.ReadAsStringAsync().Result;

        //     return JsonConvert.DeserializeObject<AdvisoryGeneralInfo>(response);

        // }
    }
}
