// Sample movie cards
const movies = [
  { title: "Inception", img: "https://i.imgur.com/Yo5jJ8k.jpeg" },
  { title: "Interstellar", img: "https://i.imgur.com/4n8xqdY.jpeg" },
  { title: "Gravity", img: "https://i.imgur.com/4GVtC2K.jpeg" },
  { title: "Ad Astra", img: "https://i.imgur.com/Fx0qG3s.jpeg" },
  { title: "The Martian", img: "https://i.imgur.com/hpRoFHF.jpeg" },
];

const row = document.getElementById("movie-row");

movies.forEach((movie) => {
  const card = document.createElement("div");
  card.className = "movie-card";
  card.innerHTML = `<img src="${movie.img}" alt="${movie.title}" />`;
  row.appendChild(card);
});
