# CityLinkConnect

CityLink Connect is a local government web app written in Vue and Express.

## Setup

The minimum node version for this project is v23.6.0.

This project comes with configurations and extension recommendations for [VSCode](https://code.visualstudio.com/).

To install the requisite dependencies, run:

```sh
npm install
```

## Development

For development it is recommended to use the Vite dev server.
The dev server has been configured to load the backend middleware,
and needs no extra setup. Simply run:

```sh
npm run dev
```

Linting and formatting are done with ESLint and Prettier and can be invoked with the npm scripts `lint` and `format`.

## Deployment

For deployment, this project ships a standalone server which hosts the backend
and the website's static files. The frontend must first be built with Vite:

```sh
npm run build
```

Then the standalone server can be deployed as such:

```sh
NODE_ENV=production npm run prod
```

If a port other than 80 is desired, it can be set with the `PORT` environment variable.
Currently HTTPS is not natively supported, and requires a reverse proxy such as NGINX.
