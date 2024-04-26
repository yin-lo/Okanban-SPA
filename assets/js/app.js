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
    //* stop le comportement par defaut
    event.preventDefault();
    const formData = new FormData(event.target);
    // console.log(formData.get('title'));
    //* astuce
    console.log(JSON.stringify(Object.fromEntries(formData)));
    //* afficher la nouvelle dans le DOM
    app.makeListInDOM(formData);
    //* ferme la modal
    app.hideModals();
    //* reset du formulaire
    event.target.reset();
  },
  makeListInDOM: function (datas) {
    //* recuperer le template
    const listTemplate = document.getElementById('list-template');
    //* clone du template
    const listClone = document.importNode(listTemplate.content, true);
    console.log(listClone);
    //* ajoute un id
    const randomNumber = Math.round(Math.random() * 5000);
    listClone.querySelector('.panel').id = `list-${randomNumber}`;
    //* dataset permet d'associer des données à des élements html
    //* optionnel ici, car on lui passe déja un id
    listClone.querySelector('.panel').dataset.listId = `list-${randomNumber}`;
    //* Mets à jour le titre de liste
    listClone.querySelector('[slot="list-title"]').textContent =
      datas.get('title');
    //* recupere le container qui contient les listes
    const listContainer = document.querySelector('.card-lists');
    //* ajoute la liste à la fin
    listContainer.append(listClone);
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
