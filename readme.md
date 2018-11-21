#YASMS Server
##Installation
1. Ensure that you have **node.js** and **npm** installed on your machine
2. Clone the repo on your machine
3. Navigate to the folder where the repo has been cloned inside command prompt / powershell / terminal
4. Run the command `npm i`
##Usage
###Starting the Server
Inside the YASMS Server folder in your terminal of choice, run the command `node app.js`. This will start the server.
The server will report to you what port it is running on. The default port is 3000.
###Available Operations
YASMS Server currently supports 4 operations
####1. /register
The `/register` operation is a POST-only operation. It allows a new identity to be registered into the system.
**Parameters**
#####1. username
The username of the new identity
#####2. key
The PEM String of the RSA Public Key generated for the identity, and used by it to sign all messages
####2. /users
The `/users` operation supports both GET and POST methods. It lists all identities in the system and their public keys.
####3. /users/`name`
The `/users/name` operation supports both GET and POST methods. It allows seeing the username and public key for a specific user determined by the `name` parameter inside the URL path itself.
**Parameters**
#####1. name
The username of the identity for which a public key is being requested
####4. /unregister
The `/unregister` operation is a POST-only operation. It allows the user to delete an identity, freeing the username for use by another user.
**Parameters**
#####1. username
The username of the identity to unregister
#####2. encryptedusername
The username of the identity to unregister encrypted with the user's private signing key