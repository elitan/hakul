// https://tanstack.com/query/v4/docs/react/reference/useQuery

import { DocumentNode } from "graphql";
import { useEffect, useRef, useState } from "react";
import { AnyVariables, OperationContext, useQuery as useURQLQuery } from "urql";

export function useQuery(args: {
  query: string | DocumentNode;
  variables?: AnyVariables;
  enabled?: boolean;
  refetchInterval?: number;
  context?: {
    url?: string;
    headers?: {
      [key: string]: string;
    };
  };
}): {
  data: any;
  isLoading: boolean;
  isError: boolean;
  error?: any;
  isSuccess: boolean;
  status: "loading" | "error" | "success";
  refetch: () => void;
} {
  const { query, variables, refetchInterval, enabled = true, context } = args;

  // @ts-ignore
  let urqlContextGenerated: OperationContext = {};

  if (context) {
    if (context.headers) {
      urqlContextGenerated.fetchOptions = {
        headers: {
          ...context.headers,
        },
      };
    }

    if (context.url) {
      try {
        new URL(context.url);
        urqlContextGenerated.url = context.url;
      } catch (error) {
        console.error(`Invalid URL: ${context.url}`);
        throw new Error(`Invalid URL: ${context.url}`);
      }
    }
  }

  // used to not re-render the component when the context changes
  const [urqlContext] = useState(urqlContextGenerated);
  const intervalId = useRef<number | undefined>(undefined);

  const [result, refetch] = useURQLQuery({
    query,
    variables,
    context: urqlContext,
    pause: !enabled,
  });

  console.log("result", result);

  useEffect(() => {
    console.log("useEffect");

    if (enabled && refetchInterval) {
      intervalId.current = window.setInterval(() => {
        refetch({ requestPolicy: "network-only" });
      }, refetchInterval);
    }

    return () => {
      if (intervalId.current) {
        window.clearInterval(intervalId.current);
      }
    };
  }, [enabled, refetchInterval, refetch]);

  const status = result.fetching
    ? "loading"
    : result.error
    ? "error"
    : "success";

  return {
    data: result.data,
    isLoading: result.fetching,
    isError: !!result.error,
    error: result.error,
    isSuccess: !result.fetching && !result.error,
    status,
    refetch,
  };
}
