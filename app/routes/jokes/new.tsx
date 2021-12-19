import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useCatch,
} from "remix";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return {};
};

function validateFieldLength(
  fieldLength: number,
  minLength: number,
  maxLength: number
) {
  if (fieldLength < minLength)
    return `must have length greater than ${minLength}`;
  if (fieldLength > maxLength) return `must have length less than ${maxLength}`;
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name?: string;
    content?: string;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const nameLength = `${name}`.length;
  const content = form.get("content");
  const contentLength = `${content}`.length;

  if (typeof name !== "string" || typeof content !== "string") {
    return badRequest({
      formError: "Invalid form field input type.",
    });
  }

  const fieldErrors = {
    name: validateFieldLength(nameLength, 3, 15),
    content: validateFieldLength(contentLength, 10, 100),
  };

  const fields = { name, content };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });

  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<ActionData>();
  const defaultName = actionData?.fields?.name;
  const defaultContent = actionData?.fields?.content;
  const nameError = actionData?.fieldErrors?.name;
  const contentError = actionData?.fieldErrors?.content;

  return (
    <>
      <div>
        <form method="post">
          <div>
            <label htmlFor="name">
              Name:{" "}
              <input
                defaultValue={defaultName}
                type="text"
                name="name"
                id="name"
              />
              {nameError && (
                <p className="form-validation-error">{nameError}</p>
              )}
            </label>
          </div>
          <div>
            <label htmlFor="content">
              Content:{" "}
              <textarea
                defaultValue={defaultContent}
                name="content"
                id="content"
              />
              {contentError && (
                <p className="form-validation-error">{contentError}</p>
              )}
            </label>
          </div>
          <div>
            <button className="button" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
