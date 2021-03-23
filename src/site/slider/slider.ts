import { onLocalhost } from './/utils'

interface Slider {
    album: any,
    container: HTMLDivElement,
    intervalID: any,
    timerStart: Function,
    timerPause: Function,
    play: Function,
    pause: Function,
    forward: Function,
    backward: Function,
    changeImage: Function,
}


export const Slider: Slider = {
    album: null,
    container: document.getElementById('slider-image')! as HTMLDivElement,
    intervalID: 0,

    timerStart() {
        const rate = this.album.slider.rate
        this.album.slider.status = true
        this.intervalID = setInterval(() => {
            this.forward()
        }, rate)
    },

    timerPause() {
        for (var i = 1; i <= this.intervalID; i++) {
            clearInterval(i)
        }
    },

    play() {
        this.timerStart()
    },
    pause() {
        this.timerPause()
    },
    forward() {
        let current = this.album.slider.actual
        const last = this.album.cantidadFotos
        const next = current < last ? current + 1 : 1
        this.changeImage(next)
    },

    backward() {
        let current = this.album.slider.actual
        const last = this.album.cantidadFotos
        const next = current === 1 ? last : current - 1
        this.changeImage(next)
    },

    changeImage(image: number) {
        const { imagePath, cfgImgType: type } = this.album
        const src = imagePath + image + type
        this.album.slider.actual = image
        if (onLocalhost()) console.info(src)
        this.container.setAttribute('src', src)
    },
}