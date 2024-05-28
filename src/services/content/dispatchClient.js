getStorage = () => {
  let client = JSON.parse(localStorage.getItem('client'))
  if (!client) [localStorage.setItem('client', JSON.stringify({})), client = {}]
  return client;
}
setStorage = (att, value) => {
  const client = getStorage();
  client[att] = value;
  localStorage.setItem('client', JSON.stringify(client))
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
    start()
  }
}

// Client
start = () => {
  let client = '';
  server().then((res) => {
    setStorage('status', res);
    client = JSON.parse(localStorage.getItem('client'));
    if (!client.info || !client.info.disp) client.info = { user: '', disp: res.reverse()[0] };
    localStorage.setItem('client', JSON.stringify(client));
  })
    .catch(() => setStorage('status', false))
    .finally(() => primary());
  // .finally(() => (!client.info || (!client.info.user || !client.info.disp)) ? primary() : listarProd());
}

historic = (device) => {
  loading();
  getResume(device).then((res) => setStorage('historic', res.content))
    .catch(() => setStorage('status', false))
    .finally(() => renderHistoric());
}

primary = () => {
  loading();
  getSettings().then((res) => setStorage('settings', res))
    .catch(() => setStorage('status', false))
    .finally(() => initClient());
}

listarProd = () => {
  loading();
  getProducts().then((res) => setStorage('products', res))
    .catch(() => setStorage('status', false))
    .finally(() => mountListProducts());
}

finishOrder = () => {
  loading();
  const order = JSON.parse(localStorage.getItem('client')).order;
  order.products = order.products.filter(p => p.qtd > 0);
  createOrder(order).then((res) => [setStorage('order', {}), notify('success', res.mensagem)])
    .catch(() => setStorage('status', false))
    .finally(() => start());

}