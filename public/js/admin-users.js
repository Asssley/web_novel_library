const resetBtn = document.getElementById('resetFilters');

async function request(url, method = 'POST') {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return res.json();
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const row = btn.closest('tr');
  const userId = row.dataset.id;

  const action = btn.dataset.action;

  let url = `/api/admin/users/${userId}`;

  if (action === 'toggle-admin') url += '/toggle-role';
  if (action === 'toggle-comment') url += '/toggle-comment';
  if (action === 'toggle-novel') url += '/toggle-novel';

  btn.disabled = true;

  try {
    await request(url);

    location.reload();
  } catch (err) {
    alert('Error occurred');
  } finally {
    btn.disabled = false;
  }
});

resetBtn.addEventListener('click', () => {
  window.location.href = window.location.pathname;
});