//?===================
//? GET
//?===================

async function getDatas() {
  try {
    const response = await fetch('http://localhost:3000/lists/1');
    const json = await response.json();
    //* si la liste n'existe pas lists/155 => tout est ok mais renvoie json null => return json => if json(null) ... else alert
    //* si la route n'est pas bonne 404 => renvoie le json dans l'erreur => return null => if null => else alert
    //* si trouve la liste => renvoie le json => if json ...
    console.log(response);

    if (!response.ok) {
      throw json;
    }
    console.log(json);
    console.log('tout est ok');
  } catch (error) {
    console.log('erreur fetch');
    console.log(error);
  }
}

getDatas();

//?===================
//? Format d'un POST
//?===================

const form = document.querySelector('form');
form.addEventListener('submit', postData);

async function postData(event) {
  try {
    event.preventDefault();

    const formData = new FormData(event.target);
    const response = await fetch('http://localhost:3000/lists', {
      method: 'POST',
      //? Methode 1 avec formData
      //   body: formData, // multipart/form-data
      //? Methode 2 avec json
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const json = await response.json();
    if (!response.ok) {
      throw json;
    }
    console.log('tout est ok');
    console.log(json);
  } catch (error) {
    alert('erreur fetch');
    console.log(error);
  }
}
