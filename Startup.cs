using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.AspNetCore.Http;
using ACCmobile.Data;
using ACCmobile.Models;

namespace ACCmobile
{
    public class Startup
    {
        string _MSClientID = null;
        string _MSClientSecret = null;
        string _sendgrid = null;
        string _refreshtoken = null;
        string _SPClientSecret = null;
        string _SPClientID = null;
        string _redirecturi = null;
        string _spresourceid = null;
        string _googleapikey = null;
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsDevelopment())
            {
                builder.AddUserSecrets<Startup>();
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            _MSClientID = Configuration["MSClientId"];
            _MSClientSecret = Configuration["MSClientSecret"];
            _sendgrid = Configuration["sendgrid"];
            _refreshtoken = Configuration["refreshtoken"];
            _SPClientSecret = Configuration["SPClientSecret"];
            _SPClientID = Configuration["SPClientID"];
            _redirecturi = Configuration["redirecturi"];
            _spresourceid = Configuration["spresourceid"];
            _googleapikey = Configuration["googleapikey"];

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase(Guid.NewGuid().ToString()));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication()
                .AddMicrosoftAccount(microsoftOptions =>
                {
                    microsoftOptions.ClientId = Configuration["MSClientId"];
                    microsoftOptions.ClientSecret = Configuration["MSClientSecret"];
                })
                .Services.ConfigureApplicationCookie(options =>
                {
                    options.Cookie.Name = "auth";    
                    options.Cookie.HttpOnly = true;
                    options.ExpireTimeSpan = TimeSpan.FromHours(10);
                    options.SlidingExpiration = true;
                });

            // add application services
            Environment.SetEnvironmentVariable("sendgrid", Configuration["sendgrid"]);
            Environment.SetEnvironmentVariable("refreshtoken", Configuration["refreshtoken"]);
            Environment.SetEnvironmentVariable("SPClientSecret", Configuration["SPClientSecret"]);
            Environment.SetEnvironmentVariable("SPClientID", Configuration["SPClientID"]);
            Environment.SetEnvironmentVariable("redirecturi", Configuration["redirecturi"]);
            Environment.SetEnvironmentVariable("spresourceid", Configuration["spresourceid"]);
            Environment.SetEnvironmentVariable("googleapikey", Configuration["googleapikey"]);

            services.AddMvc()
                .AddSessionStateTempDataProvider();

            services.AddSession(options => { 
                options.Cookie.Name = "session";
                options.Cookie.HttpOnly = true;
                options.IdleTimeout = TimeSpan.FromHours(10); 
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseSession(); 

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
