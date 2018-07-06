using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using accmobile.Data;
using accmobile.Models;

namespace accmobile
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
        private readonly IHostingEnvironment _currentEnvironment;
        public IConfiguration HostingConfig { get; private set; }
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            _currentEnvironment = env;
            HostingConfig = configuration;

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

            // add application services
            services.AddDbContext<ApplicationDbContext>(options =>
               options.UseInMemoryDatabase(Guid.NewGuid().ToString()));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<SecurityStampValidatorOptions>(options =>
            {
                options.ValidationInterval = TimeSpan.FromDays(10);
            });

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
                    options.Cookie.Expiration = TimeSpan.FromHours(10);
                    options.ExpireTimeSpan = TimeSpan.FromHours(10);
                    options.SlidingExpiration = true;
                });

            Environment.SetEnvironmentVariable("sendgrid", Configuration["sendgrid"]);
            Environment.SetEnvironmentVariable("refreshtoken", Configuration["refreshtoken"]);
            Environment.SetEnvironmentVariable("SPClientSecret", Configuration["SPClientSecret"]);
            Environment.SetEnvironmentVariable("SPClientID", Configuration["SPClientID"]);
            Environment.SetEnvironmentVariable("redirecturi", Configuration["redirecturi"]);
            Environment.SetEnvironmentVariable("spresourceid", Configuration["spresourceid"]);
            Environment.SetEnvironmentVariable("googleapikey", Configuration["googleapikey"]);

            services.AddMvc()
                .AddSessionStateTempDataProvider();

            services.AddSession(options =>
            {
                options.Cookie.Name = "session";
                options.Cookie.HttpOnly = true;
                options.IdleTimeout = TimeSpan.FromHours(10);
            });
        }

        // HTTP request pipeline
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
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

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}