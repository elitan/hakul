import { createClient } from "urql";

export const client = createClient({
  url: "http://localhost:1337/v1/graphql",
});
