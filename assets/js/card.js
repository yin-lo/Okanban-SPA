import { hideModals, base_url } from './utils.js';
import { postCardToApi, editCardInAPI, deleteCardInAPI } from './api.js';

export function showAddCardModal(event) {
  const cardModal = document.getElementById('addCardModal');
  cardModal.classList.add('is-active');
  const listId = event.target.closest('.panel').dataset.listId;
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

  //? click pour delete carte
  cardClone
    .querySelector('[slot="icon-delete"]')
    .addEventListener('click', (event) => {
      handleDeleteCard(event, datas.id);
    });

  //? click pour edit carte
  cardClone
    .querySelector('[slot="icon-edit"]')
    .addEventListener('click', showEditCard);

  //? submit edit card
  cardClone.querySelector('form').addEventListener('submit', (event) => {
    handleEditCard(event, datas.id);
  });

  const cardContainerOfList = document.querySelector(
    `[data-list-id="${datas.list_id}"] .panel-block`
  );
  cardContainerOfList.append(cardClone);
}

async function handleDeleteCard(event, id) {
  const isConfirmed = confirm('Etes-vous sûr de vouloir supprimer la carte ?');
  if (isConfirmed) {
    //* supprime la carte coté api
    const result = await deleteCardInAPI(id);
    if (result) {
      //* supprime la carte du dom
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

  // console.log(JSON.stringify(Object.fromEntries(formData)));

  //* appel api pour maj carte
  const editedCard = await editCardInAPI(formData, cardId);

  if (editedCard) {
    //* met a jour le titre de la carte

    editCardInDom(event.target.previousElementSibling, editedCard);
  } else {
    alert('Impossible de changer la carte');
  }

  event.target.reset();
  event.target.classList.add('is-hidden');
}

function editCardInDom(cardContent, data) {
  cardContent.classList.remove('is-hidden');
  cardContent.textContent = data.content;
}

function showEditCard(event) {
  const card = event.target.closest('.box');
  const form = card.querySelector('form');
  form.classList.toggle('is-hidden');

  const cardContent = card.querySelector('[slot="card-content"]');
  cardContent.classList.toggle('is-hidden');

  form.querySelector('input[name="content"]').value = cardContent.textContent;
}
