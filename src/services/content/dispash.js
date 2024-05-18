getStorage = () => {
  let app = JSON.parse(localStorage.getItem('app'))
  if (!app)[localStorage.setItem('app', JSON.stringify({})), app = {}]
}
getStorage();
setStorage = (att, value) => {
  getStorage();
  app[att] = value;
  localStorage.setItem('app', JSON.stringify(app))
}

loading = () => {
  content.innerHTML = `
  <div class="row mx-0 justify-content-center">
    <div class="px-0 icon-spin"><i class="bi-arrow-clockwise" style="font-size:75px;color:#fff;"></i></div>
  </div>`;
}

const srv = () => {
  content.innerHTML = ``;
  loading();
  server().then((res) => setStorage('status', res))
    .catch(() => setStorage('status', false))
    .finally(() => init());
}

const products = () => {
  content.innerHTML = ``;
  loading();
  getProducts().then((res) => setStorage('products', res))
    .catch(() => setStorage('status', false))
    .finally(() => renderProducts());
}