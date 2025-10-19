import type {
  MappedObject,
  SQLiteJoinedDatabaseCollectionConfig,
} from '#server/database/DatabaseCollection';
import { User, UserWithRelations } from '#shared/models';
import type { SQLOutputValue } from 'node:sqlite';
import z from 'zod';

export const UsersCollectionConfig = {
  zodSchema: User,
  joinedZodSchema: UserWithRelations,

  allSQL: /*sql*/ `
    SELECT * FROM Users;
  `,

  allJoinedSQL: /*sql*/ `
    SELECT
      Users.user_id,
      Users.given_names,
      Users.last_name,
      Users.email,
      Users.phone,
      Bookings.booking_id,
      Bookings.service_id,
      Bookings.booking_datetime,
      Bookings.notes,
      Services.config
    FROM Users
    LEFT JOIN Bookings ON Users.user_id = Bookings.user_id
    LEFT JOIN Services ON Bookings.service_id = Services.service_id;
  `,

  singleSQL: /*sql*/ `
    SELECT * FROM Users
      WHERE user_id = $id;
  `,

  singleJoinedSQL: /*sql*/ `
    SELECT
      Users.user_id,
      Users.given_names,
      Users.last_name,
      Users.email,
      Users.phone,
      Bookings.booking_id,
      Bookings.service_id,
      Bookings.booking_datetime,
      Bookings.notes,
      Services.config
    FROM Users
    LEFT JOIN Bookings ON Users.user_id = Bookings.user_id
    LEFT JOIN Services ON Bookings.service_id = Services.service_id
    WHERE Users.user_id = $id;
  `,

  insertSQL: /*sql*/ `
    INSERT INTO Users (given_names, last_name, email, phone)
      VALUES ($given_names, $last_name, $email, $phone);
  `,

  updateSQL: /*sql*/ `
    UPDATE Users
      SET
        given_names = $given_names,
        last_name = $last_name,
        email = $email,
        phone = $phone
      WHERE user_id = $user_id;
  `,

  deleteSQL: /*sql*/ `
    DELETE FROM Users WHERE user_id = $id;
  `,

  /**
   * Groups bookings under their respective users, collecting them into each
   * user's object.
   */
  mapRowsToJoinedObjects: (rows) => [
    ...rows
      .reduce((acc, row) => {
        const {
          // Users fields
          user_id,
          given_names,
          last_name,
          email,
          phone,
          // Bookings fields
          booking_id,
          service_id,
          booking_datetime,
          notes,
          // Services fields
          config,
        } = row;

        const id = user_id as number;

        if (!acc.has(id)) {
          acc.set(id, {
            user_id: id,
            given_names,
            last_name,
            email,
            phone,
            bookings: [],
          });
        }

        if (row.booking_id) {
          const service =
            typeof service_id === 'number' ? { service_id, config } : null;
          acc
            .get(id)
            ?.bookings.push({
              booking_id,
              user_id: id,
              service_id,
              booking_datetime,
              notes,
              service,
            });
        }
        return acc;
      }, new Map<number, MappedObject<z.input<typeof UserWithRelations>, SQLOutputValue>>())
      .values(),
  ],
} satisfies SQLiteJoinedDatabaseCollectionConfig<
  typeof User,
  typeof UserWithRelations
>;
