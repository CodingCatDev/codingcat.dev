export default function UserProfile() {
  return (
    <section className="grid gap-4">
      <section className="grid gap-4 p-4 rounded-md bg-primary-900 text-basics-050">
        <h2 className="font-sans text-2xl">User</h2>
        <form className="grid gap-4">
          <label htmlFor="name">
            Name
            <input id="name" type="text" placeholder="name of user" />
          </label>
          <label htmlFor="email">
            Email
            <input id="email" type="email" placeholder="email of user" />
          </label>
          <label htmlFor="username">
            Username
            <input id="username" type="text" placeholder="username" />
          </label>
        </form>
      </section>
      <section className="grid gap-4 p-4 rounded-md bg-primary-900 text-basics-050">
        <h2 className="font-sans text-2xl">Basic Info</h2>
        <form className="grid gap-4">
          <label htmlFor="location">
            Location
            <input id="location" type="text" placeholder="location" />
          </label>
          <label htmlFor="about">
            About You
            <input id="about" type="text" placeholder="about you" />
          </label>
          <label htmlFor="website">
            Website
            <input id="website" type="text" placeholder="website" />
          </label>
        </form>
      </section>
    </section>
  );
}
