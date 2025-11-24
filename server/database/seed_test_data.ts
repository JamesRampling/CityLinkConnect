export default /*sql*/ `
-- Seed with some example data

BEGIN TRANSACTION;

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
  ('Alice Marie', 'Johnson', 'alice.johnson@example.com', '0447392658'),
  ('Brian', 'Smith', 'brian.smith@example.com', '0492659371'),
  ('Cynthia', 'Lee', 'cynthia.lee@example.com', '0418259327');

INSERT INTO Bookings (user_id, service_id, booking_datetime, notes) VALUES
  (1, 1, '2025-11-15T10:00:00Z', 'New residential building.'),
  (2, 2, '2025-11-16T14:30:00Z', NULL),
  (2, 3, '2025-11-16T14:30:00Z', 'Need another bin.');

INSERT INTO Announcements (sort_datetime, config) VALUES
  ('2025-09-25', '<?xml version="1.0" encoding="UTF-8"?>
<announcement>
    <title>New Recycling Bins Rolled Out Citywide</title>
    <date>2025-09-25</date>
    <content>The council has introduced new colour-coded recycling bins across residential neighborhoods. Collection schedules remain unchanged.</content>
</announcement>'),
  ('2025-09-30', '<?xml version="1.0" encoding="UTF-8"?>
<announcement>
    <title>Public Meeting on Park Redevelopment Plans</title>
    <date>2025-09-30</date>
    <content>Residents are invited to attend a public meeting on the 7th of October to discuss proposed redevelopment plans for Riverbend Park.
    The meeting will be held at the Civic Centre Hall at 6 PM.</content>
</announcement>'),
('2025-10-01', '<?xml version="1.0" encoding="UTF-8"?>
<announcement>
    <title>Scheduled Road Maintenance in Westside District</title>
    <date>2025-10-01</date>
    <content>The council will begin scheduled road maintenance on Main Street and adjoining roads from the 10th of October to the 14th of October.
    Residents are advised to plan alternative routes.</content>
</announcement>');

INSERT INTO Feedback (email, subject, message) VALUES
  ('visitor@example.com', 'Website Navigation', 'The services list was easy to navigate.'),
  ('someone@example.org', 'Booking Issue', 'I had trouble selecting a time slot earlier today.');

-- Password for all example users is 'asdasdasdA1'. alice.johnson@example.com is an admin.
INSERT INTO Authentication (user_id, argon2_hash, is_admin) VALUES
  (1, '$argon2id$v=19$m=65536,t=3,p=4$ToSMXtMgbEfJC/Zm3bAWIQ$DNqsOeXpF3rwlylB9fzyaYF575LpPaXs6MaPC7p3X5I', TRUE),
  (2, '$argon2id$v=19$m=65536,t=3,p=4$K3SgzxaeCLnHZ2p5CnV+tA$MIXk2NjJJb5HapF4Q7c1L7ozM2H7bciaMi6vxmiQM3k', FALSE),
  (3, '$argon2id$v=19$m=65536,t=3,p=4$V76ai1IJM6WZkI/H3lK0qQ$hZPevN8lwpuprfcgyrGe1j8PyixYxLSryqjvsVOUmkw', FALSE);

COMMIT;
`;
