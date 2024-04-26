// on objet qui contient des fonctions
const app = {
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');
    app.addListenerToActions();
  },
  addListenerToActions: function () {
    //* click ouvrir list modal
    const addListButton = document.getElementById('addListButton');
    addListButton.addEventListener('click', app.showAddListModal);
    //* click fermer modal
    const buttonsCloseModals = document.querySelectorAll('.modal .close');
    buttonsCloseModals.forEach((elementButton) => {
      elementButton.addEventListener('click', app.hideModals);
    });
    //* submit form ajouter liste
    const formAddList = document.querySelector('#addListModal form');
    formAddList.addEventListener('submit', app.handleAddListForm);
  },
  showAddListModal: function () {
    const listModal = document.getElementById('addListModal');
    listModal.classList.add('is-active');
  },
  hideModals: function () {
    //* closest permet de récupérer le plus element parent qui match .modal
    // const modal = event.target.closest('.modal');
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      modal.classList.remove('is-active');
    });
  },
  handleAddListForm: function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    // console.log(formData.get('title'));
    //* astuce
    console.log(JSON.stringify(Object.fromEntries(formData)));
    //* ferme la modal
    app.hideModals();
    //* reset du formulaire
    event.target.reset();
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
