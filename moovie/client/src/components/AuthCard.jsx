import "./AuthCard.css";

export default function AuthCard({ children, cowImage }) {
  return (
    <div className="auth-wrapper">
  <img src={cowImage} alt="Cow" className="cow-img" />

  <div className="cow-bottom-line"></div>

  <div className="auth-card">
    {children}
  </div>
</div>
  );
}
