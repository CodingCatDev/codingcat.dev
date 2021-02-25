export default function UserProfile() {
  return (
    <section className="grid gap-4">
      <section className="grid gap-4 p-4 rounded-md bg-primary-900 text-basics-50">
        <h2 className="font-sans text-2xl">User</h2>
        <form className="grid gap-4">
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" placeholder="name of user" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="email of user" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" placeholder="username" />
          </div>
        </form>
      </section>
      <section className="grid gap-4 p-4 rounded-md bg-primary-900 text-basics-50">
        <h2 className="font-sans text-2xl">Basic Info</h2>
        <form className="grid gap-4">
          <div className="grid gap-1">
            <label htmlFor="location">Location</label>
            <input id="location" type="text" placeholder="location" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="about">About You</label>
            <input id="about" type="text" placeholder="about you" />
          </div>
          <div className="grid gap-1">
            <label htmlFor="website">Website</label>
            <input id="website" type="text" placeholder="website" />
          </div>
        </form>
      </section>
    </section>
  );
}
