const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      console.error("Logout failed");
    }

  } catch (err) {
    console.error("Server error", err);
  }
});