/**
 * 
 * Parse '10/01/2017' to 'martes, 10 de enero de 2017'
 * 
 * @param string 
 * @returns 'martes, 10 de enero de 2017'
 */
export function toLongDate(string: string) {
    try {
        let options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
        let [day, month, year] = string.split('/')
        let date = new Date([year, month, day].join('-') + 'T01:01:01')
        if (isNaN(date.getUTCDate())) return string
        // @ts-ignore
        else return date.toLocaleDateString('es-AR', options)
    } catch (error) {
        return string
    }
}





export function shareTo(provider: string) {
    console.log(provider);
    let url: string | null = null;
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
export function downloadCurrentImage(imageSrc: string) {
    try {
        const anchor = document.createElement('a');
        anchor.href = imageSrc;
        //anchor.download = `${App.album.evento} - ${App.album.slider.actual}`;
        anchor.setAttribute('target', '_blank');
        console.log(anchor);
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    } catch (error) { }
}

export function toggleFullScreen() {
    try {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    } catch (error) { }
}



export const onLocalhost = () => {
    return !!['localhost', '0.0.0.0', '192.168']
        .filter(url => {
            const x = new RegExp(url, 'ig')
            return x.test(location.href)
        }).length
}
