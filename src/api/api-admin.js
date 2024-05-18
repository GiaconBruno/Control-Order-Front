axios.defaults.baseURL = 'http://192.168.1.7:3000';
axios.defaults.timeout = 5000;

const server = () => {
  let promise = new Promise((resolve, reject) => {
    // setTimeout(() => reject(false), 500);return
    axios.get('/')
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  })
  return promise;
}

const getProducts = () => {
  let promise = new Promise((resolve, reject) => {
    axios.get('/api/products')
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  })
  return promise;
}