
SELECT  
  r.id,
  d.[Display Name] as 'Driver Name',
  p.[Display Name] as 'Passenger Name',
  s_a.[Display Name] as 'Driver Name',
  e_a.[Display Name] as 'Driver Name',
  
FROM Route r
INNER JOIN Drivers d ON d.id = r.driver_id
INNER JOIN Passengers p ON p.id = r.passenger.id
INNER JOIN Address s_a ON s_a.id = r.Start_address.id
INNER JOIN Address e_a ON e_a.id = r.End_address.id




;