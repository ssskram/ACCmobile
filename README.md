# ACC Mobile

ACC Mobile is the incident tracking program used by Animal Care and Control at the City of Pittsburgh.  It was developed to meet a number of needs:
* Provide a single source of truth for incident data
* Provide a simple interface for creating and updating incidents from both the office, and the field
* Provide a simple interface for retrieving incident data by address, citizen, etc.
* Provide a responsive interface for small devices

ACC Mobile uses Sharepoint as the data store and interfaces primarily with the [365-proxy](https://github.com/CityofPittsburgh/365-api).  There is also an interface with [blobby](https://github.com/CityofPittsburgh/blobby) for creating and retrieving images from an Azure blob.

## A note on boilerplate

The bones of ACC Mobile are shared across all client applications developed by Paul Marks for the City of Pittsburgh.  For more in-depth documentation on the structure,  design choices, authentication flow, and installation procedures for this application, please see the documentation for the [boilerplate](https://github.com/CityofPittsburgh/react-typescript-boilerplate).

This README will focus only on the components of this application that are unique to ACC Mobile.

## Structure
    ...
    app
    ├── src                         
        ├── components              
            |── home                # Loads the store, serves up /incidents
            |── images              # Handles the creation, display, and deletion of images within /report
            |── incidents           # List of incidents -- tables, cards, & filters
            |── map                 # Google Map wrapper, used in /report
            |── report              # Incident report
            |── submitAnimal        # Animal form -- post, and put
            |── submitIncident      # Incident form -- post and put
        ├── store                   
            |── dropdowns           # Contains all tables used as reference data for controled form inputs.
            |── incidents           # Contains all incident records

## Running Locally

### Prerequisites

* [Node.js](https://nodejs.org) - JS runtime
* .env - See .env.example for all required secrets

### Installation
```
git clone https://github.com/CityofPittsburgh/accmobile
cd accmobile
// first, install dependencies for the server
npm install
// then, install dependencies for the client
cd app
npm install
// to run the app locally and bypass auth
npm start
// to bundle the app for deployment
npm run build
// to run the app from the minified build, with auth workflow
cd ..
node server.js
```

## Deployment

Both staging and production services are hosted in Azure.  Application is deployed directly from github, and can be triggered either (a) through the Azure GUI, (b) through the [CLI](https://docs.microsoft.com/en-us/cli/azure/webapp/deployment/source?view=azure-cli-latest#az-webapp-deployment-source-sync), or (c) through the [proxy service](https://github.com/CityofPittsburgh/azure-proxy).

For complete documentation on the azure environment, see [here](https://github.com/CityofPittsburgh/all-things-azure.git).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details