const deleteNovelForm = document.getElementById("deleteNovelForm");

deleteNovelForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const confirmed = confirm("Are you sure you want to delete this novel?");

  if (!confirmed) return;

  try {
    const novelId = window.location.pathname.split("/").pop();

    const res = await fetch(`/novels/${novelId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete novel");
    }

    window.location.href = "/novels/my";

  } catch (err) {
    alert(err.message);
  }
});