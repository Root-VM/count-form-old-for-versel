// export const apiUrl = 'http://35.156.136.1:3000';
export const apiUrl = 'https://wordcount.nadlo.ch';

export const filesUpload = async (data: FormData) => {
  const response = await fetch(`${apiUrl}/words/payment`, {
    method: 'POST',
    headers: {},
    body: data
  });
  return response.json();
};

export const fileUpload = async (data: FormData) => {
  const response = await fetch(`${apiUrl}/words/price`, {
    method: 'POST',
    headers: {},
    body: data
  });
  return response.json();
};

export const pusrchased = async (data: FormData) => {
  const response = await fetch(`${apiUrl}/words/purchased`, {
    method: 'POST',
    headers: {},
    body: data
  });
  return response.json();
};

export const getLanguages = async () => {
  try{
    const response = await fetch(`${apiUrl}/words/languages`, {
      method: 'GET'
    });
    return response.json();
  } catch (e) {
    console.log('Error-----', e);
    return {languages: []};
  }
};
