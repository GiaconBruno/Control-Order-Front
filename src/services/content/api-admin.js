
axios.defaults.baseURL = 'http://dev-bruno:3001';
axios.defaults.timeout = 5000;
const server = () => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 500);
    axios.get('/')
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  })
  return promise;
}