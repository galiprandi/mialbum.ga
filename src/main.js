'use strict';
document.addEventListener('DOMContentLoaded', init);

function init() {
  if (DEV_MODE) console.warn('Running in DEV Mode');
  document.addEventListener('mouseup', eventManager);
  App.initAlbum();
}

function eventManager(event) {
  const { target } = event;
  const action = target.dataset['action'] || false;
  if (action) actionDispatcher(action);
}

function actionDispatcher(action) {
  if (DEV_MODE) console.info(action);

  switch (action) {
    case 'Open Panel Info':
      Slider.pause();
      Panel.closeAllPanels();
      Panel.open(Panel.panelInfo);
      break;

    case 'Abrir Panel Slider':
      Slider.play();
      Panel.closeAllPanels();
      Panel.open(Panel.panelSlider);
      toggleFullScreen();
      break;

    case 'Open Panel Gallery':
      Slider.pause();
      Panel.closeAllPanels();
      Panel.open(Panel.panelGallery);
      break;

    case 'Open Image Options':
      Slider.pause();
      Panel.open(Panel.panelImageOptions);
      break;

    case 'Close Image Options':
      Panel.close(Panel.panelImageOptions);
      Slider.play();
      break;

    case 'Próxima imágen':
      Slider.forward();
      break;

    case 'Imágen previa':
      Slider.backward();
      break;

    case 'Saltar a imágen':
      const image = Number(event.target.dataset.image);
      actionDispatcher('Abrir Panel Slider');
      Slider.changeImage(image);
      Slider.play();

      break;

    case 'Continuar la reproducción':
      actionDispatcher('Close Image Options');
      Slider.play();
      break;

    case 'Pausar la reproducción':
      Slider.pause();
      break;

    case 'Compartir en Facebook':
      shareTo('Facebook');
      actionDispatcher('Close Image Options');
      break;

    case 'Compartir en Whatsapp':
      shareTo('WhatsApp');
      actionDispatcher('Close Image Options');
      break;

    case 'Descargar Imágen':
      const src = App.album.image_src + App.album.slider.actual + App.album.cfgImgType;
      downloadCurrentImage(src);
      actionDispatcher('Close Image Options');
      break;
    case 'Cambiar a Pantalla Completa':
      toggleFullScreen();
      actionDispatcher('Close Image Options');
      break;

    default:
      break;
  }
}

const Slider = {
  container: document.getElementById('slider-image'),
  intervalID: null,

  timerStart() {
    const { rate } = App.album.slider;
    App.album.slider.status = true;
    this.intervalID = setInterval(() => {
      this.forward();
    }, rate);
  },

  timerPause() {
    for (var i = 1; i <= this.intervalID; i++) {
      clearInterval(i);
    }
  },

  play() {
    this.timerStart();
  },
  pause() {
    this.timerPause();
  },
  toggle() {
    console.log(arguments.callee.name);
  },

  forward() {
    let current = App.album.slider.actual;
    const last = App.album.cantidadFotos;
    next = current < last ? current + 1 : 1;
    this.changeImage(next);
  },

  backward() {
    let current = App.album.slider.actual;
    const last = App.album.cantidadFotos;
    next = current === 1 ? last : current - 1;
    this.changeImage(next);
  },

  changeImage(image) {
    const { image_src: path, cfgImgType: type } = App.album;
    const src = path + image + type;
    App.album.slider.actual = image;

    if (DEV_MODE) console.info(src);
    this.container.setAttribute('src', src);
  },
};

const Panel = {
  panelInfo: document.querySelector('.panel-info'),
  panelSlider: document.querySelector('.panel-slider'),
  panelImageOptions: document.querySelector('.panel-slider__options'),
  panelGallery: document.querySelector('.panel-gallery'),

  switchTo(panel) {
    this.closeAllPanels();
    this.open(panel);
  },

  open(panel) {
    panel.classList.add('active');
  },
  close(panel) {
    panel.classList.remove('active');
  },

  closeAllPanels() {
    this.panelInfo.classList.remove('active');
    this.panelSlider.classList.remove('active');
    this.panelGallery.classList.remove('active');
  },
};

const App = {
  album: {},

  async initAlbum() {
    try {
      const url = '../site/database/database.json';
      const response = await fetch(url);
      if (!response.ok) throw Error('No se puede cargar la bases de datos desde: ' + url);
      const data = await response.json();
      albumId = this.getAlbumId();
      const album = data.albumes[albumId] || false;

      if (!album || !album.autor) throw Error(`No existe el Album ${albumId}`);
      const autor = data.autores[album.autor];
      if (!autor.nombre) throw Error(`No existe el Autor ${album.autor}`);
      if (!album.activo)
        throw Error(
          'El álbum solicitado está inactivo, por favor contáctese al teléfono +54 381 5900868'
        );

      // Add autor
      album.autor = autor;

      // Add image_src
      album.image_src = album.cfgAlbumUrl + album.cfgImgUrl;

      // Add cover
      if (!album.cover) album.cover = `${album.image_src}3${album.cfgImgType}`;

      // Add sliderStatus
      album.slider = {
        rate: album.cfgSliderTimer,
        actual: 1,
        vistas: 0,
        status: false,
      };

      // Add album
      this.album = album;

      this.fillImageGallery();
      this.fillInfoPanel();
      this.loadBackgroundImage();
      if (DEV_MODE) console.info('Loading Album', album);
    } catch (error) {
      this.showErrorMessage(String(error).replace('Error:', ''));
      console.error(error);
      return false;
    }
  },

  getAlbumId() {
    return location.pathname.replace(/\//g, '');
  },

  loadBackgroundImage() {
    Panel.panelInfo.style.background = `url(${this.album.cover})`;
  },

  fillInfoPanel() {
    const {
      evento,
      fechaEvento: fecha,
      lugar,
      cantidadFotos: fotos,
      cfgSliderTimer: timer,
    } = this.album;
    const { nombre: autor, web, tel, mail: email } = this.album.autor;
    const parseDate = getParseDate(fecha);
    const imageAndTime = `${fotos} imágenes, ${((fotos * timer) / (timer * 10)).toFixed(
      1
    )} minutos.`;

    const container = document.querySelector('.panel-info__album-info');

    container.children[0].textContent = evento;
    container.children[1].textContent = parseDate;
    container.children[2].textContent = lugar;
    container.children[3].textContent = imageAndTime;
    container.children[5].textContent = autor;
    container.children[6].children[0].href = web;
    container.children[6].children[0].textContent = web;
    container.children[7].children[0].href = 'tel:' + tel;
    container.children[7].children[0].textContent = tel;
    container.children[8].children[0].href = 'mailto:' + email;
    container.children[8].children[0].textContent = email;
  },

  fillImageGallery() {
    const fragment = document.createDocumentFragment();

    const renderImage = (image, src) => {
      const element = document.createElement('img');
      element.setAttribute('src', src);
      element.setAttribute('alt', this.album.evento);
      element.setAttribute('title', this.album.evento);
      element.setAttribute('data-image', image);
      element.setAttribute('data-action', 'Saltar a imágen');
      return element;
    };

    const { image_src: path, cfgImgType: type } = this.album;
    for (let index = 1; index <= this.album.cantidadFotos; index++) {
      const src = path + index + type;
      const image = renderImage(index, src);
      fragment.appendChild(image);
    }
    Panel.panelGallery.appendChild(fragment);
  },

  showErrorMessage(msg) {
    const container = document.querySelector('.panel-info__album-info');
    container.innerHTML = `<h1>${msg}</h1>`;
  },
};

function getParseDate() {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var [day, month, year] = App.album.fechaEvento.split('/');

  var date = new Date([year, month, day].join('-') + 'T01:01:01');

  var fecha = new Date(date);

  return date.toLocaleDateString('es-AR', options);
}

function shareTo(provider) {
  console.log(provider);
  let url = false;
  switch (provider) {
    case 'Facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${location.href}`;
      break;

    case 'WhatsApp':
      url = `whatsapp://send?text=${location.href}`;
      break;
  }
  if (url) window.open(url);
}

// Download current image
function downloadCurrentImage(src) {
  try {
    const anchor = document.createElement('a');
    anchor.href = src;
    anchor.download = `${App.album.evento} - ${App.album.slider.actual}`;
    anchor.setAttribute('target', '_blank');
    console.log(anchor);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } catch (error) {}
}

function toggleFullScreen() {
  if (DEV_MODE) {
    console.error('Fullscreen is disable in DEV MODE');
    return false;
  }

  try {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  } catch (error) {}
}

/**
 * IIFE function that check if run site in localhost
 *
 * Usage Example:
 *
 * if (DEV_MODE) console.info('Message to console');
 *
 */
(() => {
  // localhost
  const URLs = ['localhost', '0.0.0.0', '192.168'];
  if (!window) return false;
  window.DEV_MODE = null;
  window.DEV_MODE = !!URLs.filter((url) => {
    const x = new RegExp(url, 'ig');
    return x.test(location.href);
  }).length;
})();
