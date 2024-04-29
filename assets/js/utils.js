export const base_url = 'http://localhost:5000';

export function hideModals () {
  //* closest permet de récupérer le plus element parent qui match .modal
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    modal.classList.remove('is-active');
  });
}