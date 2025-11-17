import { Link } from "react-router-dom";

export default function Groups() {
  return (
    <>
      <section id="create-group">
        <h2>Create New Group</h2>
        <form>
          <input type="text" name="groupName" placeholder="Group name" required />
          <button type="submit">Create Group</button>
        </form>
      </section>

      <section id="public-groups">
        <h2>All Groups</h2>
        <ul>
          <li>Horror Fans <Link to="/group/1">Visit</Link></li>
          <li>Action Movie Lovers <Link to="/group/2">Visit</Link></li>
          <li>Series Junkies <Link to="/group/3">Visit</Link></li>
        </ul>
      </section>

      <section id="your-groups">
        <h2>Your Groups</h2>
        <ul>
          <li>Horror Fans <Link to="/group/1">Open</Link></li>
        </ul>
      </section>
    </>
  );
}
