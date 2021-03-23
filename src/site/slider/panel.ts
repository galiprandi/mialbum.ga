/**
 * Manage visibility of main panels
 */
interface Panel {
    openClassName: string;
    Info: HTMLDivElement;
    Slider: HTMLDivElement;
    Options: HTMLDivElement;
    Gallery: HTMLDivElement;
    closeAllPanels: Function;
    switchTo: Function;
    open: Function;
    close: Function;

}
export const Panel: Panel = {
    openClassName: 'active',
    Info: document.querySelector('.panel-info')!,
    Slider: document.querySelector('.panel-slider')!,
    Options: document.querySelector('.panel-slider__options')!,
    Gallery: document.querySelector('.panel-gallery')!,

    closeAllPanels() {
        const openClassName = this.openClassName;
        this.Info.classList.remove(openClassName);
        this.Slider.classList.remove(openClassName);
        this.Gallery.classList.remove(openClassName);
    },

    switchTo(panel: HTMLDivElement) {
        this.closeAllPanels();
        this.open(panel);
    },

    open(panel: HTMLDivElement) {
        panel.classList.add('active');
    },
    close(panel: HTMLDivElement) {
        panel.classList.remove('active');
    },
};
