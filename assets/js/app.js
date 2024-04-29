// un objet qui contient des fonctions
const app = {

  base_url: 'http://localhost:5000',

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    //console.log('app.init !');
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

    //* submit form ajouter carte
    const formAddCard = document.querySelector('#addCardModal form');
    formAddCard.addEventListener('submit', app.handleAddCardForm);
  },

  showAddListModal: function () {
    const listModal = document.getElementById('addListModal');
    listModal.classList.add('is-active');
    listModal.querySelector('[name="position"]').value = app.listNextPosition;
  },

  showAddCardModal: function (event) {
    const cardModal = document.getElementById('addCardModal');
    cardModal.classList.add('is-active');

    const list = event.target.closest('.panel');
    const listId = list.dataset.listId; // data-list-id
    cardModal.querySelector('input[type=hidden]').value = listId;

    const cardNextPosition = list.querySelectorAll('.panel-block > .box').length+1;
    cardModal.querySelector('[name="position"]').value = cardNextPosition;
  },

  hideModals: function () {
    //* closest permet de récupérer le plus element parent qui match .modal
    // const modal = event.target.closest('.modal');
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      modal.classList.remove('is-active');
    });
  },

  async handleAddListForm (event) {
    //* stop le comportement par defaut
    event.preventDefault();
    const formData = new FormData(event.target);
    // envoyer les infos au back
    const newList = await app.postData('/lists', formData);
    // afficher la nouvelle liste dans le DOM
    if (newList) {
      app.showListInDOM(newList);
      app.listNextPosition++;
    } else {
      alert('erreur d\'affichage');
    }
    // ferme la modal
    app.hideModals();
    // reset du formulaire
    event.target.reset();
  },

  async postData(route, data) {
    try {
      const response = await fetch(`${app.base_url}${route}`, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(data)), 
        headers: {
          'Content-type': 'application/json',
          // 'Content-type': 'multipart/form-data',
        },
      });
      const json = await response.json();
      if (!response.ok) {
        throw json;
      }
      return json;
    } catch (error) {
      // alert('erreur fetch');
      console.log(error);
    }
  },

  async handleAddCardForm (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const listId = formData.get('list_id');
    const listCardContainer = document.querySelector(`.panel[data-list-id="${listId}"] .panel-block`);
    const newCard = await app.postData('/cards', formData);

    if (newCard) {
      app.addCard(newCard, listCardContainer);
      app.cardNextPosition++;
    }else {
      alert('erreur d\'affichage');
    }
    app.hideModals();
    event.target.reset();
  },

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
      // on prépare pour la position de la prochaine liste
      app.listNextPosition = json.length + 1;

      json.forEach(list => {
        app.showListInDOM(list);
        app.cardsOfListInDOM(list);
      });
    } catch (error) {
      alert('erreur fetch');
      console.log(error);
    }
  },

  showListInDOM(list) {
    //* recuperer le template
    const listTemplate = document.getElementById('list-template');
    // console.log(list);
    //* clone du template
    const listClone = document.importNode(listTemplate.content, true);
    //* on lui passe un id
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

  cardsOfListInDOM(list) {
    //* récupère le container qui contient les cartes
    const cardContainerOfList = document.querySelector(`[data-list-id="${list.id}"] .panel-block`);

    list.cards.forEach((card) => {
      app.addCard(card, cardContainerOfList);
    });
  },

  addCard(card, container) {
    //* recuperer le template
    const cardTemplate = document.getElementById('card-template');
    //* clone du template
    const cardClone = document.importNode(cardTemplate.content, true);
    //* on ajoute un id
    cardClone.querySelector('.box').id = card.id;
    //* Met à jour le titre de la carte
    cardClone.querySelector('[slot="card-content"]').textContent = card.content;
    // ajouter les couleurs
    cardClone.querySelector('.box').style.backgroundColor = card.color;
    //* ajoute la carte dans les listes
    container.append(cardClone);
  }
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
