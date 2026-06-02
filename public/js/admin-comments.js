const resetBtn = document.getElementById('resetFilters');

resetBtn.addEventListener('click', () => {
  window.location.href = window.location.pathname;
});

const deleteButtons = document.querySelectorAll(
  '[data-action="delete-comment"]'
);

deleteButtons.forEach(button => {
  button.addEventListener('click', async () => {

    const commentId = button.dataset.id;

    const confirmed = confirm(
      'Are you sure you want to delete this comment?\n\nThis action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    button.disabled = true;
    button.textContent = 'Deleting...';

    try {
      const response = await fetch(
        `/api/admin/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      window.location.reload();

    } catch (err) {
      alert('Failed to delete comment.');

      button.disabled = false;
      button.textContent = 'Delete';
    }
  });
});
