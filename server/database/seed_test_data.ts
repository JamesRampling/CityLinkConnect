export default /*sql*/ `
-- Seed with some example data
INSERT INTO Services (config) VALUES
  ('<?xml version="1.0" encoding="UTF-8"?>
<service>
  <name>Building Permit Application</name>
  <description>Application and processing of permits for new building construction and renovations.</description>
  <fees>
    <fee title="Standard Permit">
      <price variant="residential">$150</price>
      <price variant="commercial">$500</price>
    </fee>
    <fee title="Expedited Permit">
      <price variant="residential">$300</price>
      <price variant="commercial">$900</price>
    </fee>
  </fees>
</service>'),
  ('<?xml version="1.0" encoding="UTF-8"?>
<service>
  <name>Community Event Booking</name>
  <description>Reservation service for community halls and outdoor event spaces.</description>
</service>'),
  ('<?xml version="1.0" encoding="UTF-8"?>
<service>
  <name>Waste Collection</name>
  <description>Weekly residential waste collection service.</description>
  <fees>
    <fee title="Monthly Subscription">
      <price variant="standard">$25</price>
    </fee>
  </fees>
</service>');

INSERT INTO Users (given_names, last_name, email, phone) VALUES
  ('John', 'Doe', 'j.doe@example.com', '0123456789'),
  ('Jane', 'Smith', 'j.smith@example.com', '0412345678');

INSERT INTO Bookings (user_id, service_id, booking_datetime, notes) VALUES
  (1, 1, '2024-06-15T10:00:00Z', 'First booking'),
  (2, 2, '2024-06-16T14:30:00Z', 'Second booking'),
  (2, 3, '2024-06-16T14:30:00Z', 'Third booking');

INSERT INTO Announcements (sort_datetime, config) VALUES
  ('2025-09-25T00:00:00Z', '<?xml version="1.0" encoding="UTF-8"?>
<announcement>
    <title>New Recycling Bins Rolled Out Citywide</title>
    <date>2025-09-25</date>
    <content>The council has introduced new colour-coded recycling bins across residential neighborhoods. Collection schedules remain unchanged.</content>
</announcement>'),
  ('2025-09-30T00:00:00Z', '<?xml version="1.0" encoding="UTF-8"?>
<announcement>
    <title>Public Meeting on Park Redevelopment Plans</title>
    <date>2025-09-30</date>
    <content>Residents are invited to attend a public meeting on the 7th of October to discuss proposed redevelopment plans for Riverbend Park.
    The meeting will be held at the Civic Centre Hall at 6 PM.</content>
</announcement>'),
('2025-10-01T00:00:00Z', '<?xml version="1.0" encoding="UTF-8"?>
<announcement>
    <title>Scheduled Road Maintenance in Westside District</title>
    <date>2025-10-01</date>
    <content>The council will begin scheduled road maintenance on Main Street and adjoining roads from the 10th of October to the 14th of October.
    Residents are advised to plan alternative routes.</content>
</announcement>');

INSERT INTO Feedback (email, subject, message) VALUES
  ('example@example.com', 'Feedback Subject', 'This is a feedback message.'),
  ('example2@example.com', 'Feedback Subject 2', 'This is a feedback message 2.');
`;
