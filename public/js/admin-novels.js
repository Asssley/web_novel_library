document.addEventListener('DOMContentLoaded', () => {

  const deleteButtons = document.querySelectorAll(
    '[data-action="delete-novel"]'
  );

  deleteButtons.forEach(button => {
    button.addEventListener('click', async () => {

      const novelId = button.dataset.id;

      const confirmed = confirm(
        'Are you sure you want to delete this novel?\n\nThis action cannot be undone.'
      );

      if (!confirmed) {
        return;
      }

      button.disabled = true;
      button.textContent = 'Deleting...';

      try {
        const response = await fetch(
          `/api/admin/novels/${novelId}`,
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
        alert('Failed to delete novel.');

        button.disabled = false;
        button.textContent = 'Delete';
      }
    });
  });

});
