// un objet qui contient des fonctions
const app = {
  addListenerToActions() {
    // ouvrir une modale
    const buttonAddModal = document.getElementById('addListButton');
    buttonAddModal.addEventListener('click', app.showAddListModal);

    // fermer une modale (plusieurs boutons close)
    const buttonsCloseModal = document.querySelectorAll('.modal .close');
    buttonsCloseModal.forEach((button) => {
      button.addEventListener('click', app.hideModals);
    });

    // récupérer formulaire ajout d'une liste
    const listForm = document.querySelector('#addListForm');
    listForm.addEventListener('submit', app.handleAddListFrom);

    // récupérer formulaire ajout d'une carte
    const cardForm = document.querySelector('#addCardForm');
    cardForm.addEventListener('submit', app.handleAddCardFrom);

    // bouton " + " pour ajouter une carte
    const buttonsAddCardToList = document.querySelectorAll('.panel .icon');
    buttonsAddCardToList.forEach((buttonAddCard) => {
      buttonAddCard.addEventListener('click', app.showAddCardModal);
    });
  },

  // bouton " + " pour ajouter une carte (refait au-dessus)
  /*   addListenerOnPlusButtons() {
    const plusButtons = document.querySelectorAll('.is-pulled-right');

    plusButtons.forEach((plusButton) => {
      plusButton.addEventListener('click', (event) => {
        app.showAddCardModal(event.target);
      });
    });
  }, */

  // ouvrir une modale pour créer une liste
  showAddListModal() {
    const addModal = document.getElementById('addListModal');
    addModal.classList.add('is-active');
  },

  // ouvrir une modale pour créer une carte
  showAddCardModal(target) {
    const addModal = document.getElementById('addCardModal');
    addModal.classList.add('is-active');
    const targetList = target.closest('.panel'); // closest remonte sur le parent ayant la classe spécifiée (fonctionne avec event.target [si event en paramètre] )
    const listId = targetList.dataset.listId;
    // récupère l'input caché :
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
  handleAddListFrom(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    // afficher la liste dans le DOM
    app.makeListInDOM(formData);

    // fermer la modale
    app.hideModals();

    // reset le formulaire
    event.target.reset();
  },

  // récupérer form ajout d'une carte
  handleAddCardFrom(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const listId = formData.get('list_id');

    app.makeCardInDOM(formData, listId);
    app.hideModals();
    event.target.reset();
  },

  // création de liste à partir d'un clone du template
  makeListInDOM(datas) {
    // récupérer le template et le cloner
    const listTemplate = document.getElementById('list-template');
    const listClone = document.importNode(listTemplate.content, true);

    // données que l'on veut rendre dynamique
    // dataset associe des données à des éléments html
    listClone.querySelector('.panel').dataset.listId = crypto.randomUUID();
    // autre possibilité :
    // const randomNumber = Math.round(Math.random() * 5000);
    // listClone.querySelector('.panel').id = `list-${randomNumber}`;
    listClone.querySelector('[slot="list-title"]').textContent = datas.get('title');

    // balise parent où sera mis la liste
    const listContainer = document.querySelector('.card-lists');

    // ajout de l'écouteur pour ouvrir l'ajout d'une carte :
    listClone.querySelector('.icon').addEventListener('click', app.showAddCardModal);

    listContainer.prepend(listClone);
  },

  // création de cartes à partir d'un clone du template
  makeCardInDOM(datas, id) {
    const cardTemplate = document.getElementById('card-template');

    const cardClone = document.importNode(cardTemplate.content, true);
    const randomNumber = Math.round(Math.random() * 5000);
    cardClone.querySelector('.box').id = `card-${randomNumber}`;
    cardClone.querySelector('[slot="card-content"]').textContent = datas.get('content');

    const cardContainer = document.querySelector(`[data-list-id='${id}'] .panel-block`);
    cardContainer.prepend(cardClone);

    app.hideModals();
  },

  // fonction d'initialisation, lancée au chargement de la page
  init() {
    app.addListenerToActions();
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
