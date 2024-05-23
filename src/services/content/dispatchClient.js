getStorage = () => {
  let client = JSON.parse(localStorage.getItem('client'))
  if (!client) [localStorage.setItem('client', JSON.stringify({})), client = {}]
  return client;
}
getStorage();
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
    init()
  }
}

// Client
start = () => {
  server().then((res) => {
    setStorage('status', res);
    const client = JSON.parse(localStorage.getItem('client'));
    if (!client.info || !client.info.disp) client.info = { user: '', disp: res.reverse()[0] };
    localStorage.setItem('client', JSON.stringify(client))
  })
    .catch(() => setStorage('status', false))
    .finally(() => primary());
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
    .finally(() => mountOrder());
}