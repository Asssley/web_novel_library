const deleteLastChapterForm = document.getElementById("delete-last-chapter-form");

deleteLastChapterForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const confirmed = confirm("Are you sure want to delete last chapter?");

  if (!confirmed) return;

  try {
    const novelId = window.location.pathname.split("/").pop();

    const res = await fetch(`/api/novels/${novelId}/chapters/delete-last`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete chapter");
    }

    window.location.reload();

  } catch (err) {
    alert(err.message);
  }
});