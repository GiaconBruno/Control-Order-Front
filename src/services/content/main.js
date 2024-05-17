let srvStatus = false;
const srv = () => {
  content.innerHTML = ``;
  content.innerHTML = `
  <div class="row mx-0 justify-content-center">
    <div class="px-0 icon-spin"><i class="bi-arrow-clockwise" style="font-size:75px;color:#fff;"></i></div>
  </div>`;
  server().then((res) => srvStatus = res).finally(() => init());
}

srv();

const init = () => {
  content.innerHTML = ``;
  if (!srvStatus) content.innerHTML = `<h3 class="mt-4">Servidor Offline!</h3>
  <buttom class="btn btn-secondary border-white text-black" onclick="srv();">Atualizar</buttom>`;
  else content.innerHTML = `
  <div id="home" class="row mx-0 align-items-center justify-content-around">
    <div class="col-md-auto px-3 py-3 card border-white bg-primary" style="--bs-bg-opacity: .85;">
      <h2 class="my-auto">Produtos</h2>
    </div>
    <div class="col-md-auto px-3 py-3 card border-white bg-success" style="--bs-bg-opacity: .85;">
      <h2 class="my-auto">Pedidos</h2>
    </div>
  </div>`
}
