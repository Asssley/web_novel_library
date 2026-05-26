const form = document.getElementById("novelForm");
const errorBox = document.getElementById("errorBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorBox.classList.add("hidden");

  const formData = new FormData(form);

  formData.delete("genres");

  document
    .querySelectorAll('input[name="genres"]:checked')
    .forEach(el => {
      formData.append("genres", el.value);
    });
    
  const isEdit = window.location.pathname.includes("/edit");

  const url = isEdit
    ? window.location.pathname
    : "/novels";

  const method = isEdit ? "PATCH" : "POST";

  try {
    const res = await fetch(url, {
      method,
      body: formData
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Error");

    console.log(data)

    window.location.href = `/novels/my/${data.id}`;

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
});