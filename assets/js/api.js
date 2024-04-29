import { base_url } from './utils.js';

export async function getListsFromAPI() {
  try {
    const response = await fetch(`${base_url}/lists`);
    const json = await response.json();
    if (!response.ok) {
      throw json;
    }
    console.log(json);
    return json;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function postListToApi(dataFromForm) {
  try {
    const response = await fetch(`${base_url}/lists`, {
      method: 'POST',
      //* methode 1 post avec dataFromForm
      body: dataFromForm,
    });
    const json = await response.json();
    if (!response.ok) {
      throw json;
    }
    return json;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function postCardToApi(dataFromForm) {
  try {
    const response = await fetch(`${base_url}/cards`, {
      method: 'POST',
      //* methode 2 post avec json
      body: JSON.stringify(Object.fromEntries(dataFromForm)),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const json = await response.json();
    if (!response.ok) {
      throw json;
    }
    return json;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function patchListToApi(data) {
  try {
    const sendData = {};
    if (data.get('list-name')) {
      sendData.title = data.get('list-name');
    }
    if (data.get('position')) {
      sendData.position = data.get('position');
    }
    const response = await fetch(`${base_url}/lists/${data.get('list-id')}`, {
      method: 'PATCH',
      body: JSON.stringify(sendData),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const json = await response.json();
    if (!response.ok) {
      throw json;
    }
    return json;
  } catch (error) {
    console.log(error);
    return null;
  }
}
