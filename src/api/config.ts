export const apiUrl = 'http://localhost:1337';

export const upload = async (data: FormData) => {
  await fetch(`${apiUrl}/upload`, {
    method: 'POST',
    headers: {

    },
    body: data
  });

};
