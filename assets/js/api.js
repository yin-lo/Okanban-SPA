import { base_url } from "./utils";

import { showListInDOM } from "./list";

import { cardsOfListInDOM } from "./card";

export async function getListsFromAPI() {
  try {
    const response = await fetch(`${base_url}/lists`);
    // pas besoin de préciser : method GET car c'est par défaut

    // on récupère du JSON, forcément en AWAIT
    const json = await response.json();

    // à préciser ci dessous car sinon le serveur renvoie qd mm qqch : "route pas trouvé", par exemple. Donc on renvoie l'erreur dans le catch au cas où.
    if (!response.ok) {  
      throw json;
    }
    // console.log(json);

    // on prépare pour la position de la prochaine liste
    app.listNextPosition = json.length + 1;

    json.forEach(list => {
      showListInDOM(list);
      cardsOfListInDOM(list);
    });
  } catch (error) {
    alert('erreur fetch');
    console.log(error);
  }
}

export async function postData(route, data) {
  try {
    const response = await fetch(`${base_url}${route}`, {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(data)), 
      headers: {          // si body = formData, alors : pas besoin du headers !
        'Content-type': 'application/json',
        // 'Content-type': 'multipart/form-data', // le formData permet d'envoyer des fichiers
      },
    });
    const json = await response.json();
    if (!response.ok) {
      throw json;
    }
    return json;
  } catch (error) {
    // alert('erreur fetch');
    console.log(error);
  }
}
