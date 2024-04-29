```js
const httpResponse = await fetch(URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: { title: "Titre", content: "Contenu" }
});
```

Quelle ligne est INCORRECTE pour envoyer une requête POST ?

ligne 3
ligne 4
ligne 5




















## ----------------------

```html
<div id="coffee" data-price="4" data-quantity="5">Café<div>
```

```js
let coffee = document.querySelector('#coffee')

const totalPrice = coffee['data-price'] * coffee['data-quantity'];
const totalPrice = coffee.price * coffee.quantity;
const totalPrice = coffee.dataset.price * coffee.dataset.quantity;
```

Pour accéder à la valeur totale du panier, j'utilise quelle ligne :

ligne 43
ligne 44
ligne 45






















## ----------------------

Comment passer un paramètre (ici chaîne de caractère) en argument dans un écouteur d'événement ?

REPONSE 1
```js
button.addEventListener('click', (event) => {
  doThisWithArgument(event, "parametre")
})
```

REPONSE 2
```js
button.addEventListener('click', doThisWithArgument(event, "parametre"))
```

REPONSE 3
```js
button.addEventListener(doThisWithArgument(event, "parametre"), 'click')
```