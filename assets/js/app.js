// on objet qui contient des fonctions
const app = {
  base_url: 'http://localhost:3000',
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');
    app.getListsFromAPI();
    app.addListenerToActions();
  },
  getListsFromAPI: async function () {
    try {
      const response = await fetch(`${app.base_url}/lists`);
      const json = await response.json();
      if (!response.ok) {
        throw json;
      }
      console.log(json);
      for (const list of json) {
        app.makeListInDOM(list);
        for (const card of list.cards) {
          app.makeCardInDOM(card);
        }
      }
    } catch (error) {
      console.log('erreur');
      console.log(error);
    }
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
    console.log(listClone);
    //* ajoute un id
    listClone.querySelector('.panel').id = `list-${datas.id}`;
    //* dataset permet d'associer des données à des élements html
    //* optionnel ici, car on lui passe déja un id
    listClone.querySelector('.panel').dataset.listId = `list-${datas.id}`;
    //* Mets à jour le titre de liste
    listClone.querySelector('[slot="list-title"]').textContent = datas.title;
    //* recupere le container qui contient les listes
    const listContainer = document.querySelector('.card-lists');

    //? ajoute l'écouteur pour ouvrir la modal ajout de carte
    listClone
      .querySelector('.icon')
      .addEventListener('click', app.showAddCardModal);

    /* listClone
      .querySelector('.icon')
      .addEventListener('click', (event) => {
        app.showAddCardModal(event, 'toto')
      }); */

    //* ajoute la liste à la fin
    listContainer.append(listClone);
  },
  makeCardInDOM: function (datas) {
    console.log('monter la carte');
    const cardTemplate = document.getElementById('card-template');
    const cardClone = document.importNode(cardTemplate.content, true);

    cardClone.querySelector('.box').id = `card-${datas.id}`;
    cardClone.querySelector('.box').style.backgroundColor = datas.color;
    cardClone.querySelector('[slot="card-content"]').textContent =
      datas.content;

    console.log(datas);
    const cardContainerOfList = document.querySelector(
      `[data-list-id="list-${datas.list_id}"] .panel-block`
    );
    cardContainerOfList.append(cardClone);
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
