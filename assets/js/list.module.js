import { showAddCardModal, sortableCard } from './card.module.js';
import { hideModals, base_url } from './utils.module.js';
import { postListToApi, editListInAPI, deleteListInApi } from './api.module.js';
import Sortable from 'sortablejs';

export function showAddListModal() {
  const listModal = document.getElementById('addListModal');
  listModal.classList.add('is-active');
}

export async function handleAddListForm(event) {
  //* stop le comportement par defaut
  event.preventDefault();
  const formData = new FormData(event.target);
  //* astuce
  console.log(JSON.stringify(Object.fromEntries(formData)));

  //* afficher la nouvelle dans le DOM
  const newList = await postListToApi(formData);
  if (newList) {
    makeListInDOM(newList);
  } else {
    alert("Impossible d'ajouter la liste");
  }

  //* ferme la modal
  hideModals();
  //* reset du formulaire
  event.target.reset();
}

export function makeListInDOM(datas) {
  //* recuperer le template
  const listTemplate = document.getElementById('list-template');
  //* clone du template
  const listClone = document.importNode(listTemplate.content, true);
  //* ajoute un id
  listClone.querySelector('.panel').id = `list-${datas.id}`;
  //* dataset permet d'associer des données à des élements html
  //* optionnel ici, car on lui passe déja un id
  listClone.querySelector('.panel').dataset.listId = datas.id;
  //* Mets à jour le titre de liste
  listClone.querySelector('[slot="list-title"]').textContent = datas.title;
  //* recupere le container qui contient les listes
  const listContainer = document.querySelector('.card-lists');

  //? ajoute l'écouteur pour ouvrir la modal ajout de carte
  listClone
    .querySelector('[slot="icon-add"]')
    .addEventListener('click', showAddCardModal);

  //? click pour delete list
  listClone
    .querySelector('[slot="icon-delete"]')
    .addEventListener('click', (event) => {
      handleDeleteList(event, datas.id);
    });

  //? click pour editer le titre
  listClone
    .querySelector('[slot="list-title"]')
    .addEventListener('dblclick', showEditForm);

  //? submit edit form
  listClone.querySelector('form').addEventListener('submit', (event) => {
    handleEditList(event, datas.id);
  });

  //* ajoute la liste à la fin
  listContainer.append(listClone);

  //* une fois la liste montée, tu ajoute le sortable sur le block de carte
  const cardsContainer = document.querySelector(
    `#list-${datas.id} .panel-block`
  );
  sortableCard(cardsContainer);
}

async function handleDeleteList(event, listId) {
  const isConfirm = confirm('Etes-vous sûr de vouloir supprimer la liste ?');
  if (isConfirm) {
    //* supprime la liste du back
    const deleteConfirm = await deleteListInApi(listId);
    if (deleteConfirm) {
      //* supprime la liste du DOM
      removeListFromDom(listId);
    } else {
      alert('Impossible de supprimer la liste');
    }
  }
}

function removeListFromDom(id) {
  const list = document.getElementById('list-' + id);
  list.remove();
}

function showEditForm(event) {
  const form = event.target.nextElementSibling;
  form.classList.toggle('is-hidden');
}

async function handleEditList(event, id) {
  event.preventDefault();
  const formData = new FormData(event.target);
  console.log(JSON.stringify(Object.fromEntries(formData)));
  console.log('id de la liste', id);

  //* appel api pour edit coté back
  const editedList = await editListInAPI(formData, id);
  if (editedList) {
    //* met à jour le titre de la liste DANS LE DOM
    console.log(editedList);
    event.target.previousElementSibling.textContent = editedList.title;
  } else {
    alert('Impossible de modifier la liste');
  }
  event.target.classList.add('is-hidden');
  event.target.reset();
}

export function sortableList() {
  const listsContainer = document.querySelector('.card-lists');
  const sortable = Sortable.create(listsContainer, {
    animation: 150,
    ghostClass: 'blue-background-class',
    draggable: '.panel',
    onEnd: (event) => {
      //* si la liste a bien changé de position
      if (event.oldIndex !== event.newIndex) {
        const listsElement = event.target.querySelectorAll('.panel');
        //* POUR chaque liste recupere l'id de la liste et mets à jour la position coté backend
        listsElement.forEach(async (list, index) => {
          const id = list.dataset.listId;
          const formData = new FormData();
          formData.append('position', index + 1);
          //* call api pour maj de la liste
          const listEdited = await editListInAPI(formData, id);
          if (!listEdited) {
            alert('Impossible de changer la position');
          }
        });
      }
    },
  });
}
