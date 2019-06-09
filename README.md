# COSC 471 Project

# Hosted URL

App is hosted at this URL: https://cosc471demo.herokuapp
API/db server is hosted at this URL: https://cosc471-demo-server.herokuapp.com/
* Please use a modern browser (Chrome, Firefox, etc) - this application has not been polyfilled for IE11 or browers that do not support modern ECMAScript specifications.
* Please allow a minute for the application and api/db server to wake.
* This project runs locally using sqlite3. Concurrent connections to database may break the application. Replace SQLite with a db capable of multiple concurrent transactions to take advantage of client/server architecture. 




# Local Hosting
### Step 1: Download Application Files

Download instructions assume usage of a Windows PC (cmd), please alter commands if using a different system.
If [Git cli](https://git-scm.com/downloads) is installed, run the cmd statement below.

```
git clone https://github.com/alecjmaly/COSC471.git && cd COSC471
```

Otherwise, if Git cli is not installed, [download the zip file](https://github.com/alecjmaly/COSC471/archive/master.zip) on this page and extract to computer; then navigate to COSC471 folder using command prompt.



### Step 2: Install Dependencies

[Nose.js](https://nodejs.org/en/download/) must be installed  in order to run this application.

Navigate to COSC471 folder and run 

```
npm run build
```

### Step 3: Run Application

From COSC471 folder, run the following command.

```
npm run start
```

## Notes
This application has decoupled the database and client servers. The database server can be run independently of the front end client. 

Run the following commands in separate shells to start multiple clients.
### Run Server

```
npm run start_server
```

### Run Client Server

Multiple client servers can be created, opening on different ports, reducing the load on each client server. 
```
npm run start_client
```
