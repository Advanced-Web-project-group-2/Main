import React from "react";

export default function Shop() {
  const userPoints = 120;

  const shopItems = [
    { id: 1, name: "Emoji Pack", price: 20 },
    { id: 2, name: "Profile Decoration", price: 50 },
    { id: 3, name: "Group Background Theme", price: 75 },
  ];

  return (
    <>
      <section id="user-points">
        <h2>Your Points</h2>
        <p><strong>{userPoints}</strong></p>
      </section>

      <section id="shop-items">
        <h2>Available Items</h2>

        <ul>
          {shopItems.map((item) => (
            <li key={item.id}>
              <h3>{item.name}</h3>
              <p>Price: {item.price}</p>
              <button>Buy</button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
