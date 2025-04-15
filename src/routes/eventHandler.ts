import { EventPayload } from "@vyro-x/app-events";
import { Handler } from "express";
import { gql } from "graphql-request";
import { graphqlClient } from "../clients/graphql-api/client";
import {
  GetMomentQuery,
  GetMomentQueryVariables,
  Moments,
} from "../types/graphql";

/**
 * This endpoint is part of the Listening to Events Guide
 * @see [README.md](../../README.md)
 */
export const eventHandler: Handler = async (req, res, next) => {
  try {
    /**
     * === Event Payload Type ===
     * The `Moments` type is auto-generated from the Vyro GraphQL schema.
     * To regenerate types, run:
     *   - `npm run codegen`
     *   - or `yarn codegen`
     *   - or `pnpm codegen`
     */
    const event = req.body as EventPayload<Moments>;

    /**
     * === Understanding Event Payload ===
     * The event contains:
     *   - `event.data.old`: the previous state (empty for INSERT)
     *   - `event.data.new`: the new state (current data)
     *   - `event.operation`: the action type (INSERT, UPDATE, DELETE)
     */
    const payload = event.data.new;

    /**
     * === Fetching Related Data ===
     * The event payload includes only top-level fields of the `moment`.
     * To fetch related entities (e.g., notes, vehicles), query them here.
     *
     * The example below fetches the full `moment` record, including:
     *   - notes (linked via foreign key)
     *   - stocked vehicle data
     *
     * You can uncomment the `user` field in the query and regenerate types
     * to include it in the response (`codegen` required).
     */
    const momentResponse = await graphqlClient.request<
      GetMomentQuery,
      GetMomentQueryVariables
    >(
      gql`
        query GetMoment($id: uuid!) {
          moments_by_pk(id: $id) {
            id
            notes {
              id
              content
              created_at
            }
            stocked_vehicle {
              id
              vin
              stock_id
              production_year
              make
              model
              badge
              series
            }
            # Example: Uncomment to include user details and regenerate types
            # user {
            #   id
            #   first_name
            #   last_name
            # }
          }
        }
      `,
      { id: payload.id }
    );

    const moment = momentResponse.moments_by_pk;

    if (!moment) {
      throw new Error("Moment not found");
    }

    /**
     * === Do Something With the Fetched Data ===
     * At this point, you can:
     *   - Send data to a downstream API
     *   - Trigger another event
     *   - Write to logs, etc.
     */

    res.sendStatus(200);
    console.log("Event processed successfully:", {
      event,
    });
  } catch (error) {
    // Forwards to the global error handler defined in app.ts
    next(error);
  }
};
