import { db } from '#server/database';
import { DATABASE_PATH } from '#server/environment';
import { parseArgs } from 'node:util';

const {
  values: { email, deadmin },
  positionals,
} = parseArgs({
  options: {
    email: { type: 'boolean', default: false },
    deadmin: { type: 'boolean', default: false },
  },
  allowPositionals: true,
});

const query = positionals.at(0);

if (query === undefined) {
  console.error(
    'usage: node scripts/make-admin.ts [--email] [--deadmin] <user id|email>',
  );
  process.exit(1);
}

if (DATABASE_PATH === ':memory:') {
  console.error('using this script with an in-memory database is a no-op!');
  console.error('please set DATABASE_PATH in a suitable environment file');
  process.exit(1);
}

const user_id = email
  ? db.Users.getFromEmail(query).data?.user_id
  : Number(query);

if (user_id === undefined || Number.isNaN(user_id)) {
  console.error('no such user exists!');
  process.exit(1);
}

const changes = db.Authentication.updateAdmin({
  user_id,
  is_admin: !deadmin,
}).expect('database error');

if (changes.rows_changed === 0) {
  console.error('no such user exists!');
  process.exit(1);
} else {
  console.log('success!');
}
