import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  id: string;
  name: string;
  content: string;
};
export const loader: LoaderFunction = async ({ params }) => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  const { id, name, content } = randomJoke;
  return {
    id,
    name,
    content,
  };
};
export default function JokesIndexRoute() {
  const joke = useLoaderData<LoaderData>();
  console.log("inside", joke);
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{joke.content}</p>
      <Link to={joke.id}>"{joke.name}" Permalink</Link>
    </div>
  );
}
