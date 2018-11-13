# Store Manager
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/johnwayodi/store-manager/issues)

Store Manager is a web application for use in a single store. There are two users: Administrator and Attendant.

The Administrator is the Store Owner and can add Store Attendants to the application. The Store Owner can also add, 
modify and delete products. The Store Owner will also be able to view all Sale Records created by the different Store Attendants.

The Store Attendant will be able to sell products and create Sale Records. The Attendant will also be able to view 
all his/her sale individual sale records.

The Front-End part of the application is up and running and can be viewed here: [Store Manager UI](https://johnwayodi.github.io/store-manager/)

The API is hosted on heroku and can be found here: [Store Manager API](https://jw-store-manager-apiv2.herokuapp.com/apidocs/)
## Usage
The app allows the first user who registers to be the Administrator of the
application, this is based on the assumption that the Store Owner will be the
first to register.

Admin is already registered, to access application login with the following credentials:

    usernme: johnquest
    password: qazwsxedc

Once logged in, the Administrator can perform the following functions:
1. Add, Update and Delete Categories
2. Add Store Attendant accounts.
3. Add, Update and Delete Products
4. View all system Users including their account.

After creating Attendant Account, log out the Administrator and login 
using the Attendant Credentials created earlier by the Store Owner.

The Store Attendant can perform the following functions:
1. View products added by Store owner.
2. Create Sale Records by selling the products.
3. View Sale records created.

## Testing
Manual Testing was implemented during the development of the integration module. 

The configuration of test automation tools is currently underway and all
testing will be done via automated test runs. 

##### Contributors
[John Wayodi](https://github.com/johnwayodi)

##### Acknowledgments

The development of this software was done with the support of [Andela](https://andela.com/) Kenya.
