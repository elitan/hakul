import { DocumentNode } from "graphql";
import { AnyVariables, useMutation as useUrqlMutation } from "urql";

type MutationResult<TData> = {
  mutate: (variables?: AnyVariables) => Promise<void>;
  data: TData | undefined;
  error: any;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  status: "idle" | "loading" | "error" | "success";
};

export function useMutation<TData>(
  mutation: string | DocumentNode
): MutationResult<TData> {
  const [result, executeMutation] = useUrqlMutation<TData>(mutation);

  const mutate = async (variables?: AnyVariables) => {
    executeMutation(variables);
  };

  const status = result.fetching
    ? "loading"
    : result.error
    ? "error"
    : "success";

  return {
    mutate,
    data: result.data,
    isLoading: result.fetching,
    isError: !!result.error,
    error: result.error,
    isSuccess: !result.fetching && !result.error,
    status,
  };
}
