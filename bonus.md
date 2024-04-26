# Mettre un paramètre dans la callback de l'eventlistener

Il faut rendre la callback anonyme avec une fonction fléchée :

```js
listClone
      .querySelector('.icon')
      .addEventListener('click', (event) => {
        app.showAddCardModal(event, 'toto')
      });
```

Avant :

```js
listClone
      .querySelector('.icon')
      .addEventListener('click', app.showAddCardModal);
```
