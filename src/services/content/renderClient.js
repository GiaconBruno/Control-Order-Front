start();

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

initClient = () => {
  const client = JSON.parse(localStorage.getItem('client'));
  content.innerHTML = ``;

  shark = () => {
    txtUser.classList.remove("border-danger", "anime-shake");
    if (!txtUser.value) txtUser.classList.add("border-danger", "anime-shake");
  }

  next = () => {
    if (!txtUser.value && !txtDisp.value) notify('danger', 'Insira seu nome!')
    setStorage('info', { user: txtUser.value, disp: txtDisp.value })
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
          <input id="txtUser" onkeyup="shark()" type="text" placeholder="Nome" class="form-control my-3" />
          <input id="txtDisp" type="text" disabled placeholder="Dispositivo" class="form-control form-control-sm my-3 opacity-75" />
          <input id="copyPIX" type="text" class="d-none" />
          <button onclick="next()" class="btn btn-sm btn-success border-white">Começar<i class="bi-arrow-right-circle ms-1 align-middle"></i></button>
        </div>
        <small>PIX: ${client.settings.PIX}<i onclick="copy()" class="bi-copy mx-1 align-middle"></i></small>
      </div>
    </div>`
    if (client.settings.image) logoCompany.src = client.settings.image;
    if (client.info) txtUser.value = client.info.user;
    if (client.info) copyPIX.value = client.settings.PIX;
    txtDisp.value = (client.info) ? client.info.disp :
      `${navigator.userAgent.split(')')[0]})`;
    txtUser.focus();
    shark();
  }
}

mountOrder = () => {
  const client = JSON.parse(localStorage.getItem('client'));
  content.innerHTML = ``;
  if (!client.status || !client.settings) srvFail()
  else {
    content.innerHTML = `
    <div id="client" class="row mx-0 my-3 align-items-center justify-content-around transition">
      <div class="col-lg-6 mx-auto py-3 border rounded">
        <h3 class="m-0 mb-0">${client.settings.company}</h3>
        <small>${client.settings.description}</small>
        <hr class="my-1" />
        <div class="col-12 mx-auto">
          <h3 class="m-0 my-2">Lista de Itens</h3>
        </div>
        <hr class="my-1" />
        <div class="row mx-0 justify-content-around">
          <button onclick="start()" class="col-auto btn btn-sm btn-secondary border-white"><i class="bi-arrow-left-circle me-1 align-middle"></i>Voltar</button>
          <button onclick="order()" class="col-auto btn btn-sm btn-primary border-white"><i class="bi-check-circle me-1 align-middle"></i>Confirmar</button>
        </div>
      </div>
    </div>`
  }
}