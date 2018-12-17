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
#### 1. /ping
The `ping` operation is a POST-only operation. It responds with the server's status as online, and the server's communication and signing keys.
#### 2. /register
The `/register` operation is a POST-only operation. It allows a new user to be registered into the system.

**_Parameters_**

**username**: The username of the new user.

**key**: The PEM String of the RSA Public Key generated for the identity, which verifies messages as signed by the corresponding private key held by the user.

***address**: The address the user is reachable at.
#### 3. /updateaddress
The `/updateaddress` operation is a POST-only operation. It allows the user to update the address at which he is reachable.

**_Parameters_**

**username**: The username of the user whose address is being updated.

**command**: The command of the user. This is the string form of the JSON object represented by _Command Parameters_ below, encrypted with the user's signing key.

**_Command Parameters_**

**command**: For this operation, the command should be `updateaddress`

**address**: The new address of the user.

**timestamp**: Epoch time at which command was issued. Command will only be processed if it is was issued in the past 5000 milliseconds.
#### 4. /addidentity
The `/addidentity` operation is a POST-only operation. It allows the user to add an identity to his existing list of identities.

**_Parameters_**

**username**: The username of the user for which an identity is to be added.

**command**: The command of the user. This is the string form of the JSON object represented by _Command Parameters_ below, encrypted with the user's signing key.

**_Command Parameters_**

**command**: For this operation, the command should be `addidentity`

**identityname**: The name of the identity to be added.

**timestamp**: Epoch time at which command was issued. Command will only be processed if it is was issued in the past 5000 milliseconds.
#### 5. /requestchat/`identity`
The `/requestchat/identity` operation supports both GET and POST methods. It allows seeing the public key, and address for a specific identity determined by the `identity` parameter inside the URL path itself.

**_Parameters_**

**identity**: The name of the identity for which a public key and address are being requested.