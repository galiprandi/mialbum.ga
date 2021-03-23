import { toLongDate, onLocalhost } from './utils'
import { Slider } from './slider'

interface data {
    albumes: any,
    autores: any
}

export interface album {
    id: string,
    autorid: number,
    activo: boolean,
    fechaPublicacion: string,
    cantidadFotos: number,
    evento: string,
    fechaEvento: string,
    lugar: string,
    cfgAlbumUrl: string,
    cfgImgType: string,
    cfgImgUrl: string,
    cfgBorde: boolean
    cgfSliderStart: boolean
    cfgSliderTimer: number,
    imagePath: string,
    autor: {
        id: number,
        nombre: string,
        tel: string,
        mail: string,
        web: string
        logotipo: string | null,
        avatar: string | null
    },
    slider: {
        rate: number,
        actual: number,
        vistas: number,
        status: boolean,
    },
}

interface App {
    album?: any,
    start: Function,
    getAlbumData: Function,
    fillDataOnInfoPanel: Function,
    fillGallery: Function,
    showErrorMessage: Function
}

export const App: App = {

    async start() {
        console.info('Starting App !');
        const result: album | undefined = await this.getAlbumData()
        const album = { ...result }
        if (onLocalhost()) console.log(album);
        this.fillDataOnInfoPanel(album)
        this.fillGallery(album)
        Slider.album = album
        this.album = album
    },

    async getAlbumData() {
        try {
            const name: string = location.href.replace(location.origin, '').replace('index.html', '').replace(/\//g, '')
            const result = await fetch('../site/database/database.json')
            if (!result.ok) throw Error(result.statusText)
            const data: data = await result.json()
            if (onLocalhost()) console.log(data);
            const album: album = data.albumes[name]
            album.autor = data.autores[album.autorid]
            album.imagePath = album.cfgAlbumUrl + album.cfgImgUrl
            album.slider = {
                rate: album.cfgSliderTimer,
                actual: 1,
                vistas: 0,
                status: false,
            }
            return album

        } catch (error) {
            console.error(error)
        }
    },


    fillDataOnInfoPanel(album: album) {
        const container = document.querySelector('.panel-info__album-info')! as HTMLDivElement

        const {
            evento,
            fechaEvento: fecha,
            lugar,
            cantidadFotos: fotos,
            cfgSliderTimer: timer,
            autor
        } = album;
        // const { nombre: autor, web, tel, mail: email } = album.author;
        const parseDate = toLongDate(fecha);
        const imageAndTime = `${fotos} imágenes, ${((fotos * timer) / (timer * 10)).toFixed(
            1
        )} minutos.`;


        container.children[0].textContent = evento;
        container.children[1].textContent = parseDate;
        container.children[2].textContent = lugar;
        container.children[3].textContent = imageAndTime;
        container.children[5].textContent = autor.nombre;

        // @ts-ignore
        container.children[6].children[0].href = autor.web
        container.children[6].children[0].textContent = autor.web;
        // @ts-ignore
        container.children[7].children[0].href = 'tel:' + autor.tel;
        container.children[7].children[0].textContent = autor.tel;
        // @ts-ignore
        container.children[8].children[0].href = 'mailto:' + autor.email;
        // @ts-ignore
        container.children[8].children[0].textContent = autor.email;
    },

    fillGallery(album: album) {
        const gallery = document.querySelector('.panel-gallery')! as HTMLDivElement
        const fragment = document.createDocumentFragment()

        const renderImage = (image: number, src: string) => {
            const element = document.createElement('img')
            element.setAttribute('src', src)
            element.setAttribute('alt', album.evento)
            element.setAttribute('title', album.evento)
            element.setAttribute('data-image', `${image}`)
            element.setAttribute('data-action', 'Saltar a imágen')
            return element
        }
        const { imagePath, cfgImgType: type } = album

        for (let index = 1; index <= album.cantidadFotos; index++) {
            const src = imagePath + index + type
            const image = renderImage(index, src)
            fragment.appendChild(image)
        }
        gallery.appendChild(fragment)
    },

    showErrorMessage(msg: string) {
        const container = document.querySelector('.panel-info__album-info')! as HTMLDivElement
        container.innerHTML = `<h1>${msg}</h1>`
    },
}

