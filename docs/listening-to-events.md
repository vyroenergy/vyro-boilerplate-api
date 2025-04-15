# Listening to Events

## Create an App

To listen to a Vyro event, you need to create an app using the Vyro App CLI and install it in your Vyro showroom.

## Knowing your Showroom Code

You'll need to know your Showroom Code to do this. You can find it in the [Vyro Dashboard](https://dashboard.vyrolabs-staging.net) by looking at the URL. It should look something like this:

```
/showrooms/[showroomCode]/xyz
```

## Initialise App Config

```bash
npx @vyro-x/app-cli@latest init [Insert App Name]
```

Replace the `[Insert App Name]` with a unique name of your app.

App Codes must be globally unique, lowercase, and can only contain letters, numbers, and hyphens. For example, `my-awesome-app` is a valid app code, while `My Awesome App!` is not.

## Publish your App

In the previous step we created a file called `vyro.config.yml`. This file contains the configuration for your app. The default config is perfect for testing, but you can modify it in the future to suit your needs.

To publish your app, run the following command:

```bash
npx @vyro-x/app-cli@latest publish vyro.config.yml
```

## Install your App

```bash
npx @vyro-x/app-cli@latest install vyro.config.yml --showroom-code "<showroom-code>"
```

Replace `<showroom-code>` with your showroom code.

## Listen to Events

```bash
npx @vyro-x/app-cli@latest listen vyro.config.yml --to "http://localhost:4000/events/enquiry-created"
```

This command will open a tunnel to your local network and listen to events from Vyro.

Your terminal should print something like:

```bash
Tunneling tester events to https://red-places-see.loca.lt/events/enquiry-created for 24 hours.
```

## Trigger an Event

To trigger an event, head to your [Vyro Dashboard](https://dashboard.vyrolabs-staging.net/) > Enquiries, then Update or Create an Enquiry.

The event will be sent to your local server within a few seconds.

Your terminal should print something like:

```bash
Received Event { method: 'POST', path: '/events/enquiry-created' }
```

## Next Steps

- Try listening to additional events, on the following entities: 'vehicle_orders', 'users'.
- You'll need to update your `vyro.config.yml` file to include the new events, bump the app version (in the config file), then publish the app and listen again.
