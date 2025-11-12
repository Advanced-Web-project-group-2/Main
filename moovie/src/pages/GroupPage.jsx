
import React from "react";
import { Link } from "react-router-dom";

export default function GroupPage() {
  return (
    <div>
      <header>
        <h1>Group Page</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/in-cinemas">In Cinemas</Link></li>
            <li><Link to="/advanced-search">Advanced Search</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        {/* If user is not a member, can join a group */}
        <section id="join-group">
          <h2>Join this group</h2>
          <form>
            <button type="submit">Send Join Request</button>
          </form>
          <p>Status: <strong>Pending</strong></p>
        </section>

        {/* Only visible to group members */}
        <section id="group-content">
          <h2>Group Content</h2>

          {/* List of members, only admin can remove a member */}
          <section id="members">
            <h3>Members</h3>
            <ul>
              <li>Group Members</li>
              <li>User123 <button>Remove</button></li>
              <li>MovieFan <button>Remove</button></li>
            </ul>
          </section>

          {/* Join requests, only visible to Admin */}
          <section id="join-requests">
            <h3>Join Requests</h3>
            <ul>
              <li>
                UserNotInGroup 
                <button>Approve</button> 
                <button>Reject</button>
              </li>
            </ul>
          </section>

          {/* List of movies, added to the group, comes from API */}
          <section id="group-movies">
            <h3>Movies Added by Members</h3>
            <ul>
              <li>It</li>
              <li>Interstellar</li>
            </ul>
          </section>

          {/* Add a movie to the group */}
          <section id="add-movie">
            <h3>Add a Movie to this Group</h3>
            <form>
              <input type="text" name="movieName" placeholder="Search movie by name" />
              <button type="submit">Add Movie</button>
            </form>
          </section>

          {/* Leave the group */}
          <section id="leave-group">
            <form>
              <button type="submit">Leave Group</button>
            </form>
          </section>

          {/* Delete a group, Admin only */}
          <section id="delete-group">
            <form>
              <button type="submit">Delete Group</button>
            </form>
          </section>
        </section>
      </main>

      <footer>
        <p>2025 Moo-viestar</p>
      </footer>
    </div>
  );
}



