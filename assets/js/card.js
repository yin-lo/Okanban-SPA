import { hideModals, base_url } from './utils.js';
import { postCardToApi } from './api.js';

export function showAddCardModal(event) {
  const cardModal = document.getElementById('addCardModal');
  cardModal.classList.add('is-active');
  const listId = event.target.closest('.panel').dataset.listId; // data-list-id
  cardModal.querySelector('input[type=hidden]').value = listId;
}

export async function handleAddCardForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const newCard = await postCardToApi(formData);
  if (newCard) {
    makeCardInDOM(newCard);
  } else {
    alert("Impossible d'ajouter la carte");
  }

  hideModals();
  event.target.reset();
}

export function makeCardInDOM(datas) {

  const cardTemplate = document.getElementById('card-template');
  const cardClone = document.importNode(cardTemplate.content, true);

  cardClone.querySelector('.box').id = `card-${datas.id}`;
  cardClone.querySelector('.box').style.backgroundColor = datas.color;
  cardClone.querySelector('[slot="card-content"]').textContent = datas.content;

  const cardContainerOfList = document.querySelector(
    `[data-list-id="${datas.list_id}"] .panel-block`
  );
  cardContainerOfList.append(cardClone);
}
