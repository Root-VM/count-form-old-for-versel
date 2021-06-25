export const apiUrl = 'http://35.156.136.1:3000';

export const filesUpload = async (data: FormData) => {
  const response = await fetch(`${apiUrl}/words/price`, {
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
