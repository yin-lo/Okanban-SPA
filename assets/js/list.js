import { showAddCardModal } from './card.js';
import { hideModals } from './utils.js';
import { editListInAPI, postListToApi } from './api.js';

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
  listClone.querySelector('.icon').addEventListener('click', showAddCardModal);

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
}


// on affiche/cache le formulaire pour editer le titre de la liste
function showEditForm(event) {
  const form = event.target.nextElementSibling;
  form.classList.toggle('is-hidden');
}

// on prépare pour envoyer les modifs au back
async function handleEditList(event, id) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const editedList = await editListInAPI(formData, id);
  if (editedList) {
    // mettre à jour le titre dans le DOM
    console.log(editedList);
    event.target.previousElementSibling.textContent = editedList.title;
  } else {
    alert('impossible de modifier la liste');
  }
  event.target.classList.add('is-hidden');
  event.target.reset();
}