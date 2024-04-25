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
    const listForm = document.querySelector('#addListForm');
    listForm.addEventListener('submit', (event) => {
      event.preventDefault();
      app.handleAddListFrom(event.target);
    });

    // récupérer formulaire ajout d'une carte
    const cardForm = document.querySelector('#addCardForm');
    cardForm.addEventListener('submit', (event) => {
      event.preventDefault();
      app.handleAddCardFrom(event.target);
    });
  },

  // bouton plus pour ajouter une carte
  addListenerOnPlusButtons() {
    const plusButtons = document.querySelectorAll('.is-pulled-right');

    plusButtons.forEach((plusButton) => {
      plusButton.addEventListener('click', (event) => {
        app.showAddCardModal(event.target);
      });
    });
  },

  // ouvrir une modale pour créer une liste
  showAddListModal() {
    const addModal = document.getElementById('addListModal');
    addModal.classList.add('is-active');
  },

  // ouvrir une modale pour créer une carte
  showAddCardModal(target) {
    const addModal = document.getElementById('addCardModal');
    addModal.classList.add('is-active');
    const targetList = target.closest('.panel');
    const listId = targetList.dataset.listId;
    document.querySelector('input[name="list_id"]').value = listId;
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
    app.newData.length = 0;
    formData.forEach((value, key) => {
      app.newData.push({ [key]: value });
    });

    app.makeListInDOM();
  },

  // récupérer form ajout d'une carte
  handleAddCardFrom(event) {
    const formData = new FormData(event);
    app.newData.length = 0;
    formData.forEach((value, key) => {
      app.newData.push({ [key]: value });
    });

    app.makeCardInDOM();
  },

  // création de liste à partir d'un clone du template
  makeListInDOM() {
    const cardContainer = document.querySelector('.card-lists');
    const listTemplate = document.getElementById('list-template');

    app.newData.forEach((list) => {
      const listClone = document.importNode(listTemplate.content, true);
      listClone.querySelector('[slot="list-name"]').textContent = list.name;

      listClone.querySelector('.panel').dataset.listId = crypto.randomUUID();

      cardContainer.prepend(listClone);
      const inputName = document.querySelector('[name="name"]');
      inputName.value = '';

      app.addListenerOnPlusButtons();

      app.hideModals();
    });
  },

  // création de cartes à partir d'un clone du template
  makeCardInDOM() {
    console.log(app.newData);
    const cardContainer = document.querySelector(`[data-list-id='${app.newData[1].list_id}'] .panel-block`);
    const cardTemplate = document.getElementById('card-template');

    const cardClone = document.importNode(cardTemplate.content, true);
    cardClone.querySelector('[slot="card-name"]').textContent = app.newData[0].name;

    cardContainer.prepend(cardClone);

    app.hideModals();
  },

  // fonction d'initialisation, lancée au chargement de la page
  init() {
    app.addListenerToActions();
    app.makeListInDOM();
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
