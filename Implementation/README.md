# SplitSquad

This is the implementation of our project in Sveltekit using Typescript, Prisma, Postgres, and Bootstrap. Testing is implemented using Vitest and Playwright.

## How to build

- Must have [Node.js](https://nodejs.org/) with NPM installed
- Clone the repository, navigate to this directory
- Run `npm install`
- Create a Postgres server using [PgAdmin 4](https://www.postgresql.org/download/), or have a Postgres server available for connection
  - Remember the username and password of the admin user, you'll need it later
  - Create a database separate from the default one and remember the name. All if its options can be default.
- Run `npx prisma migrate dev` to setup the database schema in the Postgres database.
  - If it asks for a migration name, input any text
- Create a text file named `.env` at the root of this directory
- Add the following lines based on the example below:
  - Substitute `USERNAME` with your database username for PgAdmin 4
  - Substitute `PASSWORD` with your database password for PgAdmin 4
  - Substitute `DBNAME` with the name of your database
  - `DATABASE_URL` doesn't have to be localhost; it just needs to be a connectable Postgres database
  - `AUTH_SECRET` is any long secret value. It will be used to sign session tokens.

```bash
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DBNAME?schema=public"
AUTH_SECRET="SOME VERY LONG SECRET VALUE"
```

- Run `npm run build` and `npm run preview` to run the production server

## Testing

Tests can be ran with `npm run test`. Vitest can be ran specifically with `npm run test:unit`, and Playwright specifically with `npm run test:integration`.

However, for Playwright to work, you must install the default browsers with `npx playwright install`. You also need to add the following lines into `.env` based on a real account in the database:

```bash
TEST_USERNAME="USERNAME"
TEST_PASSWORD="PASSWORD"
```

The two notable test files are at the following locations:

- Vitest: `src/lib/util/server.test.ts`
- Playwright: `test/login.spec.ts`
  - Playwright configuration is in `playwright.config.ts`

## What is missing from this implementation?

There are a few features not implemented in this project due to development limitations.

- Money in this project is fake and there is no way to actually connect to a bank. This is because setting up a system requires verification and fees which is out of the scope of this assignment.
- Mobile push notifications and verification is not implemented because these also have fees.

Although these features are not complete, their functionality is included in the project. Namely, you can still send fake money, and you still receive notifications on the homepage.
