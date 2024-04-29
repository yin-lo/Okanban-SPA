import {showAddCardModal} from './card.js';

import {hideModals} from './utils.js';

export function showAddListModal() {
  const listModal = document.getElementById('addListModal');
  listModal.classList.add('is-active');
  listModal.querySelector('[name="position"]').value = app.listNextPosition;
}

export async function
handleAddListForm (event) {
  // stopper le comportement par defaut
  event.preventDefault();
  const formData = new FormData(event.target);

  // envoyer les infos au back
  const newList = await postData('/lists', formData);

  // afficher la nouvelle liste dans le DOM
  if (newList) {
    showListInDOM(newList);
    listNextPosition++;
  } else {
    alert('erreur d\'affichage');
  }
  // ferme la modal
  hideModals();

  // reset du formulaire
  event.target.reset();
}

export function showListInDOM(list) {
  //* recuperer le template
  const listTemplate = document.getElementById('list-template');

  //* clone du template
  const listClone = document.importNode(listTemplate.content, true);

  //* on lui passe un id
  listClone.querySelector('.panel').dataset.listId = list.id;

  //* Mets à jour le titre de liste
  listClone.querySelector('[slot="list-title"]').textContent = list.title;

  //* recupere le container qui contient les listes
  const listContainer = document.querySelector('.card-lists');

  //* ajoute l'écouteur pour ouvrir la modal ajout de carte
  listClone.querySelector('.icon').addEventListener('click', showAddCardModal);

  //* ajoute la liste à la fin
  listContainer.append(listClone);
}