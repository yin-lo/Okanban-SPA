// un objet qui contient des fonctions
const app = {
  addListenerToActions() {
    // ouvrir une modale
    const buttonAddModal = document.getElementById('addListButton');
    buttonAddModal.addEventListener('click', app.showAddListModal);

    // fermer une modale
    const buttonCloseModal = document.querySelectorAll('.close');
    buttonCloseModal.forEach((button) => {
      button.addEventListener('click', app.hideModals);
    });

    // récupérer formulaire ajout d'une liste
    const form = document.querySelector('#addListForm');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      app.handleAddListFrom(event.target);
    });
  },

  // ouvrir une modale pour créer une liste
  showAddListModal() {
    const addModal = document.getElementById('addListModal');
    addModal.classList.add('is-active');
  },

  // fermer tous les boutons close
  hideModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      modal.classList.remove('is-active');
    });
  },

  // récupérer formulaire ajout d'une liste
  newData: [],

  handleAddListFrom(event) {
    const formData = new FormData(event);
    app.newData.length= 0;
    formData.forEach((value, key) => {
      let theList = {};
      theList[key] = value;
      app.newData.push(theList);
    });

    app.makeListInDOM();
  },

  // création de liste à partir d'un clone du template
  makeListInDOM() {
    console.log(app.newData);
    const cardContainer = document.querySelector('.card-lists');
    const listTemplate = document.getElementById('list-template');
    app.newData.forEach((list) => {
      const listClone = document.importNode(listTemplate.content, true);
      listClone.querySelector('[slot="list-name"]').textContent = list.name;

      cardContainer.prepend(listClone);
      const inputName = document.querySelector('[name="name"]');
      inputName.value = '';
      app.hideModals();
    });
  },

  // fonction d'initialisation, lancée au chargement de la page
  init() {
    app.addListenerToActions();
    app.makeListInDOM();
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
