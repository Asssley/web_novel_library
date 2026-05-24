const btn = document.getElementById('filtersBtn');
const modal = document.getElementById('filtersModal');
const resetBtn = document.getElementById('resetFilters');
const form = document.getElementById('filtersForm');

// Open/close window
btn.addEventListener('click', () => {
  modal.classList.remove('hidden');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});

// Reset filters
resetBtn.addEventListener('click', () => {
  form.reset();
  form.submit();
});

resetBtn.addEventListener('click', () => {
  window.location.href = '/novels';
});