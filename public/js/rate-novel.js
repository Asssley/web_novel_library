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

