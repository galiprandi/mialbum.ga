import { App } from './app'
import { Slider } from './slider'
import { Panel } from './panel'
import { shareTo, toggleFullScreen, downloadCurrentImage, onLocalhost } from './utils'



/**
 * Function that launch App
 */
initApp()
function initApp() {
    document.addEventListener('mouseup', eventManager);
    document.addEventListener('keyup', eventManager);
    App.start();
}

/**
 * Catch event and call dispatcher function 
 * 
 * @param event 
 */
export function eventManager(event: Event) {
    // console.log(event);
    const { target } = event;
    // @ts-ignore
    const action: string = target.dataset.action || event.key;
    if (action) actionDispatcher(action);
}

/**
 * Dispatch event
 * 
 * @param action Name of event to dispatch set en data-action attribute of element
 */
function actionDispatcher(action: string) {
    if (onLocalhost()) console.info(action)

    switch (action) {
        case 'Abrir Panel Slider':
        case 'Enter':
            Slider.play()
            Panel.switchTo(Panel.Slider)
            if (!onLocalhost()) toggleFullScreen()
            break

        case 'Open Panel Info':
            Slider.pause()
            Panel.closeAllPanels()
            Panel.open(Panel.Info)
            break

        case 'Open Panel Gallery':
        case 'ArrowDown':
            Slider.pause()
            Panel.switchTo(Panel.Gallery)
            break

        case 'Open Image Options':
            Slider.pause()
            Panel.open(Panel.Options)
            break

        case 'Close Image Options':
            Panel.close(Panel.Options)
            Slider.play()
            break

        case 'Próxima imágen':
        case 'ArrowRight':
            Slider.forward()
            break

        case 'Imágen previa':
        case 'ArrowLeft':
            Slider.backward()
            break

        case 'Saltar a imágen':
            // @ts-ignore
            const img: number = +event.target.dataset.image
            Slider.changeImage(img)
            Panel.switchTo(Panel.Slider)
            Slider.play()
            break

        case 'Continuar la reproducción':
            Panel.close(Panel.Options)
            Slider.play()
            break

        case 'Pausar la reproducción':
            Slider.pause()
            break

        case 'Compartir en Facebook':
            shareTo('Facebook')
            actionDispatcher('Close Image Options')
            break

        case 'Compartir en Whatsapp':
            shareTo('WhatsApp')
            actionDispatcher('Close Image Options')
            break

        case 'Descargar Imágen':
            const image = document.getElementById('slider-image')! as HTMLImageElement
            downloadCurrentImage(image.src)
            actionDispatcher('Close Image Options')
            break
        case 'Cambiar a Pantalla Completa':
            toggleFullScreen()
            actionDispatcher('Close Image Options')
            break

        default:
            break
    }
}


