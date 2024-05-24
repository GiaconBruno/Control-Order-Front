axios.defaults.baseURL = `http://${location.hostname}:3000`;
axios.defaults.timeout = 5000;

server = () => {
  let promise = new Promise((resolve, reject) => {
    // setTimeout(() => reject(false), 500);return
    axios.get(`/`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}

getSettings = () => {
  let promise = new Promise((resolve, reject) => {
    axios.get(`/api/settings`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}

updateSettings = (item) => {
  let promise = new Promise((resolve, reject) => {
    axios.post(`/api/settings`, item)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}

getProducts = () => {
  let promise = new Promise((resolve, reject) => {
    axios.get(`/api/products`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}

storeProduct = (item) => {
  let promise = new Promise((resolve, reject) => {
    axios.post(`/api/product`, item)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}

updateProduct = (hash, item) => {
  let promise = new Promise((resolve, reject) => {
    axios.patch(`/api/product/${hash}`, item)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}

deleteProduct = (hash) => {
  let promise = new Promise((resolve, reject) => {
    axios.delete(`/api/product/${hash}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}

getDailyOrders = () => {
  let promise = new Promise((resolve, reject) => {
    axios.get(`/api/orders/list`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}

getOrders = (date) => {
  let promise = new Promise((resolve, reject) => {
    axios.get(`/api/order?data=${date}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}

changeStatus = (date, hash, status) => {
  let promise = new Promise((resolve, reject) => {
    axios.post(`/api/order/${hash}/${status}?data=${date}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}

deleteOrder = (date, hash, item) => {
  let promise = new Promise((resolve, reject) => {
    axios.delete(`/api/order/${hash}/${item}?data=${date}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}

createOrder = (payload) => {
  let promise = new Promise((resolve, reject) => {
    axios.post(`/api/client/create`, payload)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  })
  return promise;
}