import { useEffect, useState } from "react";

export default function Shop() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/shop", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(res => res.json())
      .then(data => setItems(data.items))
      .catch(err => console.error(err));
  }, []);

  const buy = async (itemId) => {
    const res = await fetch(`http://localhost:5000/shop/buy/${itemId}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    alert("Item purchased!");
    setItems(items.filter(i => i.id !== itemId));
  };

  return (
    <div>
      <h2>Shop</h2>

      <div className="shop-grid">
        {items.map(item => (
          <div key={item.id} className="shop-card">
            <img src={item.image_url} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.price} credits</p>
            <button onClick={() => buy(item.id)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
