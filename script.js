document.querySelector("#film-form").addEventListener("submit", handleFormSubmit);
document.querySelector("#delete-all").addEventListener("click", handleDeleteAll);
["#filter-title", "#filter-genre", "#filter-year", "#filter-watched"].forEach(selector => {
  document.querySelector(selector).addEventListener("input", renderTable);
});
document.querySelector("#film-tbody").addEventListener("click", handleDeleteOne);

async function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.querySelector("#title").value.trim();
  const genre = document.querySelector("#genre").value.trim();
  const releaseYear = document.querySelector("#releaseYear").value.trim();
  const isWatched = document.querySelector("#isWatched").checked;

  if (!title || !genre || !releaseYear) {
    alert("Пожалуйста, заполните все поля.");
    return;
  }

  const film = { title, genre, releaseYear, isWatched };
  await addFilm(film);
  document.querySelector("#film-form").reset();
}

async function addFilm(film) {
  await fetch("https://sb-film.skillbox.cc/films", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      email: "ovikdevil@gmail.com",
    },
    body: JSON.stringify(film),
  });
  renderTable();
}

async function handleDeleteAll() {
  if (confirm("Удалить все фильмы?")) {
    await fetch("https://sb-film.skillbox.cc/films", {
      method: "DELETE",
      headers: { email: "ovikdevil@gmail.com" },
    });
    renderTable();
  }
}

async function handleDeleteOne(e) {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");
    await fetch(`https://sb-film.skillbox.cc/films/${id}`, {
      method: "DELETE",
      headers: { email: "ovikdevil@gmail.com" },
    });
    renderTable();
  }
}

async function renderTable() {
  const title = document.querySelector("#filter-title").value.trim();
  const genre = document.querySelector("#filter-genre").value.trim();
  const releaseYear = document.querySelector("#filter-year").value.trim();
  const isWatched = document.querySelector("#filter-watched").value;

  const queryParams = new URLSearchParams();
  if (title) queryParams.append("title", title);
  if (genre) queryParams.append("genre", genre);
  if (releaseYear) queryParams.append("releaseYear", releaseYear);
  if (isWatched) queryParams.append("isWatched", isWatched);

  const filmsResponse = await fetch(`https://sb-film.skillbox.cc/films?${queryParams.toString()}`, {
    headers: { email: "ovikdevil@gmail.com" },
  });
  const films = await filmsResponse.json();

  const filmTableBody = document.querySelector("#film-tbody");
  filmTableBody.innerHTML = "";

  films.forEach((film) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${film.title}</td>
      <td>${film.genre}</td>
      <td>${film.releaseYear}</td>
      <td>${film.isWatched ? "Да" : "Нет"}</td>
      <td><button data-id="${film.id}" class="delete-btn">Удалить</button></td>
    `;
    filmTableBody.appendChild(row);
  });
}

renderTable();
