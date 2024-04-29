import {base_url, hideModals} from './utils.js';
// import * as utils from './utils.js'; puis on utilise "utils.base_url" ensuite, par exemple

import { showAddListModal, handleAddListForm } from './list.js';

import {handleAddCardForm} from './card.js';

import { getListsFromAPI, postData } from './api.js';

// un objet qui contient des fonctions
const app = {

  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    //console.log('app.init !');
    app.addListenerToActions();
    getListsFromAPI();
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

    //* submit form ajouter carte
    const formAddCard = document.querySelector('#addCardModal form');
    formAddCard.addEventListener('submit', handleAddCardForm);
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
