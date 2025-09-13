---
applyTo: "**"
---

# contexto

Estamos desarrollando una aplicación web utilizando Next.js y Typescript.
Es una solución personalizada para mostrar items desde la api de zoho de forma personalizada para el cliente.
Actualmente cuenta con autenticación a través de Auth0.
Las llamadas a la api se cachean adicionalmente en upstash redis para mejorar el rendimiento.

# flujo actual de la aplicación

1. El usuario accede a la aplicación web.
2. Si no está autenticado, se muestra una pagina de bienvenida con un botón de login.
3. Al hacer click en el botón de login, se redirige al usuario a la página de login de Auth0.
4. El usuario introduce sus credenciales y es redirigido de vuelta a la aplicación web.
5. La aplicación web utiliza un refresh token almacenado en variables de entorno para obtener nuevos tokens de acceso cuando el token actual expira.
6. La aplicación web utiliza el token de acceso para hacer llamadas a la api de zoho y mostrar los items al usuario.
7. La aplicación web cachea las respuestas de la api en upstash redis para mejorar el rendimiento.
8. El usuario puede cerrar sesión, lo que elimina su sesión en la aplicación web.

# configuración actual zoho

La app cuenta con las siguientes variables de entorno para la autenticación con zoho:

ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_GRANT_TYPE=refresh_token
ZOHO_ORG_ID=875013996
ZOHO_ACCOUNTS_BASE=https://accounts.zoho.com
ZOHO_REDIRECT_URI=http://localhost:3000/auth/callback

# objetivo

- Migrar la autenticación de Auth0 a OAuth2 con Zoho directamente.
- Obtener toda la información necesaria del usuario actual, ya que podría ser necesario mostrar información personalizada a cada usuario por sus permisos en zoho.
- Utilizar las mejores y mas recomendadas practicas de seguridad para manejar tokens y credenciales de acceso y especificamente con zoho.
- Mantener el cacheo en upstash redis para mejorar el rendimiento (si se considera necesario).

# zoho oauth

OAuth
Zoho REST APIs uses the OAuth 2.0 protocol to authorize and authenticate calls. It provides secure access to protect resources thereby reducing the hassle of asking for a username and password everytime a user logs in. Follow the steps listed here, to access Zoho’s APIs using OAuth 2.0

Note:The API URLs in this section should be modified, based on your domain.

Data Center Domain Base API URI
United States .com https://accounts.zoho.com/
Europe .eu https://accounts.zoho.eu/
India .in https://accounts.zoho.in/
Australia .com.au https://accounts.zoho.com.au/
Canada .ca https://accounts.zohocloud.ca/
You can read more about this here.

Step 1: Registering New Client
You will have to first register your application with Zoho's Developer console in order get your Client ID and Client Secret.

To register your application, go to https://accounts.zoho.com/developerconsole and click on Add Client ID. Provide the required details to register your application.

On successful registration, you will be provided with a set of OAuth 2.0 credentials such as a Client ID and Client Secret that are known to both Zoho and your application. Do not share this credentials anywhere.

Step 2: Generating Grant Token
Redirect to the following authorization URL with the given params

https://accounts.zoho.com/oauth/v2/auth?

Parameter Description
scope _ SCOPE for which the token to be generated. Multiple scopes can be given which has to be separated by commas. Ex : ZohoInventory.FullAccess.all
client_id _ Client ID obtained during Client Registration
state An opaque string that is round-tripped in the protocol; ie., whatever value given to this will be passed back to you.
response*type * code
redirect*uri * One of the redirect URI given in above step. This param should be same redirect url mentioned while registering the Client
access_type The allowed values are offline and online. The online access_type gives your application only the access_token which is valid for one hour. The offline access_type will give the application an access_token as well as a refresh_token. By default it is taken as online
prompt Prompts for user consent each time your app tries to access user credentials. Ex: Consent
Note: Fields with \* are mandatory

On this request, you will be shown with a "user consent page".

Upon clicking “Accept”, Zoho will redirect to the given redirect_uri with code and state param. This code value is mandatory to get the access token in the next step and this code is valid for 60 seconds.

On clicking “Deny”, the server returns an error

Request Example

https://accounts.zoho.com/oauth/v2/auth?scope=ZohoInventory.invoices.CREATE,ZohoInventory.invoices.READ,ZohoInventory.invoices.UPDATE,ZohoInventory.invoices.DELETE&client_id=1000.0SRSxxxxxxxxxxxxxxxxxxxx239V&state=testing&response_type=code&redirect_uri=http://www.zoho.com/inventory&access_type=offline

Step 3: Generate Access and Refresh Token
After getting code from the above step, make a POST request for the following URL with given params, to generate the access_token.

https://accounts.zoho.com/oauth/v2/token?

Parameter Description
code* code which is obtained in the above step
client_id* Client ID obtained during Client Registration
client_secret* Client secret obtained during Client Registration
redirect_uri* This param should be same redirect url mentioned while adding Client
grant_type* authorization_code
scope SCOPE for which token to be generated. Ex : ZohoBooks.fullaccess.all. Multiple scopes has to be separated by commas.
state An opaque string that is round-tripped in the protocol; that is to say, value will be passed back to you.
Note: Fields with * are mandatory

In the response, you will get both access_token and refresh_token.

1. The access_token will expire after a particular period (as given in expires_in param in the response).

2. The refresh_token is permanent and will be used to regenerate new access_token, if the current access token is expired.

Note: Each time a re-consent page is accepted, a new refresh token is generated. The maximum limit is 20 refresh tokens per user. If this limit is crossed, the first refresh token is automatically deleted to accommodate the latest one. This is done irrespective of whether the first refresh token is in use or not.

Request Example

https://accounts.zoho.com/oauth/v2/token?code=1000.dd7exxxxxxxxxxxxxxxxxxxxxxxx9bb8.b6c0xxxxxxxxxxxxxxxxxxxxxxxxdca4&client_id=1000.0SRSxxxxxxxxxxxxxxxxxxxx239V&client_secret=fb01xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx8abf&redirect_uri=http://www.zoho.com/inventory&grant_type=authorization_code

Step 4: Generate Access Token From Refresh Token
Access Tokens have limited validity. In most general cases the access tokens expire in one hour. Until then, the access token has unlimited usage. Once it expires, your app will have to use the refresh token to request for a new access token. Redirect to the following POST URL with the given params to get a new access token

https://accounts.zoho.com/oauth/v2/token?

Parameter Description
refresh_token REFRESH TOKEN which is obtained in the above step
client_id Client ID obtained during Client Registration
client_secret Client secret obtained during Client Registration
redirect_uri This param should be same redirect url mentioned while registering Client
grant_type refresh_token
Request Example

https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.8ecdxxxxxxxxxxxxxxxxxxxxxxxx5cb7.463xxxxxxxxxxxxxxxxxxxxxxxxebdc&client_id=1000.0SRSxxxxxxxxxxxxxxxxxxxx239V&client_secret=fb01xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx8abf&redirect_uri=http://www.zoho.com/inventory&grant_type=refresh_token

Step 5: Revoking a Refresh Token
To revoke a refresh token, call the following POST URL with the given params

https://accounts.zoho.com/oauth/v2/token/revoke?

Parameter Description
token REFRESH TOKEN which is to be revoked
Request Example

https://accounts.zoho.com/oauth/v2/token/revoke?token=1000.8ecdxxxxxxxxxxxxxxxxxxxxxxxx5cb7.4638xxxxxxxxxxxxxxxxxxxxxxxxebdc

Step 6: Calling An API
Access Token can be passed only in header and cannot be passed in the request param.

Header name should be Authorization
Header value should be Zoho-oauthtoken {access_token}
List of scopes available in Zoho Inventory :

Scope Description
contacts To access contacts related APIs
Available types: ZohoInventory.contacts.CREATE, ZohoInventory.contacts.UPDATE, ZohoInventory.contacts.READ, ZohoInventory.contacts.DELETE
items To access item related APIs
Available types: ZohoInventory.items.CREATE, ZohoInventory.items.UPDATE, ZohoInventory.items.READ, ZohoInventory.items.DELETE
composite items To access item related APIs
Available types: ZohoInventory.compositeitems.CREATE, ZohoInventory.compositeitems.UPDATE, ZohoInventory.compositeitems.READ, ZohoInventory.compositeitems.DELETE
inventory adjustments To access inventory adjustments related APIs
Available types: ZohoInventory.inventoryadjustments.CREATE, ZohoInventory.inventoryadjustments.READ, ZohoInventory.inventoryadjustments.UPDATE, ZohoInventory.inventoryadjustments.DELETE
transfer orders To access transfer order related APIs
Available types: ZohoInventory.transferorders.CREATE, ZohoInventory.transferorders.READ, ZohoInventory.transferorders.UPDATE, ZohoInventory.transferorders.DELETE
settings To access users, taxes, currencies related APIs
Available types: ZohoInventory.settings.CREATE, ZohoInventory.settings.UPDATE, ZohoInventory.settings.READ, ZohoInventory.settings.DELETE
salesorder To access salesorder related APIs
Available types: ZohoInventory.salesorders.CREATE, ZohoInventory.salesorders.UPDATE, ZohoInventory.salesorders.READ, ZohoInventory.salesorders.DELETE
packages To access Package related APIs
Available types: ZohoInventory.packages.CREATE, ZohoInventory.packages.UPDATE, ZohoInventory.packages.READ, ZohoInventory.packages.DELETE
shipmentorders To access Shipment order related APIs
Available types: ZohoInventory.shipmentorders.CREATE, ZohoInventory.shipmentorders.UPDATE, ZohoInventory.shipmentorders.READ, ZohoInventory.shipmentorders.DELETE
invoices To access invoices related APIs
Available types: ZohoInventory.invoices.CREATE, ZohoInventory.invoices.UPDATE, ZohoInventory.invoices.READ, ZohoInventory.invoices.DELETE
customerpayments To access customer payments related APIs
Available types: ZohoInventory.customerpayments.CREATE, ZohoInventory.customerpayments.UPDATE, ZohoInventory.customerpayments.READ, ZohoInventory.customerpayments.DELETE
salesreturns To access sales return related APIs
Available types: ZohoInventory.salesreturns.CREATE, ZohoInventory.salesreturns.UPDATE, ZohoInventory.salesreturns.READ, ZohoInventory.salesreturns.DELETE
creditnotes To access credit notes related APIs
Available types: ZohoInventory.creditnotes.CREATE, ZohoInventory.creditnotes.UPDATE, ZohoInventory.creditnotes.READ, ZohoInventory.creditnotes.DELETE
purchaseorder To access purchaseorder related APIs
Available types: ZohoInventory.purchaseorders.CREATE, ZohoInventory.purchaseorders.UPDATE, ZohoInventory.purchaseorders.READ, ZohoInventory.purchaseorders.DELETE
purchase receives To access purchase receive related APIs
Available types: ZohoInventory.purchasereceives.CREATE, ZohoInventory.purchasereceives.READ, ZohoInventory.purchasereceives.UPDATE, ZohoInventory.purchasereceives.DELETE
bills To access bills related APIs
Available types: ZohoInventory.bills.CREATE, ZohoInventory.bills.UPDATE, ZohoInventory.bills.READ, ZohoInventory.bills.DELETE
