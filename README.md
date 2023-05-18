# Developer Statistics

The Developer Statistics Service collects, processes, and delivers detailed statistical data related to developer activities.

# Development

## Prerequisites

You should have [Node](https://nodejs.org/en/) and [Docker](https://www.docker.com/) installed.

## Initializing env vars for local development

```shell
cp .env.example .env
```
Then fill in the values in `.env`.

## Setting up the local database

Start Postgres in docker:

```shell
docker run --name stats-db -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgrespw -e POSTGRES_DB=stats-db -d postgres
```

Run the db migrations:

```shell
pnpm migrate up
```

## Install dependencies

```shell
pnpm install
```

Generate prisma client:

```shell
pnpm prisma generate
```

## Run data collection jobs

Data collection jobs will run the following:
1) Fetch TOML file from .env `EC_TOML_FILE_URL`, process its contents and store in the database.
2) Fetch and store repositories for organizations.
3) Fetch and store contribution data for repositories.
4) Schedule the next run of the data collection jobs.

```shell
pnpm schedule:dev
```

## Start server

```shell
pnpm serve:dev
```

This will expose the endpoints:
- `/code/:interval (weekly | monthly)`
- `/devs/:interval (weekly | monthly)`

## Build

```shell
pnpm build
```
