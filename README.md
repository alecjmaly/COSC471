# COSC 471 Project


Download instructions assume usage of a Windows PC (cmd), please alter commands if using a different system.

## Download Application Files


If [Git cli](https://git-scm.com/downloads) is installed, you may run the cmd statement below.

```
git clone https://github.com/alecjmaly/COSC471.git && cd COSC471
```

Otherwise, [download the zip file](https://github.com/alecjmaly/COSC471/archive/master.zip) on this page and extract to computer; then navigate to COSC471 folder using command prompt.



## Install Dependencies

[Nose.js](https://nodejs.org/en/download/) must be installed  in order to run this application.

Navigate to COSC471 folder and run 

```
npm run install_dependencies
```

## Run Application

From COSC471 folder, run the following command.

```
npm run start
```

## Notes
This application has decoupled the database and client servers. The database server can be run independently of the front end client. 

Run the following commands in separate shells to start multiple clients.

### Run Server

This project runs locally using sqlite3. Concurrent connections to database may break the application. Replace SQLite with a db capable of multiple concurrent transactions to take advantage of client/server architecture. 

```
npm run start_server
```

### Run Client Server

Multiple client servers can be created, opening on different ports, reducing the load on each client server. 
```
npm run start_client
```
