// on objet qui contient des fonctions
const app = {
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');
    app.addListenerToActions();
  },
  addListenerToActions: function () {
    const addListButton = document.getElementById('addListButton');
    addListButton.addEventListener('click', app.showAddListModal);
  },
  showAddListModal: function () {
    const listModal = document.getElementById('addListModal');
    listModal.classList.add('is-active');
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
