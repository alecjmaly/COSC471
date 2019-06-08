
CREATE VIEW IF NOT EXISTS Passengers
AS
SELECT 
  p.id, 
  First_name AS 'First Name', 
  Last_name AS 'Last Name', 
  FULL_NAME AS 'Display Name',
  cc.Credit_card_num AS 'Card Number',
  cc.Credit_card_expMon || "/" || cc.Credit_Card_expYear AS 'Card Expiration',
  AVG_PASSENGER_RATING AS 'Average Passenger Rating'
FROM Person p
INNER JOIN Passenger pa ON pa.id = p.id
INNER JOIN Credit_Card cc ON pa.credit_card_id = cc.id; ---

