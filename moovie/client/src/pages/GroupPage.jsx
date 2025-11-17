import React from "react";
import { useParams } from "react-router-dom";

export default function GroupPage() {
  const { groupId } = useParams();

  return (
    <>
      <section id="join-group">
        <h2>Join this group — {groupId}</h2>
        <button>Send Join Request</button>
        <p>Status: <strong>Pending</strong></p>
      </section>

      <section id="group-content">
        <h2>Group Content</h2>

        <section id="members">
          <h3>Members</h3>
          <ul>
            <li>User123 <button>Remove</button></li>
            <li>MovieFan <button>Remove</button></li>
          </ul>
        </section>

        <section id="join-requests">
          <h3>Join Requests</h3>
          <li>UserNotInGroup <button>Approve</button> <button>Reject</button></li>
        </section>

        <section id="group-movies">
          <h3>Movies Added by Members</h3>
          <ul><li>It</li><li>Interstellar</li></ul>
        </section>
      </section>
    </>
  );
}
