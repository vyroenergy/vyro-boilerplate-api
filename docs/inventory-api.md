# Making a call to the Inventory API

> The Inventory API is a purpose-built API designed to handle incredibly high throughput and low latency. It is a write-only API that allows you to upload inventory data in batches.

## Install

If you haven't already, install the dependencies:

```bash
pnpm install
```

_If you see an error along the lines of "pnpm: command not found", make sure you have pnpm installed globally. You can do this with `npm install -g pnpm`._

## The Endpoint

Checkout the file located at [../src/routes/inventoryHandler.ts](../src/routes/inventoryHandler.ts).

This file contains the code that handles the API call to Vyro.

The endpoint uses the @vyro-x/inventory-api-client package to make the API call.

## Your Showroom Code

Update the below line with your Showroom Code:

```typescript
const SHOWROOM_CODE = "[My Showroom Code]";
```

You can find your Showroom Code in the [Vyro Dashboard](https://dashboard.vyrolabs-staging.net) by looking at the URL. It should look something like this:

```
/showrooms/[showroomCode]/xyz
```

## Trigger the Endpoint

To trigger the endpoint, you can use a tool like [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or using a simple curl command.

```
curl -X POST http://localhost:4000/inventory
```

You should see a JSON response with data containing a link to your Dashboard Inventory page where you can see the data you just uploaded.

Note, processing is asynchronous, so it may take a few minutes for the data to appear in your dashboard.

## Extending the Endpoint

You can extend the endpoint to upload multiple vehicles at once. To do this, you can modify the `items` object in the API call to have two or more vehicles.

Alternatively, you can also modify the `items` object to include more fields for each vehicle. The API is heavily typed and self-documenting, so you can easily see what fields are available. For example, try adding a VIN or description to the vehicle object.

**Note:**

- The `items` object is an array of vehicles.
- Each vehicle contains a `source_id`. This is a unique identifier for the vehicle.
- Subsequent calls to the API with the same `source_id` will update the vehicle in Vyro.
- Each vehicle also contains a `showroom_ids` array. In Vyro, a "Showroom" is an account and this array is indicating which showroom(s) the vehicle belongs to.
