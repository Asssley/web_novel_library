// Save novel
const saveBtn = document.getElementById("save-btn");
const saveBtnLabel = document.getElementById("save-btn-label");

saveBtn.onclick = async (e) => {
  const novelId = saveBtn.dataset.novelId;
  try {
    if (saveBtn.classList.contains("save-btn-saved")) {
      const res = await fetch(`/api/saved/${novelId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();
      if (res.ok) {
        saveBtn.classList.remove("save-btn-saved");
        saveBtnLabel.innerHTML = "Save";
      }

    } else {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ novelId })
      });

      const result = await res.json();
      if (res.ok) {
        saveBtn.classList.add("save-btn-saved");
        saveBtnLabel.innerHTML = "Saved";
      }
    }
  } catch (err) { }
};

