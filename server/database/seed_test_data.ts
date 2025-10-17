export default /*sql*/ `
-- Seed with some example data
INSERT INTO Services (config) VALUES
  ('{"name":"Service 1"}'),
  ('{"name":"Service 2"}'),
  ('{"name":"Service 3"}');

INSERT INTO Users (given_names, last_name, email, phone) VALUES
  ('John', 'Doe', 'j.doe@example.com', '+1234567890'),
  ('Jane', 'Smith', 'j.smith@example.com', '0412345678');

INSERT INTO Bookings (user_id, service_id, booking_datetime, notes) VALUES
  (1, 1, '2024-06-15T10:00:00Z', 'First booking'),
  (2, NULL, '2024-06-16T14:30:00Z', 'Second booking'),
  (2, 3, '2024-06-16T14:30:00Z', 'Third booking');

INSERT INTO Announcements (sort_datetime, config) VALUES
  ('2024-06-10T09:00:00Z', '{"title":"Announcement 1","content":"Content for announcement 1."}'),
  ('2024-06-12T15:00:00Z', '{"title":"Announcement 2","content":"Content for announcement 2."}');

INSERT INTO Feedback (email, subject, message) VALUES
  ('example@example.com', 'Feedback Subject', 'This is a feedback message.'),
  ('example2@example.com', 'Feedback Subject 2', 'This is a feedback message 2.');
`;
