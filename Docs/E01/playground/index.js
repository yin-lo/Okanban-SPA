const fruits = [
  { id: 1, name: 'Kiwi', unitPrice: 1, quantity: 6 },
  { id: 2, name: 'Pomme', unitPrice: 0.8, quantity: 2 },
  { id: 3, name: 'Raisin', unitPrice: 2.5, quantity: 1 },
  { id: 4, name: 'Fraise', unitPrice: 3.5, quantity: 1 },
];

//* Recupere un element
//* soit le tag
//* soit par l'id
//* ou via la class
/* const titre = document.querySelector('#mon-titre'); */
// const titre = document.querySelector('.titre-v2');
const titre = document.getElementById('mon-titre');
titre.classList.add('is-size-1');
titre.classList.add('is-italic');

//* pour chaque fruit affiche un element dans le DOM qui aura le détail du fruit

const fruitsContainer = document.getElementById('fruits-container');

fruits.forEach((fruit) => {
  //? methode 1 :

  //* ATTENTION: SENSIBLE AU INJECTION XSS
  /* fruitsContainer.insertAdjacentElement(
    'afterbegin',
    `
     <article class="card">
       <h2 class="card-title">${fruit.name}</h2>
       <footer class="card-footer">
         <p class="card-footer-item">Quantité : ${fruit.quantity}</p>
         <p class="card-footer-item">Prix à l'unité : ${fruit.unitPrice}€</p>
       </footer>
     </article>
   `
  ); */

  //? methode 2:
  /* const article = document.createElement('article');
  article.classList.add('card');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title');
  h2.textContent = fruit.name;
  article.appendChild(h2);
  fruitsContainer.appendChild(article); */

  //? methode 3:
  const fruitTemplate = document.getElementById('fruit-template');
  const fruitClone = document.importNode(fruitTemplate.content, true);
  // console.log(fruitClone);
  fruitClone.querySelector('[slot="fruit-name"]').textContent = fruit.name;

  fruitsContainer.appendChild(fruitClone);
});

// =======================
//  --- REVISION 3 ---
//    addEventListener
// =======================

const addFruitButton = document.getElementById('add-fruit-button');
addFruitButton.addEventListener('click', (event) => {
  console.log('hello');
  console.log(event);
  event.target.classList.add('is-italic');
});

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  console.dir(event.target[0].value);
});
