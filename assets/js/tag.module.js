import {
  deleteTagFromCard,
  addTagFromCard,
  getTagsFromApi,
} from './api.module';

export function makeTagInDom(tag) {
  const tagTemplate = document.querySelector('#template-tag');
  const tagClone = document.importNode(tagTemplate.content, true);

  tagClone.querySelector('[slot=tag-name]').textContent = tag.name;
  tagClone.querySelector('[slot=tag-name]').style.color = tag.color;
  tagClone.querySelector('[slot=tag-name]').style.borderColor = tag.color;

  const { card_id, tag_id } = tag.card_has_tag;

  const cardAssociated = document.querySelector(`#card-${card_id}`);

  //? double click pour supprimer le tag
  tagClone
    .querySelector('[slot=tag-name]')
    .addEventListener('dblclick', (event) => {
      handleDeleteTag(event, card_id, tag_id);
    });

  cardAssociated.querySelector('[slot=tag-container]').append(tagClone);
}

async function handleDeleteTag(event, cardId, tagId) {
  //* 1 - supprimer le tag coté backend
  const cardEdited = await deleteTagFromCard(cardId, tagId);
  if (!cardEdited) {
    alert('Impossible de supprimer le tag');
  } else {
    //! BONUS PAS VU: a la suppression du tag, rajoute le dans le menu dropdown
    //* tous les tags
    const tags = await getTagsFromApi();
    //* ajoute que le tag juste supprimer
    const tagDeleted = tags.filter((tag) => tag.id == tagId);
    console.log(tagDeleted);
    //* MAJ la liste des tags dans le menu pour cette carte
    addTagToMenuDropdown(cardEdited, tagDeleted);
    //! ---------------------------------------------------
    //* 2- si ok, supprime le tag du dom
    //* event.target c'est le tag element
    event.target.remove();
  }
}

export async function addTagToMenuDropdown(card, tagsFromApi) {
  //! PAS VU
  //* pour l'ajout d'une carte, tagsFromApi sera null
  //* appel l'api pour récupérer les tag
  if (!tagsFromApi) {
    tagsFromApi = await getTagsFromApi();
  }
  //! ----------------------------------

  const cardMenuTag = document.querySelector(
    `#card-${card.id} .dropdown-content`
  );

  tagsFromApi.forEach((tag) => {
    //! PAS VU: card.tags?
    //! vérifie si card.tags est un tableau non vide, si il est vide ne fait pas le find
    //! card.tags? equivaut à if(card.tags), notamment quand on ajoute une carte, tags sera vide
    //! ---------------------------------
    const findTagInCard = card.tags?.find((elt) => elt.id === tag.id);
    if (!findTagInCard) {
      //* ajoute le a la carte
      const tagTemplate = document.getElementById('template-item-tag');
      const tagItemClone = document.importNode(tagTemplate.content, true);

      tagItemClone.querySelector('[slot="tag-item"]').textContent = tag.name;
      tagItemClone
        .querySelector('[slot="tag-item"]')
        .addEventListener('click', (event) => {
          handleAddTagToCard(event, tag.id, card.id);
        });
      cardMenuTag.append(tagItemClone);
    }
  });
  //! BONUS PAS VU - faire disparaitre le dropdown si il est vide
  if (cardMenuTag.childElementCount === 0) {
    cardMenuTag.closest('.dropdown').style.display = 'none';
  } else {
    cardMenuTag.closest('.dropdown').style.display = 'block';
  }
  //! ----------------------------------------------------
}

async function handleAddTagToCard(event, tagId, cardId) {
  const jsonResult = await addTagFromCard(cardId, tagId);
  if (jsonResult) {
    const newAddedTag = jsonResult.tags.find((tag) => tag.id === tagId);
    //* ajoute le tag dans le dom
    makeTagInDom(newAddedTag);
    //! Ajout pas vue en cours: supprime le tag du menu
    //* supprime le tag du menu
    event.target.remove();
  } else {
    alert("Impossible d'ajouter le tag");
  }

  //! BONUS PAS VU - faire disparaitre le dropdown si il est vide
  const dropDownMenu = document.querySelector(
    `#card-${cardId} .dropdown-content`
  );
  if (dropDownMenu.childElementCount === 0) {
    dropDownMenu.closest('.dropdown').style.display = 'none';
  } else {
    dropDownMenu.closest('.dropdown').style.display = 'block';
  }
  //! ------------------------------------------------------
}

//? Déroulé ajout tags
//* créer la fonction qui récupère tous les tags du backend
//* lorsque la carte est ajouté dans le DOM, dans une fonction`addTagToMenuDropDown` POUR chaque tag, filtre le tag manquant de la carte actuelle
//* si aucun tag manquant (la carte a déja tous les tags) ne rajoute pas, ne fait rien
//* si manquant => recupere le template tag-item, copie et ajoute le tag dans le dropDown content
//* ajoute un ecouteur, au click sur ce tag de menu, ajoute le tag dans la carte concerné `handleAddTagToCard`
//* supprime le tag du menu
