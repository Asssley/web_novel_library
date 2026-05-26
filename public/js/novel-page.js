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


// Rate novel
const openBtn = document.getElementById('openRatingModal');
const modal = document.getElementById('ratingModal');
const closeBtn = document.getElementById('closeRatingModal');

const stars = document.querySelectorAll('.star-btn');
const successLabel = document.getElementById('ratingSuccess');

const novelId = openBtn.dataset.novelId;

/* OPEN */
openBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

/* CLOSE */
closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

/* CLOSE ON BACKDROP */
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

stars.forEach(star => {

  star.addEventListener('mouseenter', () => {

    const value = Number(star.dataset.rate);

    stars.forEach(s => {
      const current = Number(s.dataset.rate);

      s.classList.toggle('hovered', current <= value);
    });
  });

  star.addEventListener('mouseleave', () => {
    stars.forEach(s => s.classList.remove('hovered'));
  });

});

stars.forEach(star => {

  star.addEventListener('click', async () => {

    const rate = Number(star.dataset.rate);

    try {

      const response = await fetch(`/api/novel-rate/${novelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rate
        })
      });

      if (!response.ok) {
        throw new Error();
      }

      /* SAVE SELECTED STATE */
      stars.forEach(s => {

        const current = Number(s.dataset.rate);

        s.classList.toggle('selected', current <= rate);
      });

      successLabel.classList.remove('hidden');

    } catch (err) {

      alert('Failed to submit rating');

    }

  });

});

