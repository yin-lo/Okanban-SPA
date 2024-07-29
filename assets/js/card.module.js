import { hideModals, base_url, rgbToHex } from './utils.module.js';
import { postCardToApi, editCardInAPI, deleteCardInAPI } from './api.module.js';
import { addTagToMenuDropdown } from './tag.module.js';
import Sortable from 'sortablejs';

export function showAddCardModal(event) {
  const cardModal = document.getElementById('addCardModal');
  cardModal.classList.add('is-active');
  const listId = event.target.closest('.panel').dataset.listId;
  cardModal.querySelector('input[type=hidden]').value = listId;
}

export async function handleAddCardForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  console.log(JSON.stringify(Object.fromEntries(formData)));

  const newCard = await postCardToApi(formData);
  if (newCard) {
    makeCardInDOM(newCard);
  } else {
    alert("Impossible d'ajouter la carte");
  }

  hideModals();
  event.target.reset();
}

export function makeCardInDOM(datas, tags) {
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

  //! TAGS A AJOUTER DANS LE DROPDOWN DE LA CARTE

  addTagToMenuDropdown(datas, tags);
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
  //! pour changer la couleur dans le dom
  cardContent.closest('.box').style.backgroundColor = data.color;
}

function showEditCard(event) {
  const card = event.target.closest('.box');
  const form = card.querySelector('form');
  form.classList.toggle('is-hidden');

  const cardContent = card.querySelector('[slot="card-content"]');
  cardContent.classList.toggle('is-hidden');

  //! bonus couleur avec utils => rgbToHex function
  form.querySelector('input[name="color"]').value = rgbToHex(
    card.style.backgroundColor
  );
  //! ----------------

  form.querySelector('input[name="content"]').value = cardContent.textContent;
}

export function sortableCard(cardsElement) {
  Sortable.create(cardsElement, {
    animation: 150,
    ghostClass: 'blue-background-class',
    draggable: '.box',
    group: 'shared',
    onEnd: (event) => {
      //? Cas 1: carte change dans une meme liste
      // console.log(event.from, event.to);
      //* SI le container de cartes est le même ET si la position de la carte a changé
      if (event.from === event.to && event.oldIndex !== event.newIndex) {
        changeCardPosition(event, 'from');
      }
      //? Cas : si la carte change de liste donc from sera different de to
      if (event.from !== event.to) {
        changeCardPosition(event, 'from');

        //*   pour le container to
        changeCardPosition(event, 'to');
      }
    },
  });
}

function changeCardPosition(event, origin) {
  //* fait le changement coté api
  const cards = event[origin].querySelectorAll('.box'); // event.from soit event.to
  let listId;
  if (origin === 'to') {
    listId = event[origin].closest('.panel').dataset.listId;
  }
  cards.forEach(async (card, index) => {
    //* pour chaque carte met à jour l'api
    const id = card.id.replace('card-', ''); //* pour rappel id = card-XX
    const formData = new FormData();
    formData.append('position', index + 1);
    if (listId) {
      formData.append('list_id', listId);
    }
    //* call api
    const cardEdited = await editCardInAPI(formData, id);
    if (!cardEdited) {
      alert('Impossible de changer la position de la carte');
    }
  });
}
