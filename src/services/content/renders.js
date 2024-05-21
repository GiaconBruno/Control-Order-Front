srv();

srvFail = () => content.innerHTML = `<h3 class="mt-4">Servidor Offline!</h3>
  <buttom onclick="srv();" class="btn btn-secondary border-white text-black">Atualizar</buttom>`;

let myAlert = Function;
notify = (status, msg) => {
  clearInterval(myAlert)
  notification.innerHTML = `<div class="row mx-0 p-2 text-${status} align-items-center transition bg-white rounded">
    <div class="col-auto px-0"><i class="bi-${status == 'success' ? 'check' : 'x'}-circle fs-4 me-1 align-middle"></i></div>
    <div class="col-auto"><small>${msg}</small></div>
  </div>`;
  myAlert = setTimeout(() => notification.innerHTML = '', 3000);
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
        <div onclick="showModal('produto: ${p.descricao}','removeProd','${p.hash}')" class="col-auto pointer px-2"><i class="bi-trash-fill text-danger"></i></div>
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

showModal = (item, action, opts) => {
  deleteItem.innerHTML = item;
  iModal.show();
  confirmRemove.setAttribute('onclick', `${action}('${opts.split(',').join("','")}')`)
}

renderDailyOrders = () => {
  const app = JSON.parse(localStorage.getItem('app'));
  content.innerHTML = ``;
  let dailyOrders = '';
  if (!app.status) srvFail()
  else {
    app.dailyOrders.map(o => dailyOrders += `<div onclick="listOrders('${o}',true)" class="col-6 col-lg-3 py-3 px-lg-5">
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

let myRefresh = Function;
renderOrders = (date, att) => {
  let app = JSON.parse(localStorage.getItem('app'));
  if (!att) content.innerHTML = ``;
  let orders = '';
  let itens = '';
  let filtro = '';
  let validStatus = ['started', 'preparing', 'paid', 'canceled'];
  let total = { x: 0, value: 0, row: '' };

  theme = (status) => {
    switch (status) {
      case 'started': color = 'primary'; break;
      case 'preparing': color = 'secondary'; break;
      case 'paid': color = 'success'; break;
      case 'canceled': color = 'danger'; break;
    }
    return color;
  }

  search = () => {
    clearInterval(myRefresh);
    myRefresh = setTimeout(() => {
      listOrders(date, false);
    }, 5000);
    orders = '';
    filtro = '';
    validStatus = [];
    if (checkS.checked) validStatus.push('started');
    if (checkP.checked) validStatus.push('preparing');
    if (checkPg.checked) validStatus.push('paid');
    if (checkC.checked) validStatus.push('canceled');
    if (txtSearch.value) filtro = txtSearch.value;
    mountOrder();
  }

  buscar = (payload) => (payload.toLowerCase()).split(`${filtro.toLocaleLowerCase()}`).length > 1;

  mountOrder = () => {
    (app.orders).map(o => {
      itens = '';
      total = { x: 0, value: 0, row: '' };
      (o.products).map((item, i) => {
        itens += `<div class="row m-0 justify-content-between${!item.status ? ' text-decoration-line-through' : ''}">
          <div onclick="showModal('item: ${item.descricao}','cancelItem','${date},${o.hash},${item.hashItem}')" class="col-auto px-0 me-2">
          ${(item.status && o.status != 'canceled') ? '<span class="pointer px-1 bg-white rounded"><i class="bi-trash-fill text-danger"></i></span>' : ''}
          <span class="col-auto m-0 p-0">1x ${item.descricao} </span></div>
          <p class="col-auto m-0 p-0">${formatMoney(item.valor)}</p></div>
        <hr class="my-2">`;
        if (item.status) total.x++;
        if (item.status) total.value += (o.status != 'canceled') ? item.valor : 0;
        if (i == ((o.products).length - 1)) total.row = `<div class="row m-0 justify-content-between">
          <p class="col-auto m-0 p-0">(${total.x}) Total </p>
          <p class="col-auto  m-0 p-0"><b>${formatMoney(total.value)}</b></p></div>`
      });
      if (validStatus.includes(o.status) && (buscar(o.name) || buscar(o.device)))
        orders += `<div class="col-lg-4 py-3${(o.status == 'started') ? ' anime-shake' : ''}">
          <div class="card p-2 p-lg-3 border-white text-white bg-${theme(o.status)}" style="--bs-bg-opacity: .7;">
            <h4 class="my-0 align-baseline">${o.name} <small class="fs-6">(${o.device})</small></h4>
            <hr class="my-2">
            <div class="row mx-0 justify-content-around">
              <div onclick="alterStatus('${date}','${o.hash}','started')" class="col-auto px-2 me-1 pointer border border-white rounded bg-primary">S</div>
              <div onclick="alterStatus('${date}','${o.hash}','preparing')" class="col-auto px-2 me-1 pointer border border-white rounded bg-secondary">P</div>
              <div onclick="alterStatus('${date}','${o.hash}','paid')" class="col-auto px-2 me-1 pointer border border-white rounded bg-success">$</div>
              <div onclick="alterStatus('${date}','${o.hash}','canceled')" class="col-auto px-1 me-1 pointer border border-white rounded bg-danger">C</div>
              <div onclick="showModal('pedido de ${o.name}','alterStatus','${date},${o.hash},deleted')" class="col-auto px-1 ms-3 pointer border border-white rounded bg-danger"><i class="bi-trash"></i></div>
            </div>
            <hr class="my-2">
             ${itens} 
             ${total.row}
          </div>
        </div>`;
    });
    mountListOrders.innerHTML = `${(orders.length) ? orders : '<p class="col-auto my-3 mx-auto">Essa lista está vazia!</p>'}`;
  }

  if (!app.status) srvFail()
  else {
    if (!att) content.innerHTML = `<div id="dailyOrders" class="transition">
      <div class="row mx-0 my-3 align-items-center justify-content-between">
        <div class="col-auto ps-0">
          <button onclick="renderDailyOrders();clearInterval(myRefresh);" class="btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
        </div>
        <div class="col col-md-6 col-lg-4 px-0 me-lg-1 ms-auto">
          <input onkeyup="search()" id="txtSearch" type="text" class="form-control form-control-sm" placeholder="Pesquisar..." />
        </div>
        <div class="col-auto px-0 mt-1 mt-md-0 d-flex align-items-center">
          <div class="border rounded px-1 me-1 bg-primary" style="--bs-bg-opacity: .7;">
            <input onclick="search()" id="checkS" type="checkbox" class="align-middle" checked />
            <label for="checkS">Novos</label>
          </div>
          <div class="border rounded px-1 me-1 bg-secondary">
            <input onclick="search()" id="checkP" type="checkbox" class="align-middle" checked />
            <label for="checkP">Preparando</label>
          </div>
          <div class="border rounded px-1 me-1 bg-success">
            <input onclick="search()" id="checkPg" type="checkbox" class="align-middle" />
            <label for="checkPg">Pagos</label>
          </div>
          <div class="border rounded px-1 bg-danger">
            <input onclick="search()" id="checkC" type="checkbox" class="align-middle" />
            <label for="checkC">Cancelado</label>
          </div>
        </div>
      </div>
      <h3 class="m-0 my-2">Pedidos: ${formatDate(date)}</h3>
      <div id="mountListOrders" class="row mx-0 list border rounded"></div>`
    search();
  }
}