import { hideModals } from './utils.js';
import { showAddListModal, handleAddListForm, makeListInDOM, showFormUpdateTitle, handleUpdateListForm } from './list.js';
import { handleAddCardForm, makeCardInDOM } from './card.js';
import { getListsFromAPI } from './api.js';

const app = {
  // fonction d'initialisation, lancée au chargement de la page
  init: async function () {
    // console.log('app.init !');
    const lists = await getListsFromAPI();
    if (lists) {
      for (const list of lists) {
        makeListInDOM(list);
        for (const card of list.cards) {
          makeCardInDOM(card);
        }
      }
    } else {
      alert('Impossible de récupérer les listes');
    }

    app.addListenerToActions();
  },

  addListenerToActions: function () {
    //* click ouvrir list modal
    const addListButton = document.getElementById('addListButton');
    addListButton.addEventListener('click', showAddListModal);

    //* click fermer modal
    const buttonsCloseModals = document.querySelectorAll('.modal .close');
    buttonsCloseModals.forEach((elementButton) => {
      elementButton.addEventListener('click', hideModals);
    });

    //* submit form ajouter liste
    const formAddList = document.querySelector('#addListModal form');
    formAddList.addEventListener('submit', handleAddListForm);

    //* submit
    const formAddCard = document.querySelector('#addCardModal form');
    formAddCard.addEventListener('submit', handleAddCardForm);

    //* double click pour modifier titre
    const titleLists = document.querySelectorAll('[slot="list-title"]');
    titleLists.forEach((titleList) => {
      titleList.addEventListener('dblclick', () => {
        const list = titleList.closest('.panel');
        const listId = list.dataset.listId;
        showFormUpdateTitle(listId);
      });
    });

    //* submit form : modifier le titre de la liste
    const formUpdateLists = document.querySelectorAll('.panel form');
    formUpdateLists.forEach((formUpdateList) => {
      formUpdateList.addEventListener('submit', handleUpdateListForm);
    });
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
