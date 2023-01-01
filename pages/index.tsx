import type { NextPage } from "next";
import { useState } from "react";
import { useMutation } from "../components/useMutation";
import { useQuery } from "../components/useQuery";

const GET_TODOS_QUERY = `#graphql
  query {
    todos {
      id
      title
    }
  }
`;

const INSERT_TODO_MUTATION = `#graphql

mutation InsertTodo($title: String!) {
  insert_todos_one(object: {title: $title}) {
    id
    title
  }
}
`;

const Todos = () => {
  console.log("todos");

  const { data, isLoading, isError, error } = useQuery({
    query: GET_TODOS_QUERY,
    context: {
      headers: {
        "x-hejsan": "lol",
      },
    },
  });

  if (isLoading && !data) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Oh no... {error.message}</p>;
  }

  if (!data) {
    return <p>No data</p>;
  }

  const todos = (data as any).todos as any[];

  return (
    <div>
      <ul>
        {todos.map((todo: any) => (
          <li key={todo.id}>{todo.title} 12</li>
        ))}
      </ul>
    </div>
  );
};

function AddTodo() {
  const [title, setTitle] = useState("");

  const { mutate, isLoading, isError, error } =
    useMutation(INSERT_TODO_MUTATION);

  return (
    <div>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => {
          mutate({ title });
        }}
      >
        Add todo {isLoading ? "..." : ""}
      </button>
      {isError && <p>Oh no... {error.message}</p>}
    </div>
  );
}

const Home: NextPage = () => {
  return (
    <div>
      <AddTodo />
      <Todos />
    </div>
  );
};

export default Home;
