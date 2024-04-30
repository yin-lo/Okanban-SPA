import { hideModals } from './utils.js';
import { postCardToApi, editCardInAPI, deleteCardInAPI } from './api.js';

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

  // click pour supprimer la carte
  cardClone.querySelector('[slot="icon-delete"]').addEventListener('click', (event) => {
    handleDeleteCard(event, datas.id);
  });

  // click pour éditer la carte
  cardClone.querySelector('[slot="icon-edit"]').addEventListener('click', showEditCard);

  // submit edit card
  cardClone.querySelector('form').addEventListener('submit', (event) => {
    handleEditCard(event, datas.id);
  });

  const cardContainerOfList = document.querySelector(`[data-list-id="${datas.list_id}"] .panel-block`);

  cardContainerOfList.append(cardClone);
}

async function handleDeleteCard(event, id) {
  const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer la carte ?');
  if (isConfirmed) {
    // supprime la carte côté API
    const result = await deleteCardInAPI(id);
    if (result) {
      // supprime du DOM
      deleteCardFromDom(id);
    } else {
      alert('Impossible de supprimer la carte');
    }
  }
}

function deleteCardFromDom(cardId) {
  const card = document.getElementById('card-' + cardId);
  card.remove();
}

async function handleEditCard(event, cardId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  // appel à l'API
  const editedCard = await editCardInAPI(formData, cardId);
  if (editedCard) {
    // mettre à jour le titre de la carte
    editCardInDom(event.target.previousElementSibling, editedCard);
  } else {
    alert('Impossible de modifier le nom de la carte');
  }

  event.target.reset();
  event.target.classList.add('is-hidden');
}

function editCardInDom(cardContent, data) {
  cardContent.classList.remove('is-hidden');
  cardContent.textContent = data.content;
}

function showEditCard(event) {
  //editer le nom
  const card = event.target.closest('.box');
  const form = card.querySelector('form');
  form.classList.toggle('is-hidden');
  // cacher le titre actuel
  const cardContent = card.querySelector('[slot="card-content"]');
  cardContent.classList.toggle('is-hidden');
  // placeholder = nom carte actuel
  form.querySelector('input[name="content"]').value = cardContent.textContent;
}
