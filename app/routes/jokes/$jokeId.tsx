import { Joke } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

// type LoaderData = { joke: Joke };
type LoaderData = {
  name: string;
  content: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });

  if (joke) {
    const data: LoaderData = {
      name: joke.name,
      content: joke.content,
    };
    return data;
  }
};
export default function JokeRoute() {
  const joke = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <p>{joke.name}</p>
      <Link to=".">{joke.name} Permalink</Link>
    </div>
  );
}
