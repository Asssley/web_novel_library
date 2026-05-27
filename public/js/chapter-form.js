const form = document.getElementById("chapterForm");
const errorBox = document.getElementById("errorBox");

const novelId = window.location.pathname.split("/")[2];
const chapterId = window.location.pathname.split("/")[4];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorBox.classList.add("hidden");

  const payload = {
    title: form.title.value,
    text: form.text.value,
  };

  const isEdit = window.location.pathname.includes("/edit");

  const url = isEdit
    ? `/api/novels/${novelId}/chapters/${chapterId}`
    : `/api/novels/${novelId}/chapters`;

  const method = isEdit ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Error");

    window.location.href = `/novels/my/${novelId}`;

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
});