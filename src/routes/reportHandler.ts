import { Handler } from "express";
import { gql } from "graphql-request";
import { graphqlClient } from "../clients/graphql-api/client";
import { GetMetricsQuery, GetMetricsQueryVariables } from "../types/graphql";
/**
 * This endpoint is part of the Simple API Call Guide
 * @see [README.md](../../README.md)
 */
export const reportHandler: Handler = async (req, res, next) => {
  try {
    const to = new Date();
    const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    /**
     * === GraphQL Aggregate Query ===
     * This request fetches two aggregate metrics:
     *
     * 1. Total number of visitors (`insights_visitors_aggregate`)
     * 2. Total number of page views (`insights_events_aggregate`)
     *
     * Both queries are filtered by `created_at` to only include data
     * from the last 7 days. Page views are further filtered by event type.
     */
    const response = await graphqlClient.request<
      GetMetricsQuery,
      GetMetricsQueryVariables
    >(
      gql`
        query GetMetrics($from: timestamptz!, $to: timestamptz!) {
          # Almost every data model in Vyro supports an aggregation layer,
          # allowing you to perform highly optimised counts, averages, etc.
          insights_visitors_aggregate(
            where: { created_at: { _gte: $from, _lte: $to } }
          ) {
            aggregate {
              count
            }
          }

          insights_events_aggregate(
            where: {
              type: { _eq: page_view }
              created_at: { _gte: $from, _lte: $to }
            }
          ) {
            aggregate {
              count
            }
          }

          stocked_vehicles_aggregate(where: { is_listed: { _eq: true } }) {
            aggregate {
              count
            }
          }
        }
      `,
      { from, to }
    );

    // Extract aggregated counts from the response
    const visitors = response.insights_visitors_aggregate.aggregate.count;
    const pageViews = response.insights_events_aggregate.aggregate.count;
    const inventory = response.stocked_vehicles_aggregate.aggregate.count;

    // Return the metrics
    res.status(200).json({
      message: "Past 7 days of activity",
      visitors,
      pageViews,
      inventory,
    });
  } catch (error) {
    // Forward any errors to the global error handler in app.ts
    next(error);
  }
};
