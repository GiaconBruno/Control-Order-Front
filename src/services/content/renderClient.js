srvFail = () => content.innerHTML = `<h3 class="mt-4">Servidor Offline!</h3>
  <buttom onclick="start();" class="btn btn-secondary border-white text-black">Atualizar</buttom>`;

let myAlert = Function;
notify = (status, msg) => {
  clearInterval(myAlert)
  notification.innerHTML = `<div class="row mx-0 p-2 text-${status} align-items-center transition bg-white rounded">
    <div class="col-auto px-0"><i class="bi-${status == 'success' ? 'check' : 'x'}-circle fs-4 me-1 align-middle"></i></div>
    <div class="col-auto"><small>${msg}</small></div>
  </div>`;
  myAlert = setTimeout(() => notification.innerHTML = '', 3000);
}

initClient = () => {
  const client = JSON.parse(localStorage.getItem('client'));
  content.innerHTML = ``;

  shake = () => {
    txtUser.classList.remove("border-danger", "anime-shake");
    if (!txtUser.value) txtUser.classList.add("border-danger", "anime-shake");
  }

  nextStep = () => {
    if (!txtUser.value) { notify('danger', 'Insira seu nome!'); return }
    setStorage('info', { user: txtUser.value, disp: client.info.disp })
    listarProd();
  }

  copy = () => {
    try {
      copyPIX.classList.remove('d-none');
      copyPIX.select()
      document.execCommand('copy')
      copyPIX.classList.add('d-none');
      notify('success', 'A Chave PIX foi copiada!')
    } catch (error) {
      notify('danger', 'Falha ao copiar Chave PIX! (Dispositivo)')
    }
  }

  if (!client.status || !client.settings) srvFail()
  else {
    content.innerHTML = `
    <div id="client" class="row mx-0 my-3 align-items-center justify-content-around transition">
      <div class="col-lg-6 mx-auto py-3 border rounded">
        <img id="logoCompany" src="" class="rounded" width="150px" height="150px" />
        <h3 class="m-0 mt-2 mb-0">${client.settings.company}</h3>
        <small>${client.settings.description}</small>
        <hr class="my-1" />
        <div class="col-lg-8 mb-3 mx-auto">
          <h3 class="m-0 my-2">Informações:</h3>
          <input id="txtUser" onkeyup="shake()" type="text" placeholder="Nome" class="form-control my-3" />
          <input id="txtDisp" type="text" disabled placeholder="Dispositivo" class="form-control form-control-sm my-3 opacity-75" />
          <input id="copyPIX" type="text" class="d-none" />
          <div class="row mx-0 mt-3 justify-content-around">
            <button onclick="historic('${client.info.disp}')" class="col-auto btn btn-sm btn-secondary border-white"><i class="bi-card-checklist me-1 align-middle"></i>Histórico</button>
            <button onclick="nextStep()" class="col-auto btn btn-sm btn-success border-white">Começar<i class="bi-arrow-right-circle ms-1 align-middle"></i></button>
          </div>
        </div>
        <small>PIX: ${client.settings.PIX}<i onclick="copy()" class="bi-copy mx-1 align-middle pointer"></i></small>
      </div>
    </div>`
    if (client.settings.image) logoCompany.src = client.settings.image;
    if (client.info) txtUser.value = client.info.user;
    if (client.info) copyPIX.value = client.settings.PIX;
    txtDisp.value = client.info.disp; //(client.info) ? client.info.disp : `${navigator.userAgent.split(')')[0]})`;
    if (!txtUser.value) txtUser.focus();
    shake();
  }
}

mountListProducts = (force) => {
  const client = JSON.parse(localStorage.getItem('client'));
  content.innerHTML = ``;
  let order = {};
  client.products.sort((a, b) => {
    if (a.descricao > b.descricao) return 1
    if (a.descricao < b.descricao) return -1
    return 0
  })
  order = { // (client.order.products) ? client.order : {
    name: client.info.user, device: client.info.disp,
    products: client.products.filter(i => i.estoque > 0).map(p => { return { qtd: 0, descricao: p.descricao, valor: p.valor } })
  };

  // if (!force && order.products && order.products.reduce((t, v) => t + v.qtd, 0)) { renderResume(); return };

  loadDefault = () => {
    clientListProd.innerHTML = '';
    order.products.map((p, i) => clientListProd.innerHTML += `<div class="row mx-0 my-2 align-items-center">
          <div class="col-6 d-flex align-items-center">
            <i onclick="choice('minus', ${i})" class="bi-patch-minus pointer fs-3 align-middle"></i>
            <div class="mx-3 px-2 bg-white rounded fs-5 text-center text-secondary align-middle">${p.qtd}</div>
            <i onclick="choice('plus', ${i})" class="bi-patch-plus pointer fs-3 align-middle"></i>
          </div>
          <div class="col-6 fs-5 text-end ms-auto">${formatMoney(p.valor)}</div>
          <div class="col-12 fs-5 text-start me-auto">${p.descricao}</div>
        </div><hr class="my-0" />`
    );
  }

  choice = (type, pos) => {
    (type == 'plus') ? order.products[pos].qtd++ : order.products[pos].qtd = Math.max(order.products[pos].qtd - 1, 0)
    loadDefault();
  }

  clearOrder = () => {
    order = {
      name: client.info.user, device: client.info.disp
    };
    setStorage('order', order);
    listarProd();
  }

  confirmOrder = () => {
    if (!order.products.reduce((t, v) => t + v.qtd, 0)) { notify('danger', 'Inclua ao menos um item!'); return };
    setStorage('order', order);
    renderResume();
  }

  if (!client.status || !client.settings) srvFail()
  else {
    content.innerHTML = `
      <div id="clientProd" class="row mx-0 my-3 align-items-center justify-content-around transition">
        <div class="col-lg-6 mx-auto px-2 py-3 border rounded">
          <h3 class="m-0 mb-0">${client.settings.company}</h3>
          <small>${client.settings.description}</small>
          <hr class="my-2" />
          <div id="clientListProd"></div>
          <hr class="my-0 mb-2" />
          <div class="row mx-0 justify-content-around">
            <button onclick="primary()" class="col-auto btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
            <!-- <button onclick="clearOrder()" class="col-auto btn btn-sm btn-danger border-white"><i class="bi-trash me-1 align-middle"></i>Limpar</button> -->
            <button onclick="confirmOrder()" class="col-auto btn btn-sm btn-primary border-white"><i class="bi-check-circle me-1 align-middle"></i>Confirmar</button>
          </div>
        </div>
      </div>`;
    loadDefault();
  }
}

renderResume = () => {
  const client = JSON.parse(localStorage.getItem('client'));
  content.innerHTML = ``;
  let itens = '';
  let total = { x: 0, value: 0, row: '' };

  if (!client.status || !client.settings) srvFail()
  else {
    client.order.products.filter(p => p.qtd > 0).map((item, i) => {
      itens += `<div class="row mx-0 my-2 justify-content-between">
        <span class="col-auto m-0 p-0">${item.qtd}x ${item.descricao} </span>
        <p class="col-auto m-0 ms-auto p-0">${formatMoney(item.qtd * item.valor)}</p>
      </div><hr class="my-0">`;
      total.x += item.qtd;
      total.value += item.qtd * item.valor;
      total.row = `<div class="row m-0 justify-content-between">
        <p class="col-auto m-0 p-0">(${total.x}) Total </p>
        <p class="col-auto m-0 p-0"><b>${formatMoney(total.value)}</b></p></div>`
    })

    content.innerHTML = `
    <div id="orderResume" class="row mx-0 my-3 align-items-center justify-content-around transition">
      <div class="col-lg-4 mx-auto py-2 border rounded">
        <section>
          <div class="card p-2 p-lg-3 border-white text-white bg-primary" style="--bs-bg-opacity: .7;">
            <h4 class="my-0 align-baseline">${client.order.name}</h4>
            <hr class="my-2">
            <div id="resumeItens">${itens}</div>
            <hr class="my-0 mb-2" />
            ${total.row}
            <small style="font-size:0.675em;">(${client.order.device})</small>
          </div>
        </section>
        <div class="row mx-0 mt-2 justify-content-around">
          <button onclick="listarProd()" class="col-auto btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
          <button onclick="finishOrder()" class="col-auto btn btn-sm btn-success border-white"><i class="bi-patch-check me-1 align-middle"></i>Finalizar</button>
        </div>
      </div>
    </div>`
  }
}

renderHistoric = () => {
  const client = JSON.parse(localStorage.getItem('client'));
  content.innerHTML = ``;
  let color = '';
  let itens = '';

  theme = (status) => {
    switch (status) {
      case 'started':
      case 'preparing': color = 'primary'; break;
      case 'paid': color = 'success'; break;
      case 'canceled': color = 'danger'; break;
    }
    return color;
  }

  loadProds = (product) => {
    product.map((item, i) => {
      itens += `<div class="row m-0 justify-content-between text-${theme(item.status)}${(item.status == 'canceled') ? ' text-decoration-line-through' : ''}">
        <span class="col-auto m-0 p-0">${item.qtd}x ${item.descricao} </span>
        <p class="col-auto my-0 ms-auto p-0">${formatMoney(item.valor)}</p>
      </div>
      ${i != (product.length - 1) ? '<hr class="my-2">' : ''}`;
    })
    return itens;
  }

  if (!client.status) srvFail();
  else if (!(client.historic).length)
    content.innerHTML = `
    <div id="empyt" class="row mx-0 my-3 align-items-center justify-content-around transition">
      <div class="col-lg-4 mx-auto py-3 border rounded">
        <p class="col-auto my-3 mx-auto">Nenhum pedido localizado!</p>
      </div>
      <div class="row mx-0 mt-3 justify-content-around">
        <button onclick="start()" class="col-auto btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
      </div>
    </div>`
  else {
    let history = '';

    client.historic.map(order => {
      itens = '';
      loadProds(order.products);
      history += `
        <div class="card p-2 p-lg-3 mb-2 border-white bg-default" style="--bs-bg-opacity: .7;">
          <small style="font-size:0.775em;">${formatDate(order.time)}</small>
          <hr class="my-2">
          ${itens}
          <hr class="my-2">
          ${(order.pending.qtd) ? `<div class="row m-0 justify-content-between text-primary">
            <p class="col-auto m-0 p-0">(${order.pending.qtd}) Pendente: </p>
            <p class="col-auto  m-0 p-0"><b>${formatMoney(order.pending.valor)}</b></p></div>` : ''}
          ${(order.total.qtd) ? `<div class="row m-0 justify-content-between text-success">
            <p class="col-auto m-0 p-0">(${order.total.qtd}) Pago: </p>
            <p class="col-auto  m-0 p-0"><b>${formatMoney(order.total.valor)}</b></p></div>` : ''}
        </div>`
    })

    content.innerHTML = `
      <div id="historic" class="row mx-0 my-3 align-items-center justify-content-around transition">
        <h3 class="m-0 my-2">Histórico</h3>
        <div class="col-lg-4 mx-auto px-0 border rounded">
          <h4 class="my-0 align-baseline">${client.info.user}</h4>
          <div id="orders">${history}</div>
          <small style="font-size:0.675em;">(${client.info.disp})</small>
        </div>
        <div class="row mx-0 mt-3 justify-content-around">
          <button onclick="start()" class="col-auto btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
        </div>
      </div>`
  }
}