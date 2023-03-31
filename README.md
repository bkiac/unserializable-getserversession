# BigHire

This is a guide on how to set up and run the development server for the big-hire project.

## Prerequisites

- Node.js 16.x
- pnpm
- Docker

## Running the Development Server

To run the development server, execute the following command in the project root folder:

```bash
pnpm dev
```

This command will concurrently run the Next.js app server and services using Docker Compose.

The `dev:app` script runs the Next.js development server, and the `dev:services` script starts the required services using Docker Compose. You can run them separately in different terminals if you prefer.

Once the development server is up and running, you can access the app at http://localhost:3000.

### Database

The project uses Prisma as an ORM to handle database migrations. This section will guide you through running Prisma database migrations during development.

#### Running Backend Services

Before you can run migrations, you need to have the database running. To start the required services using Docker Compose, execute the following command:

```bash
pnpm dev:services
```

This command will start the necessary services, including the database, for the development environment.

#### Performing Migrations

If you're setting up the services for the first time, or you have modified the schema you need to run the following command to apply the changes to the database:

```bash
pnpm db:migrate:dev
```

This command will run the `prisma migrate dev` command using the development environment configuration. It will apply any pending migrations or create new ones based on the changes in the schema.

Remember to run the `db:migrate:dev` command each time you make changes to the schema or when you're spinning up the services for the first time. This will ensure that your database stays in sync with the application's schema.

### Email Service

The project uses Ethereal, a fake SMTP service, for development purposes. This allows you to test email-related features without actually sending emails.

With this configuration, the application will use the Ethereal email service to send emails during development.

#### Viewing Sent Emails

To view the sent emails, log in to the [Ethereal website](https://ethereal.email/) using the provided username and password from the `EMAIL_SERVER` configuration.

The login configuration for the Ethereal email service is available in the `.env.development` file.

After logging in, you can inspect the emails sent by the application, view their content, and debug email-related features.

## Additional Scripts

The `package.json` file includes additional scripts that you can use for various tasks like building, linting, testing, and more:

- `checks`: Run linting, formatting checks, and type checks.
- `format`: Format the source code
