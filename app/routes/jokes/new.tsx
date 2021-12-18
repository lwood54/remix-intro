export default function NewJokesRoute() {
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
