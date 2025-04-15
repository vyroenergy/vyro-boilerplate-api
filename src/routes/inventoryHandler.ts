import {
  AssetPlacement,
  AssetType,
  BasicPricing,
  Vehicle,
} from "@vyro-x/inventory-api-client/lib/client";
import { Handler } from "express";
import { gql } from "graphql-request";
import { graphqlClient } from "../clients/graphql-api/client";
import { inventoryApi } from "../clients/inventoryApi";
import {
  GetShowroomIdQuery,
  GetShowroomIdQueryVariables,
} from "../types/graphql";

/**
 * This endpoint is part of the Making a call to the Inventory API guide
 * @see [README.md](../../README.md)
 */
export const inventoryHandler: Handler = async (req, res, next) => {
  // Replace [My Showroom Code] with your showroom code
  // You can find your showroom code in the [Vyro dashboard](https://dashboard.vyrolabs-staging.net)
  // Go to the showroom settings page and copy the code from the URL
  // For example, if the URL is /showrooms/12345/...
  // Then your showroom code is 12345
  const SHOWROOM_CODE = "[My Showroom Code]";

  try {
    const showroomId = await getShowroomId(SHOWROOM_CODE);

    const response = await inventoryApi.default.createBatch({
      items: [
        {
          showroom_ids: [showroomId],
          vehicle: {
            // A unique identifier for the vehicle
            // This is used to identify the vehicle in the inventory
            // Subsequent calls to createBatch with the same source_id will update the vehicle
            source_id: `boilerplate`,
            production_year: new Date().getFullYear().toString(),
            make: "Futuro",
            model: "Excite",
            badge: "Unlimited",
            series: null,
            estimated_delivery_delay: 14, // Delivery within 14 days
            colour: "Black",
            pricing: {
              type: BasicPricing.type.BASIC,
              currency: BasicPricing.currency.EUR,
              // 50,000.00 EUR
              // All prices are stored in the lowest denomination of the currency
              // For EUR, this is cents, so 50,000.00 EUR = 50_000_00 cents
              // For USD, this would be 50,000.00 USD = 50_000_00 cents
              // For GBP, this would be 50,000.00 GBP = 50_000_00 pence
              price: 50_000_00,
            },
            odometer: 0, // Odometer in kilometers
            condition: Vehicle.condition.NEW,

            // Show the vehicle in the listing pages
            is_listed: true,

            // Create a public page for the listing
            is_published: true,

            // Mark the vehcicle as sold/not-sold
            is_sold: false,
          },
          assets: [
            {
              src: "https://ik.imagekit.io/vyro/7247da72-c918-4dcd-8648-633c1feac41b_xVYR5sEGF.png?tr=w-2500",
              alt: "Futuro Excite Front Side-on",
              type: AssetType.IMAGE,
              placement: AssetPlacement.FEATURED,
            },
          ],
        },
      ],
      moderate_images: false,
      moderate_content: false,
    });

    res.status(201).json({
      message:
        "Success. Processing typically takes a few minutes. Visit the Vyro Dashboard > Inventory to see the status.",
      dashboard_url: `https://dashboard.vyrolabs-staging.net/showrooms/${SHOWROOM_CODE}/inventory`,
      data: response,
    });
  } catch (error) {
    // Forward any errors to the global error handler in app.ts
    next(error);
  }
};

const getShowroomId = async (showroomCode: string) => {
  const response = await graphqlClient.request<
    GetShowroomIdQuery,
    GetShowroomIdQueryVariables
  >(
    gql`
      query GetShowroomId($code: String!) {
        showrooms(where: { code: { _eq: $code } }) {
          id
        }
      }
    `,
    { code: showroomCode }
  );

  if (response.showrooms.length === 0) {
    throw new Error(`Showroom with code ${showroomCode} not found`);
  }

  return response.showrooms[0].id;
};
