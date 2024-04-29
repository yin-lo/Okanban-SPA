import { showAddCardModal } from './card.js';
import { hideModals } from './utils.js';
import { patchListToApi, postListToApi } from './api.js';

export function showAddListModal() {
  const listModal = document.getElementById('addListModal');
  listModal.classList.add('is-active');
}

export async function handleAddListForm(event) {
  //* stop le comportement par defaut
  event.preventDefault();
  const formData = new FormData(event.target);
  // console.log(formData.get('title'));
  //* astuce
  console.log(JSON.stringify(Object.fromEntries(formData)));

  //* BONUS COUNT ELEMENTS
  /* const listCounted =
      document.querySelector('.cards-lists').childElementCount;
    formData.append('position', listCounted + 1); */
  //*-------------------------

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
  
  // on met l'id aussi dans le form caché
  listClone.querySelector('.panel form [name="list-id"]').value = datas.id;

  // on met le nom de la liste actuelle dans l'attribut name
  listClone.querySelector('.panel form [name="list-name"]').value = datas.title;

  //* Mets à jour le titre de liste
  listClone.querySelector('[slot="list-title"]').textContent = datas.title;
  //* recupere le container qui contient les listes
  const listContainer = document.querySelector('.card-lists');

  // ajoute l'écouteur pour ouvrir la modal ajout de carte
  listClone.querySelector('.icon').addEventListener('click', showAddCardModal);

  /* listClone
      .querySelector('.icon')
      .addEventListener('click', (event) => {
        showAddCardModal(event, 'toto')
      }); */

  //* ajoute la liste à la fin
  listContainer.append(listClone);
}

export function showFormUpdateTitle(listId) {
  // relier l'id du template dans le formulaire
  const divList = document.querySelector(`[data-list-id="${listId}"]`);

  // on enlève le H2
  const hideTitle = divList.querySelector('[slot="list-title"]');
  hideTitle.classList.add('is-hidden');

  // on affiche le formulaire
  const showForm = divList.querySelector('[slot="formList"]');
  showForm.classList.remove('is-hidden');
}

export async function handleUpdateListForm(event) {
  //stop le comportement par defaut
  event.preventDefault();
  const formData = new FormData(event.target);

  // console.log(JSON.stringify(Object.fromEntries(formData)));

  const newDataList = await patchListToApi(formData);
  if (newDataList) {
    updateListInDOM(newDataList);
  } else {
    alert('impossible de mettre à jour le nom de cette liste');
  }
  // fermer le formulaire et réafficher le h2
  hideFormUpdateTitle (newDataList.id);
}

export function updateListInDOM(dataList) {
  // mettre à jour les données de la liste (front)
  const listTitle = document.querySelector(`[data-list-id="${dataList.id}"] [slot="list-title"]`);
  listTitle.textContent = dataList.title;
}

const hideFormUpdateTitle = (listId) => {
  // relier l'id du template dans le formulaire
  const divList = document.querySelector(`[data-list-id="${listId}"]`);

  // on remet le H2
  const hideTitle = divList.querySelector('[slot="list-title"]');
  hideTitle.classList.remove('is-hidden');

  // on cache le formulaire
  const showForm = divList.querySelector('[slot="formList"]');
  showForm.classList.add('is-hidden');
}