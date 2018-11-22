# YASMS Server
## Installation
1. Ensure that you have **node.js** and **npm** installed on your machine
2. Clone the repo on your machine
3. Navigate to the folder where the repo has been cloned inside command prompt / powershell / terminal
4. Run the command `npm i`
## Usage
### Starting the Server
Inside the YASMS Server folder in your terminal of choice, run the command `node app.js`. This will start the server.
The server will report to you what port it is running on. The default port is 3000.
### Making Requests
You'll need an app like [Postman](https://www.getpostman.com/) to make requests to the server.
### Available Operations
YASMS Server currently supports 6 operations:
#### 1. /register
The `/register` operation is a POST-only operation. It allows a new user to be registered into the system.

**_Parameters_**

**username**: The username of the new user.

**key**: The PEM String of the RSA Public Key generated for the identity, which verifies messages as signed by the corresponding private key held by the user.

***address**: The address the user is reachable at.
#### 2. /updateaddress
The `/updateaddress` operation is a POST-only operation. It allows the user to update the address at which he is reachable.

**_Parameters_**

**username**: The username of the user whose address is being updated.

**encryptedusername**: The username of the user encrypted with the user's private signing key. This is to ensure that the user himself, not an impersonator, wants to update the address.

**newaddress**: The new address of the user.
#### 3. /addidentity
The `/addidentity` operation is a POST-only operation. It allows the user to add an identity to his existing list of identities.

**_Parameters_**

**username**: The username of the user for which an identity is to be added.

**encryptedusername**: The username of the user encrypted with the user's private signing key. This is to ensure that the user himself, not an impersonator, wants to add the identity to his list.

**identityname**: The name of the identity to be added.
#### 4. /deleteidentity
The `/deleteidentity` operation is a POST-only operation. It allows the user to remove an identity from his existing list of identities.

**_Parameters_**

**username**: The username of the user for which an identity is to be deleted.

**encryptedusername**: The username of the user encrypted with the user's private signing key. This is to ensure that the user himself, not an impersonator, wants to delete the identity from his list.

**identityname**: The name of the identity to be deleted.
#### 5. /requestchat/`identity`
The `/requestchat/identity` operation supports both GET and POST methods. It allows seeing the public key, and address for a specific identity determined by the `identity` parameter inside the URL path itself.

**_Parameters_**

**identity**: The name of the identity for which a public key and address are being requested.
#### 6. /unregister
The `/unregister` operation is a POST-only operation. It allows the user to delete himself and all his identities from the system.

**_Parameters_**

**username**: The username of the identity to unregister

**encryptedusername**: The username of the identity to unregister encrypted with the user's private signing key. This is to ensure that the user himself, not an impersonator, wants to unregister from the system.