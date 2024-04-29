export const base_url = 'http://localhost:3000';

export function hideModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    modal.classList.remove('is-active');
  });
}
