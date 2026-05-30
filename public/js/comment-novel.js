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


// LIKES AND DISLIKES
document.addEventListener("click", async (e) => {
  const likeBtn = e.target.closest(".like-btn");
  const dislikeBtn = e.target.closest(".dislike-btn");

  if (!likeBtn && !dislikeBtn) return;

  const btn = likeBtn || dislikeBtn;
  const commentId = btn.dataset.id;

  const rate = Boolean(likeBtn);
  const novelId = window.location.pathname.split("/")[2];

  const res = await fetch(`/api/novels/${novelId}/comments/${commentId}/rate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ rate })
  });

  const data = await res.json();

  console.log(data)
  if (!data.success) return;

  window.location.reload();
});
