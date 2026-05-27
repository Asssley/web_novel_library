const form = document.getElementById("novelForm");
const errorBox = document.getElementById("errorBox");
const novelId = window.location.pathname.split("/")[2];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorBox.classList.add("hidden");

  const formData = new FormData();

  // TEXT FIELDS
  formData.append("title", form.title.value);
  formData.append("description", form.description.value);
  formData.append("language", form.language.value);

  // GENRES
  document
    .querySelectorAll('input[name="genres"]:checked')
    .forEach(el => {
      formData.append("genres", el.value);
    });

  // IMAGE (ONLY IF SELECTED)
  const fileInput = form.querySelector('input[name="image"]');

  if (fileInput.files && fileInput.files.length > 0) {
    formData.append("image", fileInput.files[0]);
  }
  
  const isEdit = window.location.pathname.includes("/edit");

  const url = isEdit
    ? `/novels/${novelId}`
    : "/novels";

  const method = isEdit ? "PUT" : "POST";

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