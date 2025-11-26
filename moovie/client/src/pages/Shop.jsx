import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // 🔥 So we can access user.credits
import "../styles/Shop.css";

export default function Shop() {
  const { user } = useAuth(); // 🔥 Access logged in user
  const [items, setItems] = useState([]);
  const [icons, setIcons] = useState([]);
  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("http://localhost:5000/shop", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        const data = await res.json();

        const shopItems = data.items || [];
        setItems(shopItems);
        setIcons(shopItems.filter((i) => i.type === "icon"));
        setAccessories(shopItems.filter((i) => i.type === "accessory"));
      } catch (err) {
        console.error("Failed to fetch shop items:", err);
      }
    }

    fetchItems();
  }, []);

  const { refreshUserData } = useAuth();

  const buy = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/shop/buy/${itemId}`, {
        method: "POST",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      alert("Item purchased!");
      await refreshUserData();

      // Refresh visible items
      setItems(items.filter((i) => i.id !== itemId));
      setIcons(icons.filter((i) => i.id !== itemId));
      setAccessories(accessories.filter((i) => i.id !== itemId));
    } catch (err) {
      console.error("Purchase error:", err);
    }
  };

  

  return (
    <div className="shop-page">
      {/* 💰 Show Credits */}
      <div className="credits-box">
        <strong>Credits:</strong> {user?.credits}
      </div>

      <h2>Shop</h2>

      {/* 🧍 ICONS SECTION */}
      <div className="shop-category-box">
        <h3>Icons</h3>
        <div className="shop-grid">
          {icons.length === 0 ? (
            <p>No icons available</p>
          ) : (
            icons.map((item) => (
              <div key={item.id} className="shop-card">
                <img src={item.image_url} alt={item.name} className="shop-item-image" />
                <h4>{item.name}</h4>
                <p>{item.price} credits</p>
                <button onClick={() => buy(item.id)}>Buy</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🎩 ACCESSORIES SECTION */}
      <div className="shop-category-box">
        <h3>Accessories</h3>
        <div className="shop-grid">
          {accessories.length === 0 ? (
            <p>No accessories available</p>
          ) : (
            accessories.map((item) => (
              <div key={item.id} className="shop-card">
                <img src={item.image_url} alt={item.name} className="shop-item-image" />
                <h4>{item.name}</h4>
                <p>{item.price} credits</p>
                <button onClick={() => buy(item.id)}>Buy</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
