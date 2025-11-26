// load images from src/assets/backgrounds using Vite
const images = import.meta.glob("/src/assets/backgrounds/*.{jpg,jpeg,png}", { 
  eager: true, 
  query: "?url", 
  import: "default" 
});

const normalizedMap = {};
for (const filePath in images) {
  const name = filePath.split("/").pop().split(".")[0].toLowerCase();
  normalizedMap[name] = images[filePath];
}

export const getBackgroundByGenre = (genreName) => {
  if (!genreName) return null;
  const key = genreName.toLowerCase().replace(/\s+/g, "");
  const result = normalizedMap[key] || null; 
  console.log(`getBackgroundByGenre("${genreName}") ->`, result); 
  return result;
};
