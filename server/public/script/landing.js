// Creamos el AJAX request para el registro, login y la presentación de tarjetas
const regXHR = new XMLHttpRequest();
const logXHR = new XMLHttpRequest();
const carouselXHR = new XMLHttpRequest();

// Creo la función de registro
const register = () => {

  // Creo la URL para enviar la solicitud
  const regURL = "/passport/signup";

  // Tomo los elementos del DOM para enviar los datos
  let regUserName = document.getElementById("reg-user-name");
  let regEmail = document.getElementById("e-mail");
  let regPassword = document.getElementById("reg-password");
  const regResult = document.getElementById("reg-result");

  // Creamos el objeto a enviar con las credenciales
  const regUserBody = JSON.stringify({
    username: regUserName.value,
    email: regEmail.value,
    password: regPassword.value
  })

  // Cuando llega la respuesta, si se registró con éxito lleva al /home y sino limpia los campos y muestra el mensaje de error
  regXHR.onload = function () {
    let response = JSON.parse(this.response);
    regResult.innerText = response.message;
    if (response.success) {
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } else {
      regUserName.value = "";
      regEmail.value = "";
      regPassword.value = "";
    }
  }
  // Abro el AJAX XHR
  regXHR.open("POST", regURL);

  // Definimos el tipo de contenido y el envío de las credenciales
  regXHR.setRequestHeader("Content-Type", "application/json");
  regXHR.send(regUserBody);

};

// Creo la función de login
const login = () => {
  // Creo la URL para enviar la solicitud
  const logURL = "/passport/login";

  // Tomo los elementos del DOM para enviar los datos
  let logUserName = document.getElementById("log-user-name");
  let logPassword = document.getElementById("log-password");
  const logResult = document.getElementById("log-result");

  // Creamos el objeto a enviar con las credenciales
  const logUserBody = JSON.stringify({
    username: logUserName.value,
    password: logPassword.value
  })

  // Cuando llega la respuesta, si ingresó con éxito lleva al /home y sino limpia los campos y muestra el mensaje de error
  logXHR.onload = function () {
    let response = JSON.parse(this.response);
    logResult.innerText = response.message
    if (response.success && response.user) {
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } else {
      logUserName.value = "";
      logPassword.value = "";
    }
  }
  // Abro el AJAX XHR
  logXHR.open("POST", logURL);

  // Definimos el tipo de contenido y el envío de las credenciales
  logXHR.setRequestHeader("Content-Type", "application/json");
  logXHR.send(logUserBody);
};

// Creo la función para obtener las tarjetas de sueños
const getLastFiveDreams = () => {

  // Creo la URL para enviar la solicitud
  const carouselURL = "/explore/dreams-last-five";

  // Tomo los elementos del DOM para cargar los sueños
  const dream1 = document.getElementById("dream1");
  const dream2 = document.getElementById("dream2");
  const dream3 = document.getElementById("dream3");
  const dream4 = document.getElementById("dream4");
  const dream5 = document.getElementById("dream5");
  const dreams = [dream1, dream2, dream3, dream4, dream5];

  // Cuando llega la respuesta cargamos el contenido necesario en los elementos del DOM adquiridos
  carouselXHR.onload = function () {
    let response = JSON.parse(this.response);
    let iter = 0;
    response.dreams.forEach(element => {
      const anchor = document.createElement("a");
      anchor.setAttribute("href", `/explore/dreams/${element.oid}`);
      anchor.setAttribute("class", "card-link");
      const card = document.createElement("div");
      card.setAttribute("class", "card");
      const cardBody = document.createElement("div");
      cardBody.setAttribute("class", "card-body");
      const title = document.createElement("h5");
      title.setAttribute("class", "card title text-center");
      title.innerText = element.title;
      const summary = document.createElement("p");
      summary.setAttribute("class", "card-text")
      summary.innerText = element.abstract;
      anchor.appendChild(title);
      anchor.appendChild(summary);
      cardBody.appendChild(anchor);
      card.appendChild(cardBody);
      dreams[iter].appendChild(anchor);
      iter += 1;
    });

  };

  // Abro el AJAX XHR y el envío
  carouselXHR.open("GET", carouselURL);

  carouselXHR.send();
};

// Ejecuto la función en el script ni bien cargue
getLastFiveDreams();

// Listener para el envío de la solicitud de registro
const regSubmit = document.getElementById("reg-btn");
regSubmit.addEventListener("click", function (event) {
  // Evito el envío del formulario
  event.preventDefault();
  register();
});

// Listener para el envío de la solicitud de login
const logSubmit = document.getElementById("log-btn");
logSubmit.addEventListener("click", function (event) {
  // Evito el envío del formulario
  event.preventDefault();
  login();
});