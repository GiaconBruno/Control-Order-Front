getStorage = () => {
  let app = JSON.parse(localStorage.getItem('app'))
  if (!app) [localStorage.setItem('app', JSON.stringify({})), app = {}]
  return app;
}
getStorage();
setStorage = (att, value) => {
  const app = getStorage();
  app[att] = value;
  localStorage.setItem('app', JSON.stringify(app))
}

loading = () => {
  content.innerHTML = ``;
  content.innerHTML = `
  <div class="row mx-0 justify-content-center">
    <div class="px-0 icon-spin"><i class="bi-arrow-clockwise" style="font-size:75px;color:#fff;"></i></div>
  </div>`;
}

fixedError = (error) => {
  try { notify('danger', error.data.mensagem) }
  catch {
    setStorage('status', false)
    srv()
  }
}

// Admin
srv = () => {
  loading();
  server().then((res) => setStorage('status', res))
    .catch(() => setStorage('status', false))
    .finally(() => [renderAuth(), auth()]);
}

auth = () => {
  if (sessionStorage.getItem('Auth')) return init();
  const auth = { auth: document.querySelector('#passAuth') ? passAuth.value : '' };
  loading();
  getAuth(auth).then((res) => [notify('success', res.mensagem), sessionStorage.setItem('Auth', true), init()])
    .catch((err) => [fixedError(err), sessionStorage.removeItem('Auth'), renderAuth()])
}

settings = () => {
  loading();
  getSettings().then((res) => setStorage('settings', res))
    .catch(() => setStorage('status', false))
    .finally(() => renderSettings());
}

createSettings = () => {
  const item = { image: loadImg.src, company: confName.value, PIX: confPIX.value, description: confMsg.value, auth: passAuth.value }
  loading();
  updateSettings(item).then((res) => notify('success', res.mensagem))
    .catch(() => notify('danger', 'Imagem incompativel!'))
    .finally(() => settings())
}

listProd = () => {
  loading();
  getProducts().then((res) => setStorage('products', res))
    .catch(() => setStorage('status', false))
    .finally(() => renderProducts());
}

createChangeProd = (hash) => {
  const item = { descricao: prodDesc.value, valor: parseFloat(prodValue.value), estoque: parseFloat(prodStq.value) }
  if (!hash) storeProduct(item).then((res) => [notify('success', res.mensagem), listProd()])
    .catch((err) => fixedError(err))
  else updateProduct(hash, item).then((res) => [notify('success', res.mensagem), listProd()])
    .catch((err) => fixedError(err))
}

removeProd = (hash) => {
  deleteProduct(hash).then((res) => [notify('success', res.mensagem), listProd()])
    .catch((err) => fixedError(err))
    .finally(() => iModal.hide());
}

listDailyOrders = () => {
  loading();
  getDailyOrders().then((res) => setStorage('dailyOrders', res))
    .catch(() => setStorage('status', false))
    .finally(() => renderDailyOrders());
}

listOrders = (date, full) => {
  getOrders(date).then((res) => setStorage('orders', res))
    .catch(() => setStorage('status', false))
    .finally(() => renderOrders(date, !full));
}

alterStatus = (date, hash, status) => {
  changeStatus(date, hash, status).then((res) => [notify('success', res.mensagem), listOrders(date, false)])
    .catch((err) => fixedError(err))
    .finally(() => iModal.hide());
}

cancelItem = (date, hash, status) => {
  deleteOrder(date, hash, status).then((res) => [notify('success', res.mensagem), listOrders(date, false)])
    .catch((err) => fixedError(err))
    .finally(() => iModal.hide());
}