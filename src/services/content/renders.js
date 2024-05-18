srv();
// products();

srvFail = () => content.innerHTML = `<h3 class="mt-4">Servidor Offline!</h3>
<buttom onclick="srv();" class="btn btn-secondary border-white text-black">Atualizar</buttom>`;

const init = () => {
  const app = JSON.parse(localStorage.getItem('app'));
  content.innerHTML = ``;
  if (!app.status) srvFail()
  else content.innerHTML = `
  <div id="home" class="row mx-0 align-items-center justify-content-around transition">
    <div onclick="products();" class="col-md-auto px-3 py-3 card border-white bg-primary" style="--bs-bg-opacity: .85;">
      <h2 class="my-auto">Produtos</h2>
    </div>
    <div onclick=""  class="col-md-auto px-3 py-3 card border-white bg-success" style="--bs-bg-opacity: .85;">
      <h2 class="my-auto">Pedidos</h2>
    </div>
  </div>`
}

const renderProducts = () => {
  const app = JSON.parse(localStorage.getItem('app'));
  if (!app.status) {
    srvFail();
    return
  };
  let prod = '';
  content.innerHTML = ``;
  (app.products.length) ? app.products.map(p =>
    prod += `
    <div class="row align-items-center mx-0">
      <div class="col-auto px-2"><i class="bi-pencil-fill text-primary"></i></div>
      <div class="col-auto px-2"><i class="bi-trash-fill text-danger"></i></div>
      <div class="col px-0">
        <div class="row justify-content-between mx-0">
          <div class="d-none">${p.hash}</div>
          <div class="col-12 col-lg px-2 text-start">${p.descricao}</div>
          <div class="col-auto col-lg-2 px-2 text-end">${formatMoney(p.valor)}</div>
          <div class="col-auto col-lg-2 px-2 text-end">${p.estoque}</div>
        </div>
      </div>
      </div>
      <hr class="m-0">`): `<hr class="m-0">`

  content.innerHTML = `<div id="products" class="transition">
  <div class="row justify-content-between mx-0 my-3">
    <div class="col-auto">
      <button onclick="srv();" class="btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
    </div>
    <div class="col-auto">
      <button onclick="" class="btn btn-sm btn-success border-white"><i class="bi-plus-circle me-1 align-middle"></i>Novo</button>
    </div>
  </div>
  <h3 class="m-0 my-2">Produtos</h3>
  <div class="tabled p-2 p-lg-3">
    <hr class="m-0">
    <div class="row align-items-center mx-0">
      <div class="col-auto" style="width:64px;"><i class="bi-gear"></i></div>
      <div class="col px-0">
        <div class="row justify-content-between mx-0">
        <div class="col-12 col-lg px-2 text-start fw-bold">Descrição</div>
        <div class="col-auto col-lg-2 px-2 text-end fw-bold">Valor</div>
        <div class="col-auto col-lg-2 px-2 text-end fw-bold">Saldo</div>
      </div>
      <div class="col-auto"></div>
      </div>
    </div>
    <hr class="m-0">
    <div class="itens">${prod}</div>
  </div>
</div>`;
}