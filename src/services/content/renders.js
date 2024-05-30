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

renderAuth = () => {
  const app = JSON.parse(localStorage.getItem('app'));
  const section = sessionStorage.getItem('Auth');
  content.innerHTML = ``;
  if (!app.status) srvFail()
  else if (section) { console.log('Autorizado!'); init() }
  else {
    content.innerHTML = `
    <div class="transition">
      <div id="auth" class="row mx-0 align-items-center justify-content-around">
        <div class="col-md-6 col-lg-4 p-3 border border-white rounded">
          <label for="passAuth" class="w-100 text-start">Autorização: </label>
          <input id="passAuth" type="password" class="form-control my-2" placeholder="Senha de Acesso:" />
          <botton onclick="auth()" class="btn btn-sm btn-success border border-white">Acessar<i class="bi-check2-circle ps-2"></i></button>
        </div>
      </div>
    </div>`
    passAuth.value = '';
    passAuth.addEventListener('keypress', (event) => { if (event.key == 'Enter') auth(); })
  }
}

init = () => {
  const app = JSON.parse(localStorage.getItem('app'));
  content.innerHTML = ``;
  if (!app.status) srvFail()
  else {
    content.innerHTML = `
    <div class="transition">
      <h3 class="col-12 pt-3 m-0">Módulos:</h3>
      <div id="home" class="row mx-0 align-items-center justify-content-around">
        <div onclick="settings();" class="col-md-auto p-3 card border-white bg-secondary" style="--bs-bg-opacity: .85;">
          <h2 class="my-auto">Config.</h2>
        </div>
        <div onclick="listProd();" class="col-md-auto p-3 card border-white bg-primary" style="--bs-bg-opacity: .85;">
          <h2 class="my-auto">Produtos</h2>
        </div>
        <div onclick="listDailyOrders()" class="col-md-auto p-3 card border-white bg-success" style="--bs-bg-opacity: .85;">
          <h2 class="my-auto">Pedidos</h2>
        </div>
      </div>
    </div>`
  }
}

renderSettings = () => {
  const app = JSON.parse(localStorage.getItem('app'));
  content.innerHTML = ``;
  if (!app.status) srvFail()
  else {
    content.innerHTML = `<div id="formSettings" class="row mx-0 mt-3 justify-content-center transition">
      <div class="col-lg-6 border border-white rounded">
        <h3 class="m-0 my-2">Configurações:</h3>
        <hr class="my-2">
        <label for="confImg" style="cursor:pointer;">
          <img id="loadImg" src="" class="rounded" width="150px" height="150px" /></label>
        <input id="confImg" type="file" class="d-none my-2"/>
        <input id="confName" type="text" placeholder="Nome" class="form-control ms-auto my-2" />
        <input id="confPIX" type="text" placeholder="PIX" class="form-control ms-auto my-2" />
        <textarea id="confMsg" type="text" placeholder="Mensagem" row="3" class="form-control ms-auto my-2"> </textarea>
        <hr class="my-2">
        <input id="passAuth" type="password" placeholder="Senha de Acesso" class="form-control ms-auto my-2" />
        <hr class="my-2">
        <div class="row justify-content-between mx-0 my-3">
          <div class="col-auto">
            <button onclick="init();" class="btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
          </div>
          <div class="col-auto">
            <button onclick="createSettings()" class="btn btn-sm btn-success border-white"><i class="bi-disc me-1 align-middle"></i>Salvar</button>
          </div>
        </div>
      </div>
    </div>`;
    confImg.addEventListener('change', (event) => {
      var reader = new FileReader();
      reader.onload = () => {
        var dataURL = reader.result;
        loadImg.src = dataURL;
      };
      reader.readAsDataURL(event.target.files[0]);
    });
    if (app.settings) {
      if (app.settings.image) loadImg.src = (app.settings.image || '')
      confName.value = (app.settings.company || '')
      confPIX.value = (app.settings.PIX || '')
      confMsg.value = (app.settings.description || '')
      passAuth.value = (app.settings.auth || '')
    }
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
    content.innerHTML = `<div id="formProd" class="row mx-0 mt-3 justify-content-center transition">
      <div class="col-lg-6 border border-white rounded">
        <h3 class="m-0 my-2">Cadastro</h3>
        <hr class="my-2">
        <input id="prodDesc" type="text" placeholder="Descrição" class="form-control my-2" />
        <input id="prodValue" type="number" placeholder="R$(min:0.01)" min="0.01" class="form-control ms-auto my-2 w-50" />
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
    app.dailyOrders.map(o => dailyOrders += `<div onclick="listOrders('${o.file}',true)" class="col-6 col-lg-3 py-3 px-lg-5">
        <div class="card border-warning text-warning-emphasis pointer">
          <i class="bi-journal-medical pb-3 fs-2"></i>
          ${formatDate(o.file)}
          <small class="m-0">(${o.qtd}) ${formatMoney(o.total)}</small>
        </div>
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
  let resume = { x: 0, paid: 0, y: 0, pending: 0, row: '' };

  theme = (status) => {
    switch (status) {
      case 'started': color = 'primary'; break;
      case 'preparing': color = 'secondary'; break;
      case 'paid': color = 'success'; break;
      case 'canceled': color = 'danger'; break;
    }
    return color;
  }

  checkedAll = () => {
    checkS.checked = checkAll.checked;
    checkP.checked = checkAll.checked;
    checkPg.checked = checkAll.checked;
    checkC.checked = checkAll.checked;
    search();
  }

  search = () => {
    clearInterval(myRefresh);
    myRefresh = setTimeout(() => {
      listOrders(date, false);
    }, 30000);
    orders = '';
    filtro = '';
    validStatus = [];
    if (checkS.checked) validStatus.push('started');
    if (checkP.checked) validStatus.push('preparing');
    if (checkPg.checked) validStatus.push('paid');
    if (checkC.checked) validStatus.push('canceled');
    if (txtSearch.value) filtro = txtSearch.value;
    checkAll.checked = (checkS.checked && checkP.checked && checkPg.checked && checkC.checked);
    mountOrder();
  }

  buscar = (payload) => (payload.toLowerCase()).split(`${filtro.toLocaleLowerCase()}`).length > 1;

  mountOrder = () => {
    resume = { x: 0, paid: 0, y: 0, pending: 0, row: '' };
    (app.orders).map(o => {
      itens = '';
      total = { x: 0, value: 0, row: '' };
      if (validStatus.includes(o.status) && (buscar(o.name) || buscar(o.device))) {
        (o.products).map((item, i) => {
          itens += `<div class="row m-0 justify-content-between${!item.status ? ' text-decoration-line-through' : ''}">
            <div class="col-auto text-start px-0 me-auto"> ${(item.status && o.status != 'canceled') ? `<span onclick="showModal('item: ${item.descricao}','cancelItem','${date},${o.hash},${item.hashItem}')"
              title="Cancelar" class="pointer px-1 bg-white rounded"><i class="bi-trash-fill text-danger"></i></span>` : ''}
            <span class="col-auto m-0 p-0">${item.qtd}x ${item.descricao} </span></div>
            <p class="col-auto m-0 ms-auto p-0">${formatMoney(item.valor)}</p></div>
          <hr class="my-2">`;

          if (item.status) total.x += parseFloat(item.qtd);
          if (item.status) total.value += (o.status != 'canceled') ? parseFloat(item.valor) : 0;
          if (i == ((o.products).length - 1)) total.row = `<div class="row m-0 justify-content-between">
          <p class="col-auto m-0 p-0">(${total.x}) Total </p>
          <p class="col-auto  m-0 p-0"><b>${formatMoney(total.value)}</b></p></div>`;

          if (['paid'].includes(o.status) && item.status) { resume.x += item.qtd; resume.paid += parseFloat(item.valor) };
          if (['started', 'preparing'].includes(o.status) && item.status) { resume.y += item.qtd; resume.pending += parseFloat(item.valor) };
        });
        orders += `<div class="col-lg-4 pb-3${(o.status == 'started') ? ' anime-shake' : ''}">
          <div class="card p-2 p-lg-3 border-white text-white bg-${theme(o.status)}" style="--bs-bg-opacity: .7;">
            <h4 class="my-0 align-baseline">${o.name}</h4><small style="font-size:0.675em;">(${o.device})</small>
            <hr class="my-2">
            <div class="row mx-0 justify-content-around">
              <div onclick="alterStatus('${date}','${o.hash}','started')" title="Novo" class="col-auto px-2 me-1 pointer border border-white rounded bg-primary">N</div>
              <div onclick="alterStatus('${date}','${o.hash}','preparing')" title="Preparar" class="col-auto px-2 me-1 pointer border border-white rounded bg-secondary">P</div>
              <div onclick="alterStatus('${date}','${o.hash}','paid')" title="Pagar" class="col-auto px-2 me-1 pointer border border-white rounded bg-success">$</div>
              <div onclick="alterStatus('${date}','${o.hash}','canceled')" title="Cancelar" class="col-auto px-1 me-1 pointer border border-white rounded bg-danger">C</div>
              <div onclick="showModal('pedido de ${o.name}','alterStatus','${date},${o.hash},deleted')" title="Deletar" class="col-auto px-1 ms-3 pointer border border-white rounded bg-danger"><i class="bi-trash"></i></div>
            </div>
            <hr class="my-2">
             ${itens} 
             ${total.row}
          </div>
        </div>`;
      }
    });
    resume.row = `<div class="col-12 px-0 pt-2 fs-6 text-center"><small>(${resume.x}) Pagos: ${formatMoney(resume.paid)}</small><small class="px-2">|</small><small>(${resume.y}) Aberto: ${formatMoney(resume.pending)}</small></div>`;
    mountListOrders.innerHTML = `${(orders) ? `${resume.row}<hr class="my-2">${orders}` : '<p class="col-auto my-3 mx-auto">Essa lista está vazia!</p>'}`;
  }

  if (!app.status) srvFail()
  else {
    if (!att) content.innerHTML = `<div id="dailyOrders" class="transition">
      <div class="row mx-0 my-3 align-items-center justify-content-between">
        <div class="col-auto ps-0">
          <button onclick="listDailyOrders();clearInterval(myRefresh);" class="btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
        </div>
        <div class="col col-md-6 col-lg-4 px-0 me-lg-1 ms-auto">
          <input onkeyup="search()" ondblclick="txtSearch.value='';search()" id="txtSearch" type="text" class="form-control form-control-sm" placeholder="Pesquisar..." />
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
          <div class="border rounded px-1">
            <input onclick="checkedAll()" id="checkAll" type="checkbox" class="align-middle" />
          </div>
        </div>
      </div>
      <h3 class="m-0 my-2">Pedidos: ${formatDate(date)}</h3>
      <div id="mountListOrders" class="row mx-0 list border rounded"></div>`
    search();
  }
}