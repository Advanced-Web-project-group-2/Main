export default function Profile() {
  const username = localStorage.getItem("username");

  if (!username) return <p>Please log in to view your profile.</p>;

  return (
    <section id="profile-content">
      <h2>{username}</h2>
      <p>Your user profile will go here.</p>
    </section>
  );
}
