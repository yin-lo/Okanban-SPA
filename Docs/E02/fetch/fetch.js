//?===================
//? GET
//?===================

async function getDatas() {
  try {
    const response = await fetch('http://localhost:3000/lists');
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
