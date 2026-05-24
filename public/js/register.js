const form = document.getElementById("registerForm");
const errorBox = document.getElementById("errorBox");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorBox.textContent = "";

  const formData = new FormData(form);

  const data = {
    nickname: formData.get("nickname"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      errorBox.textContent = getErrorMessage(result.message);
      return;
    }

    window.location.href = "/";
  } catch (err) {
    errorBox.textContent = "Server error, try again later.";
  }
});


function getErrorMessage(message) {
  if (typeof message === "string") return message.charAt(0).toUpperCase() + message.slice(1).toLowerCase();
  if (Array.isArray(message)) return message[0].charAt(0).toUpperCase() + message[0].slice(1).toLowerCase();
  if (message?.message) return getErrorMessage(message.message);
  return "Login failed";
}