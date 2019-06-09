

CREATE TABLE IF NOT EXISTS Address(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  Street_no int,
  Street varchar(50),
  City varchar(50),
  State varchar(50),
  Zip int CHECK(length(Zip) > 0 AND length(ZIP) < 8 )
); ---


CREATE TABLE IF NOT EXISTS Credit_Card(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  Credit_card_num int NOT NULL CHECK(length(Credit_card_num) = 15),
  Credit_card_expMon int NOT NULL CHECK(Credit_card_expMon > 0 AND Credit_card_expMon < 13),
  Credit_card_expYear int NOT NULL CHECK(Credit_card_expYear > 2018) -- can make dynamic year based on today
); ---


CREATE TABLE IF NOT EXISTS Person(
  id integer PRIMARY KEY AUTOINCREMENT, 
  First_name varchar(50) NOT NULL,
  Last_name varchar(50) NOT NULL,
  FULL_NAME varchar(100),
  Address_id INTEGER REFERENCES Address(id)
); ---


CREATE TRIGGER [Populate_Full_Name_insert] AFTER INSERT ON [Person] BEGIN
  UPDATE [Person]
  SET    [FULL_NAME] = [First_name] || " " || [Last_name]
  WHERE [rowId] = [NEW].[RowId]; 
END; ---

CREATE TRIGGER [Populate_Full_Name_update] AFTER UPDATE ON [Person] BEGIN
  UPDATE [Person]
  SET    [FULL_NAME] = [First_name] || " " || [Last_name]
  WHERE [rowId] = [NEW].[RowId]; 
END; ---




CREATE TABLE IF NOT EXISTS Driver(
  id INTEGER NOT NULL PRIMARY KEY REFERENCES Person(id),
  License_no varchar(10),
  Vehicle_no INTEGER REFERENCES Vehicle(VIN_no),
  AVG_DRIVER_RATING int
); ---

CREATE TRIGGER [clean_vehicle_list_update] AFTER UPDATE ON [Driver] BEGIN
  DELETE FROM Vehicle 
  WHERE VIN_no NOT IN (SELECT Vehicle_no FROM [Driver]);
END; ---

CREATE TRIGGER [clean_vehicle_list_delete] AFTER DELETE ON [Driver] BEGIN
  DELETE FROM Vehicle 
  WHERE VIN_no NOT IN (SELECT Vehicle_no FROM [Driver]);
END; ---





CREATE TABLE IF NOT EXISTS Passenger(
  id INTEGER NOT NULL PRIMARY KEY REFERENCES Person(id),
  credit_card_id INTEGER REFERENCES Credit_Card(id),
  AVG_PASSENGER_RATING int
); ---

CREATE TRIGGER [clean_credit_card_list_update] AFTER Update ON [Passenger] BEGIN
  DELETE FROM Credit_Card 
  WHERE id NOT IN (SELECT credit_card_id FROM Passenger);
END; ---

CREATE TRIGGER [clean_credit_card_list_delete] AFTER DELETE ON [Passenger] BEGIN
  DELETE FROM Credit_Card 
  WHERE id NOT IN (SELECT credit_card_id FROM Passenger);
END; ---




CREATE TABLE IF NOT EXISTS Vehicle(
  VIN_no int PRIMARY KEY NOT NULL,
  License_Plate_No varchar(6) NOT NULL UNIQUE,
  Make varchar(50) NOT NULL,
  Model varchar(50) NOT NULL,
  Year int NOT NULL CHECK(length(Year) = 4), 
  Color varchar(50)
); ---


CREATE TABLE IF NOT EXISTS Route(
  id integer PRIMARY KEY AUTOINCREMENT,
  driver_id INTEGER NOT NULL REFERENCES Person(id) CHECK(driver_id != passenger_id),
  passenger_id INTEGER NOT NULL REFERENCES Person(id) CHECK(passenger_id != driver_id),
  Start_address INTEGER NOT NULL REFERENCES Address(id) CHECK(Start_address != End_Address),
  End_address INTEGER NOT NULL REFERENCES Address(id) CHECK(Start_address != End_Address),


  Driver_rating int 
    CHECK(Driver_rating > 0 AND Driver_rating < 11),
  Passenger_rating int 
    CHECK(Passenger_rating > 0 AND Passenger_rating < 11)
); ---

-- TRIGGER on Route table on insert, populate average value for passenger and driver


CREATE TRIGGER [Populate_Avg_Rating_insert] AFTER INSERT ON [Route] BEGIN
  UPDATE [Passenger]
  SET    [AVG_PASSENGER_RATING] = 
    (SELECT ROUND(AVG(Passenger_rating), 2) FROM Route WHERE passenger_id = [NEW].[passenger_id])
  WHERE [id] = [NEW].[passenger_id]; 
  
  UPDATE [Driver]
  SET    [AVG_DRIVER_RATING] = 
    (SELECT ROUND(AVG(Driver_rating), 2) FROM Route WHERE driver_id = [NEW].[driver_id])
  WHERE [id] = [NEW].[driver_id]; 
END; ---

CREATE TRIGGER [Populate_Avg_Rating_update] AFTER UPDATE ON [Route] BEGIN
  UPDATE [Passenger]
  SET    [AVG_PASSENGER_RATING] = 
    (SELECT ROUND(AVG(Passenger_rating), 2) FROM Route WHERE passenger_id = [NEW].[passenger_id])
  WHERE [id] = [NEW].[passenger_id]; 
  
  UPDATE [Driver]
  SET    [AVG_DRIVER_RATING] = 
    (SELECT ROUND(AVG(Driver_rating), 2) FROM Route WHERE driver_id = [NEW].[driver_id])
  WHERE [id] = [NEW].[driver_id]; 
END; ---

CREATE TRIGGER [Populate_Avg_Rating_delete] AFTER DELETE ON [Route] BEGIN
  UPDATE [Passenger]
  SET    [AVG_PASSENGER_RATING] = 
    (SELECT ROUND(AVG(Passenger_rating), 2) FROM Route WHERE passenger_id = [OLD].[passenger_id])
  WHERE [id] = [OLD].[passenger_id]; 
  
  UPDATE [Driver]
  SET    [AVG_DRIVER_RATING] = 
    (SELECT ROUND(AVG(Driver_rating), 2) FROM Route WHERE driver_id = [OLD].[driver_id])
  WHERE [id] = [OLD].[driver_id]; 
END; ---





-- Views --


CREATE VIEW IF NOT EXISTS People
AS
SELECT 
  p.id, 
  First_name AS 'First Name', 
  Last_name AS 'Last Name', 
  FULL_NAME AS 'Display Name',
  EXISTS(SELECT * FROM Driver WHERE id = p.id) AS 'isDriver',
  EXISTS(SELECT * FROM Passenger WHERE id = p.id) AS 'isPassenger'
FROM Person p
WHERE
  EXISTS(SELECT * FROM Driver WHERE id = p.id) OR
  EXISTS(SELECT * FROM Passenger WHERE id = p.id); ---


CREATE VIEW IF NOT EXISTS Drivers
AS
SELECT 
  p.id, 
  First_name AS 'First Name', 
  Last_name AS 'Last Name', 
  FULL_NAME AS 'Display Name', 
  License_no AS 'License Number', 
  AVG_DRIVER_RATING AS 'Average Driver Rating'
FROM Person p
INNER JOIN Driver d ON d.id = p.id; ---


CREATE VIEW IF NOT EXISTS Passengers
AS
SELECT 
  p.id, 
  First_name AS 'First Name', 
  Last_name AS 'Last Name', 
  FULL_NAME AS 'Display Name', 
  AVG_PASSENGER_RATING AS 'Average Passenger Rating'
FROM Person p
INNER JOIN Passenger pa ON pa.id = p.id ---




CREATE TABLE IF NOT EXISTS Credit_Card(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  Credit_card_num int NOT NULL CHECK(length(Credit_card_num) = 15),
  Credit_card_expMon int NOT NULL CHECK(Credit_card_expMon > 0 AND Credit_card_expMon < 13),
  Credit_card_expYear int NOT NULL CHECK(Credit_card_expYear > 2019) -- can make dynamic year based on today
); ---

CREATE VIEW IF NOT EXISTS Addresses
AS 
SELECT 
  id, 
  Street_no || " " || Street as Street, 
  City, 
  State, 
  Zip 
FROM Address; ---

CREATE VIEW IF NOT EXISTS Routes
AS
SELECT  
  r.id,
  d.[FULL_NAME] || " (" || r.driver_rating || ")" as 'Driver (rating)',
  p.[FULL_NAME] || " (" || r.passenger_rating || ")" as 'Passenger (rating)',
  s_a.Street ||  CHAR(10)  || s_a.City || ", " || s_a.State || " " || s_a.Zip as 'Start Address',
  e_a.Street ||  CHAR(10)  || e_a.City || ", " || e_a.State || " " || e_a.Zip as 'End Address'

FROM Route r
INNER JOIN Person d ON d.id = r.driver_id
INNER JOIN Person p ON p.id = r.passenger_id
INNER JOIN Addresses s_a ON s_a.id = r.Start_address
INNER JOIN Addresses e_a ON e_a.id = r.End_address;
