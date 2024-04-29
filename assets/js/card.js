import { postData } from "./api";

export function showAddCardModal(event) {
  const cardModal = document.getElementById('addCardModal');
  cardModal.classList.add('is-active');

  const list = event.target.closest('.panel');
  const listId = list.dataset.listId; // data-list-id
  cardModal.querySelector('input[type=hidden]').value = listId;

  const cardNextPosition = list.querySelectorAll('.panel-block > .box').length+1;
  cardModal.querySelector('[name="position"]').value = cardNextPosition;
}

export async function handleAddCardForm (event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const listId = formData.get('list_id');
  const listCardContainer = document.querySelector(`.panel[data-list-id="${listId}"] .panel-block`);

  // appel de la fonction fetch en post :
  const newCard = await postData('/cards', formData);

  if (newCard) {
    addCard(newCard, listCardContainer);
    app.cardNextPosition++;
  } else {
    alert('erreur d\'affichage');
  }
  hideModals();
  event.target.reset();
}
export function cardsOfListInDOM(list) {
  //* récupère le container qui contient les cartes
  const cardContainerOfList = document.querySelector(`[data-list-id="${list.id}"] .panel-block`);

  list.cards.forEach((card) => {
    addCard(card, cardContainerOfList);
  });
}

export function addCard(card, container) {
  //* recuperer le template
  const cardTemplate = document.getElementById('card-template');

  //* clone du template
  const cardClone = document.importNode(cardTemplate.content, true);

  //* on ajoute un id
  cardClone.querySelector('.box').id = `card-${card.id}`; // afin d'avoir un id unique, on rajoute le mot "card" avant le nombre.

  //* Met à jour le titre de la carte
  cardClone.querySelector('[slot="card-content"]').textContent = card.content;

  //* ajouter les couleurs
  cardClone.querySelector('.box').style.backgroundColor = card.color;

  //* ajoute la carte dans les listes
  container.append(cardClone);
}