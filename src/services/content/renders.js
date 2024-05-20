srv();

srvFail = () => content.innerHTML = `<h3 class="mt-4">Servidor Offline!</h3>
  <buttom onclick="srv();" class="btn btn-secondary border-white text-black">Atualizar</buttom>`;

let alert = Function;
notify = (status, msg) => {
  clearInterval(alert)
  notification.innerHTML = `<div class="row mx-0 p-2 text-${status} align-items-center transition bg-white rounded">
    <div class="col-auto px-0"><i class="bi-${status == 'success' ? 'check' : 'x'}-circle fs-4 me-1 align-middle"></i></div>
    <div class="col-auto"><small>${msg}</small></div>
  </div>`;
  alert = setTimeout(() => notification.innerHTML = '', 3000);
}

const iModal = new bootstrap.Modal(modalConfirm, {});

init = () => {
  const app = JSON.parse(localStorage.getItem('app'));
  content.innerHTML = ``;
  if (!app.status) srvFail()
  else {
    content.innerHTML = `
    <div id="home" class="row mx-0 align-items-center justify-content-around transition">
      <div onclick="listProd();" class="col-md-auto px-3 py-3 card border-white bg-primary" style="--bs-bg-opacity: .85;">
        <h2 class="my-auto">Produtos</h2>
      </div>
      <div onclick="listDailyOrders()" class="col-md-auto px-3 py-3 card border-white bg-success" style="--bs-bg-opacity: .85;">
        <h2 class="my-auto">Pedidos</h2>
      </div>
    </div>`
  }
}

renderProducts = () => {
  const app = JSON.parse(localStorage.getItem('app'));
  content.innerHTML = ``;
  let prod = '';
  if (!app.status) srvFail()
  else {
    (app.products.length) ? app.products.map(p =>
      prod += `<div class="row align-items-center mx-0">
        <div onclick="modifyProducts('${p.hash}')" class="col-auto pointer px-2"><i class="bi-pencil-fill text-primary"></i></div>
        <div onclick="deleteProd('${p.descricao}','${p.hash}')" class="col-auto pointer px-2"><i class="bi-trash-fill text-danger"></i></div>
        <div class="col px-0">
          <div class="row justify-content-between mx-0">
            <div class="col-12 col-lg px-2 text-start">${p.descricao}</div>
            <div class="col-auto col-lg-2 px-2 text-end">${formatMoney(p.valor)}</div>
            <div class="col-auto col-lg-2 px-2 text-end">${p.estoque}</div>
          </div>
        </div>
      </div>
      <hr class="m-0">`) : `<hr class="m-0">`

    content.innerHTML = `<div id="products" class="transition">
      <div class="row justify-content-between mx-0 my-3">
        <div class="col-auto">
          <button onclick="srv();" class="btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
        </div>
        <div class="col-auto">
          <button onclick="modifyProducts('')" class="btn btn-sm btn-success border-white"><i class="bi-plus-circle me-1 align-middle"></i>Novo</button>
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
}

modifyProducts = (hash) => {
  const app = JSON.parse(localStorage.getItem('app'));
  content.innerHTML = ``;
  if (!app.status) srvFail()
  else {
    content.innerHTML = `<div id="formProd" class="row mx-0 justify-content-center transition">
      <div class="col-lg-6 border border-white rounded">
        <h3 class="m-0 my-2">Cadastro</h3>
        <hr class="my-2">
        <input id="prodDesc" type="text" placeholder="Descrição" class="form-control my-2" />
        <input id="prodValue" type="number" placeholder="Valor R$" min="0.01" class="form-control ms-auto my-2 w-50" />
        <input id="prodStq" type="number" placeholder="Estoque" min="0" class="form-control ms-auto my-2 w-50" />
        <hr class="my-2">
        <div class="row justify-content-between mx-0 my-3">
          <div class="col-auto">
            <button onclick="listProd();" class="btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
          </div>
          <div class="col-auto">
            <button onclick="createChangeProd('${hash}')" class="btn btn-sm btn-success border-white"><i class="bi-disc me-1 align-middle"></i>Salvar</button>
          </div>
        </div>
      </div>
    </div>`;
    if (hash) {
      const item = app.products.find(p => p.hash == hash);
      prodDesc.value = item.descricao
      prodValue.value = item.valor
      prodStq.value = item.estoque
    }
  }
}

deleteProd = (item, hash) => {
  deleteItem.innerHTML = item;
  iModal.show();
  confirmRemove.setAttribute('onclick', `removeProd('${hash}')`)
}

renderDailyOrders = () => {
  const app = JSON.parse(localStorage.getItem('app'));
  content.innerHTML = ``;
  let dailyOrders = '';
  if (!app.status) srvFail()
  else {
    app.dailyOrders.map(o => dailyOrders += `<div onclick="listOrders('${o}')" class="col-6 col-lg-3 py-3 px-lg-5">
        <div class="card border-warning text-warning-emphasis pointer">
          <i class="bi-journal-medical pb-3 fs-2"></i>${formatDate(o)}</div>
      </div>`)
    content.innerHTML = `<div id="dailyOrders" class="transition">
      <div class="row justify-content-between mx-0 my-3">
        <div class="col-auto">
          <button onclick="srv();" class="btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
        </div>
      </div>
      <h3 class="m-0 my-2">Pedidos</h3>
      <div class="row mx-0 border rounded list position-relative">${dailyOrders}</div>
    </div>`
  }
}

renderOrders = (date) => {
  const app = JSON.parse(localStorage.getItem('app'));
  content.innerHTML = ``;
  let orders = '';
  let itens = '';
  let total = { x: 0, value: 0, row: '' };
  if (!app.status) srvFail()
  else {
    (app.orders).map(o => {
      itens = '';
      total = { x: 0, value: 0, row: '' };
      (o.products).map((item, i) => {
        itens += `<div class="row m-0 justify-content-between">
          <p class="col-auto m-0 p-0">1x ${item.descricao} </p>
          <p class="col-auto  m-0 p-0">${formatMoney(item.valor)}</p></div>
        <hr class="my-2">`;
        total.x++;
        total.value += item.valor;
        if (i == ((o.products).length - 1)) total.row = `<div class="row m-0 justify-content-between">
          <p class="col-auto m-0 p-0">(${total.x}) Total </p>
          <p class="col-auto  m-0 p-0"><b>${formatMoney(total.value)}</b></p></div>`
      });
      orders += `<div class="col-lg-4 py-3">
          <div class="card p-2 p-lg-3 border-white">
            <h4 class="my-2">Nome: ${o.name}</h4>
            <p class="m-0">Dispositivo: ${o.device}</p>
            <hr class="my-2">
             ${itens} 
             ${total.row}
          </div>
        </div>`;
    });
    content.innerHTML = `<div id="dailyOrders" class="transition">
      <div class="row justify-content-between mx-0 my-3">
        <div class="col-auto">
          <button onclick="renderDailyOrders();" class="btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
        </div>
      </div>
      <h3 class="m-0 my-2">Pedidos: ${formatDate(date)}</h3>
      <div class="row mx-0 list border rounded">
        ${(orders.length) ? orders : '<p class="col-auto my-3 mx-auto">Essa lista está vazia!</p>'}
      </div>`
  }
}