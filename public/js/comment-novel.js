const form = document.getElementById("commentForm");


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novelId = window.location.pathname.split("/")[2];

  const text = form.text.value;

  try {
    const res = await fetch(`/api/novels/${novelId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error("Failed to add comment");

    window.location.reload();
  } catch (err) {
    alert(err.message);
  }
});


// DELETE COMMENT
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".delete-comment-btn");
  if (!btn) return;

  const confirmed = confirm("Delete this comment?");
  if (!confirmed) return;

  const novelId = window.location.pathname.split("/")[2];

  const commentCard = btn.closest(".comment-card");
  const commentId = commentCard.dataset.id;

  try {
    const res = await fetch(
      `/api/novels/${novelId}/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) throw new Error("Failed to delete comment");

    commentCard.remove();
  } catch (err) {
    alert(err.message);
  }
});