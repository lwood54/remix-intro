import { ActionFunction, redirect, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");

  if (typeof name !== "string" || typeof content !== "string") {
    throw new Error(`form fields should be strings`);
  }

  const fields = { name, content };

  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  return (
    <div>
      <form method="post">
        <div>
          <label htmlFor="name">
            Name: <input type="text" name="name" id="name" />
          </label>
        </div>
        <div>
          <label htmlFor="content">
            Content: <textarea name="content" id="content" />
          </label>
        </div>
        <div>
          <button className="button" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
