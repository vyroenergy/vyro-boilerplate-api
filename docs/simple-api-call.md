# Making a Simple API Call Guide

## Install

If you haven't already, install the dependencies:

```bash
pnpm install
```

_If you see an error along the lines of "pnpm: command not found", make sure you have pnpm installed globally. You can do this with `npm install -g pnpm`._

## Start the server

To start the server, run:

```bash
pnpm start
```

This will start the server on port 4000.

## Building an Endpoint

Checkout the file located at [../src/routes/reportHandler.ts](../src/routes/reportHandler.ts).

This file contains the code that handles the API call to Vyro.

## Trigger the Endpoint

To trigger the endpoint, you can use a tool like [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or just open your browser and navigate to:

```
http://localhost:4000/report
```

You should see a JSON response with data pertaining your Vyro account's page views, etc.

## Extending the Endpoint

You can extend the endpoint to include more data by modifying the `reportHandler.ts` file.

For example, you can add more fields to the `data` object that is returned in the response.

Try adding the below to the query:

```graphql
query GetMetrics($from: timestamptz!, $to: timestamptz!) {
  # ...

  stocked_vehicles(limit: 1) {
    id
    make
  }
}
```

This will return the first stocked vehicle in your Vyro account.

Checkout the [Vyro GraphiQL Playground](https://graphiql.vyro.co/) for more data models that you can query.

## Next Steps

Now that you have a basic understanding of how to make an API call to Vyro, you can start [listening to events](./listening-to-events.md).
