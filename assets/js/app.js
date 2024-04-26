// on objet qui contient des fonctions
const app = {
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');
    app.addListenerToActions();
    app.getListsFromAPI();
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

    //* click ajouter une carte
    const buttonsAddCardToList = document.querySelectorAll('.panel .icon');
    buttonsAddCardToList.forEach((buttonAddCard) => {
      buttonAddCard.addEventListener('click', app.showAddCardModal);
    });

    //* submit
    const formAddCard = document.querySelector('#addCardModal form');
    formAddCard.addEventListener('submit', app.handleAddCardForm);
  },

  showAddListModal: function () {
    const listModal = document.getElementById('addListModal');
    listModal.classList.add('is-active');
  },

  showAddCardModal: function (event) {
    const cardModal = document.getElementById('addCardModal');
    cardModal.classList.add('is-active');
    const listId = event.target.closest('.panel').dataset.listId; // data-list-id
    cardModal.querySelector('input[type=hidden]').value = listId;
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

  handleAddCardForm: function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const listId = formData.get('list_id');
    app.makeCardInDOM(formData, listId);
    app.hideModals();
    event.target.reset();
  },

  makeListInDOM: function (datas) {
    //* recuperer le template
    const listTemplate = document.getElementById('list-template');
    //* clone du template
    const listClone = document.importNode(listTemplate.content, true);
    // console.log(listClone);

    //* dataset permet d'associer des données à des élements html
    //* optionnel ici, car on lui passe déja un id
    listClone.querySelector('.panel').dataset.listId = 'list_id';
    //* Mets à jour le titre de liste
    listClone.querySelector('[slot="list-title"]').textContent = datas.get('title');
    //* recupere le container qui contient les listes
    const listContainer = document.querySelector('.card-lists');

    //? ajoute l'écouteur pour ouvrir la modal ajout de carte
    listClone.querySelector('.icon').addEventListener('click', app.showAddCardModal);

    /* listClone
      .querySelector('.icon')
      .addEventListener('click', (event) => {
        app.showAddCardModal(event, 'toto')
      }); */

    //* ajoute la liste à la fin
    listContainer.append(listClone);
  },

  makeCardInDOM: function (datas, id) {
    console.log('monter la carte');
    const cardTemplate = document.getElementById('card-template');
    const cardClone = document.importNode(cardTemplate.content, true);
    const randomNumber = Math.round(Math.random() * 5000);
    cardClone.querySelector('.box').id = `card-${randomNumber}`;
    cardClone.querySelector('[slot="card-content"]').textContent = datas.get('content');

    const cardContainerOfList = document.querySelector(`[data-list-id="${id}"] .panel-block`);
    cardContainerOfList.append(cardClone);
  },

  base_url: 'http://localhost:5000',

  async getListsFromAPI() {
    try {
      const response = await fetch(`${app.base_url}/lists`, {
        method: 'GET',
      });
      const json = await response.json();
      if (!response.ok) {
        throw json;
      }
      // console.log(json);
      json.forEach(list => {
        app.showListsInDOM(list);
        app.showCardsInDOM(list);
      });
    } catch (error) {
      alert('erreur fetch');
      console.log(error);
    }
  },

  showListsInDOM(list) {
    //* recuperer le template
    const listTemplate = document.getElementById('list-template');

    //* clone du template
    const listClone = document.importNode(listTemplate.content, true);
    //* optionnel ici, car on lui passe déja un id
    listClone.querySelector('.panel').dataset.listId = list.id;
    //* Mets à jour le titre de liste
    listClone.querySelector('[slot="list-title"]').textContent = list.title;
    //* recupere le container qui contient les listes
    const listContainer = document.querySelector('.card-lists');

    //? ajoute l'écouteur pour ouvrir la modal ajout de carte
    listClone.querySelector('.icon').addEventListener('click', app.showAddCardModal);

    //* ajoute la liste à la fin
    listContainer.append(listClone);
  },

  showCardsInDOM(list) {
    //* recuperer le template
    const cardTemplate = document.getElementById('card-template');

    list.cards.forEach((card) => {
      //* clone du template
      const cardClone = document.importNode(cardTemplate.content, true);
      //* optionnel ici, car on lui passe déja un id
      cardClone.querySelector('.box').id = card.id;
      //* Mets à jour le titre de la carte
      cardClone.querySelector('[slot="card-content"]').textContent = card.content;
      //* recupere le container qui contient les cartes
      const cardContainerOfList = document.querySelector(`[data-list-id="${list.id}"] .panel-block`);

      //* ajoute la lcarte dans les listes
      cardContainerOfList.append(cardClone);
    });
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
