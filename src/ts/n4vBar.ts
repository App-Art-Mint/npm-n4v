import n4vSelectors from './selectors';
import n4vSettings from './settings';

class n4vBar {
    el: {[key: string]: HTMLElement | null} = {};

    // Initializers
    constructor () {
        this.attachElements();
        this.attachEvents();
        this.enableJavascript();

        this.setMobileMenu();
    }

    attachElements () : void {
        this.el.header = document.getElementById(n4vSelectors.ids.header);
        this.el.mobileButton = this.el.header?.querySelector(n4vSelectors.controls(n4vSelectors.ids.wrapper)) || null;
        this.el.wrapper = document.getElementById(n4vSelectors.ids.wrapper);
    }

    attachEvents () : void {
        let focusables: NodeListOf<HTMLElement> | undefined = this.el.header?.querySelectorAll(n4vSelectors.focusable),
            lastFocusable: HTMLElement | undefined = focusables?.[focusables?.length - 1];
        lastFocusable?.addEventListener('keydown', n4vBar.throttle(this.eWrapTab.bind(this)) as EventListenerOrEventListenerObject);
        focusables?.forEach((focusable: HTMLElement) => {
            focusable.addEventListener('keydown', n4vBar.throttle(this.eHandleKeypress.bind(this)) as EventListenerOrEventListenerObject);
        });

        let menuButtons: NodeListOf<HTMLElement> | undefined = this.el.header?.querySelectorAll(n4vSelectors.controls() + n4vSelectors.not(n4vSelectors.controls(n4vSelectors.ids.wrapper)));
        menuButtons?.forEach((menuButton: HTMLElement) => {
            menuButton.addEventListener('mousedown', n4vBar.throttle(this.eToggleMenu.bind(this), n4vSettings.delay.slow, { trailing: false }) as EventListenerOrEventListenerObject);
        });

        this.el.mobileButton?.addEventListener('mousedown', n4vBar.throttle(this.eToggleMobileMenu.bind(this), n4vSettings.delay.slow, { trailing: false }) as EventListenerOrEventListenerObject);
    }

    enableJavascript () : void {
        this.el.header?.classList.add(n4vSelectors.classes.js);
        this.el.header?.classList.add(n4vSelectors.classes.fixed);
    }

    // Utility
    static throttle (func: Function,
                     wait: number = n4vSettings.delay.default,
                     options?: {[key: string]: boolean}) : Function {
        let context: any, args: any, result: any,
            timeout: number, previous: number = 0,
            later: Function = function () {
                previous = options?.leading === false ? 0 : new Date().getTime();
                timeout = 0;
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            },
            throttled: Function = function (this: any): any {
                let now: number = new Date().getTime();
                if (!previous && options?.leading === false) {
                    previous = now;
                }
                let remaining: number = wait - now + previous;
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = 0;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) {
                        context = args = null;
                    }
                } else if (!timeout && options?.trailing !== false) {
                    timeout = window.setTimeout(later, remaining);
                }
                return result;
            };

        return throttled;
    }

    static getHeight (el?: HTMLElement) : number {
        el?.classList.add(n4vSelectors.classes.gettingHeight);
        let height: number = el?.scrollHeight || 0;
        el?.classList.remove(n4vSelectors.classes.gettingHeight);
        return height;
    }

    // Functionality
    setMobileMenu (open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
            ariaLabel: string = open ? 'close menu' : 'open menu';

        this.el.mobileButton?.setAttribute('aria-expanded', ariaExpanded);
        setTimeout(() => {
            this.el.mobileButton?.setAttribute('aria-label', ariaLabel);
        }, n4vSettings.delay.fast);

        if (open) {
            this.el.wrapper?.classList.add(n4vSelectors.classes.open);
        } else {
            this.el.wrapper?.classList.remove(n4vSelectors.classes.open);
            this.closeAllMenus();
        }
    }

    setMenu (button?: HTMLElement | null,
             open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
            menu: HTMLElement | null = button?.nextElementSibling as HTMLElement | null;
        if (button && menu) {
            menu.classList.add(n4vSelectors.classes.anime);
            button.setAttribute('aria-expanded', ariaExpanded);
            menu.style.height = open ? n4vBar.getHeight(menu) + 'px' : '';
            setTimeout(() => {
                menu?.classList.remove(n4vSelectors.classes.anime);
            }, n4vSettings.delay.default);
        }
    }

    closeAllMenus () : void {
        let menuButtons: NodeListOf<HTMLElement> | undefined = this.el.wrapper?.querySelectorAll(n4vSelectors.subMenuButtons);
        menuButtons?.forEach((menuButton: HTMLElement) => {
            this.setMenu(menuButton);
        });
    }

    openClosestMenu () : void {
        let activeButton: HTMLElement | null = document.activeElement as HTMLElement | null,
            activeMenu: HTMLElement | null = activeButton?.nextElementSibling as HTMLElement | null,
            showing: boolean = activeButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true';
        if (activeButton?.getAttribute('aria-controls') === n4vSelectors.ids.wrapper) {
            activeMenu = this.el.wrapper;
        }

        if (activeButton?.getAttribute('aria-controls') && activeMenu && !showing) {
            activeButton.click();
            let firstFocusable: HTMLElement | null = activeMenu.querySelector(n4vSelectors.focusable);
            firstFocusable?.focus();
        }
    }

    closeClosestMenu () : void {
        let activeElement: HTMLElement | null = document.activeElement as HTMLElement | null,
            activeMenu: HTMLElement | null = activeElement?.closest(n4vSelectors.subMenu) as HTMLElement | null,
            activeButton: HTMLElement | null = activeMenu?.previousElementSibling ? activeMenu.previousElementSibling as HTMLElement : this.el.mobileButton;
        if (activeElement?.getAttribute('aria-controls') && activeElement?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            activeButton = activeElement;
        }

        if (activeButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            activeButton?.click();
            activeButton?.focus();
        }
    }

    toggleClosestMenu () : void {
        if (document.activeElement?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            this.closeClosestMenu();
        } else {
            this.openClosestMenu();
        }
    }

    // Events
    eWrapTab (e: KeyboardEvent) : void {
        if (e.key.toLowerCase() === 'tab' && !e.shiftKey) {
            this.el.mobileButton?.focus();
            if (document.activeElement === this.el.mobileButton) {
                e.preventDefault();
            }
        }
    }

    eHandleButtonKeypress (e: KeyboardEvent) : void {
        switch (e.key.toLowerCase()) {
            case 'escape':
            case 'arrowleft':
                this.closeClosestMenu();
                break;
            case 'arrowright':
                break;
            case 'enter':
            case 'space':
                break;
        }
    }

    eHandleLinkKeypress (e: KeyboardEvent) : void {
        switch (e.key.toLowerCase()) {
            case 'escape':
            case 'arrowleft':
                this.closeClosestMenu();
                break;
            case 'arrowright':
                this.openClosestMenu();
                break;
            case 'enter':
            case 'space':
                this.toggleClosestMenu();
                break;
        }
    }

    eHandleKeypress (e: KeyboardEvent) : void {
        if (e.key.toLowerCase() !== 'tab') {
            e.preventDefault();
        }
        let target: HTMLElement | null = e.target as HTMLElement | null;
        switch (target?.tagName.toLowerCase()) {
            case 'a':
                this.eHandleLinkKeypress(e);
                break;
            case 'button':
                this.eHandleButtonKeypress(e);
                break;
        }
    }

    eToggleMobileMenu (e: MouseEvent) : void {
        let target: HTMLElement | null = e.target as HTMLElement | null,
            open: boolean = target?.getAttribute('aria-expanded')?.toLowerCase() !== 'true';
        this.setMobileMenu(open);
    }

    eToggleMenu (e: MouseEvent) : void {
        let target: HTMLElement | null = e.target as HTMLElement | null,
            open: boolean = target?.getAttribute('aria-expanded')?.toLowerCase() !== 'true';
        this.setMenu(target, open);
    }
}

export default n4vBar;