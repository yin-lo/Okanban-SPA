import { showAddCardModal } from './card.js';
import { hideModals, base_url } from './utils.js';
import { postListToApi } from './api.js';

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
  //* Mets à jour le titre de liste
  listClone.querySelector('[slot="list-title"]').textContent = datas.title;
  //* recupere le container qui contient les listes
  const listContainer = document.querySelector('.card-lists');

  //? ajoute l'écouteur pour ouvrir la modal ajout de carte
  listClone.querySelector('.icon').addEventListener('click', showAddCardModal);

  /* listClone
      .querySelector('.icon')
      .addEventListener('click', (event) => {
        showAddCardModal(event, 'toto')
      }); */

  //* ajoute la liste à la fin
  listContainer.append(listClone);
}
