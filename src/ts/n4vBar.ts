import Selectors from './Selectors';
import Settings from './Settings';
import ThrottleOptions from './ThrottleOptions';

class n4vBar {
    #el: {[key: string]: HTMLElement | null};
    #sel: Selectors = new Selectors();
    #set: Settings = new Settings();

    // Initializers
    constructor () {
        this.attachElements();
        this.attachEvents();

        this.#el.header?.classList.add(this.#sel.classes.js);
        this.#el.header?.classList.add(this.#sel.classes.fixed);
    }

    attachElements () : void {
        this.#el = {};
        this.#el.header = document.getElementById(this.#sel.ids.header);
        this.#el.mobileButton = this.#el.header?.querySelector(this.#sel.controls(this.#sel.ids.wrapper)) || null;
        this.#el.wrapper = document.getElementById(this.#sel.ids.wrapper);
    }

    attachEvents () : void {
        let focusables: NodeListOf<HTMLElement> | undefined = this.#el.header?.querySelectorAll(this.#sel.focusable),
            lastFocusable: HTMLElement | undefined = focusables?.[focusables?.length - 1];
        lastFocusable?.addEventListener('keydown', this.throttle(this.eWrapTab.bind(this)) as EventListenerOrEventListenerObject);
        focusables?.forEach((focusable: HTMLElement) => {
            focusable.addEventListener('keydown', this.throttle(this.eHandleKeypress.bind(this)) as EventListenerOrEventListenerObject);
        });

        let menuButtons: NodeListOf<HTMLElement> | undefined = this.#el.header?.querySelectorAll(this.#sel.controls() + this.#sel.not(this.#sel.controls(this.#sel.ids.wrapper)));
        menuButtons?.forEach((menuButton: HTMLElement) => {
            menuButton.addEventListener('mousedown', this.throttle(this.eToggleMenu.bind(this), this.#set.delay.slow, new ThrottleOptions(true, false)) as EventListenerOrEventListenerObject);
        });

        this.#el.mobileButton?.addEventListener('mousedown', this.throttle(this.eToggleMobileMenu.bind(this), this.#set.delay.slow, new ThrottleOptions(true, false)) as EventListenerOrEventListenerObject);
        this.#el.mobileButton?.click();
    }

    // Utility
    throttle (func: Function,
              wait: number = this.#set.delay.default,
              options: ThrottleOptions = new ThrottleOptions()) : Function {
        let context: any, args: any, result: any,
            timeout: number, previous: number = 0,
            later: Function = function () {
                previous = options.leading === false ? 0 : new Date().getTime();
                timeout = 0;
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            },
            throttled: Function = function (this: any): any {
                let now: number = new Date().getTime();
                if (!previous && options.leading === false) {
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
                } else if (!timeout && options.trailing !== false) {
                    timeout = window.setTimeout(later, remaining);
                }
                return result;
            };

        return throttled;
    }

    getHeight (el?: HTMLElement) : number {
        el?.classList.add(this.#sel.classes.gettingHeight);
        let height: number = el?.scrollHeight || 0;
        el?.classList.remove(this.#sel.classes.gettingHeight);
        return height;
    }

    // Functionality
    setMobileMenu (open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
            ariaLabel: string = open ? 'close menu' : 'open menu';

        this.#el.mobileButton?.setAttribute('aria-expanded', ariaExpanded);
        setTimeout(() => {
            this.#el.mobileButton?.setAttribute('aria-label', ariaLabel);
        }, this.#set.delay.fast);

        if (open) {
            this.#el.wrapper?.classList.add(this.#sel.classes.open);
        } else {
            this.#el.wrapper?.classList.remove(this.#sel.classes.open);
            this.closeAllMenus();
        }
    }

    setMenu (button?: HTMLElement | null,
             open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
            menu: HTMLElement | null = button?.nextElementSibling as HTMLElement | null;
        if (button && menu) {
            menu.classList.add(this.#sel.classes.anime);
            button.setAttribute('aria-expanded', ariaExpanded);
            menu.style.height = open ? this.getHeight(menu) + 'px' : '';
            setTimeout(() => {
                menu?.classList.remove(this.#sel.classes.anime);
            }, this.#set.delay.default);
        }
    }

    closeAllMenus () : void {
        let menuButtons: NodeListOf<HTMLElement> | undefined = this.#el.wrapper?.querySelectorAll(this.#sel.subMenuButtons);
        menuButtons?.forEach((menuButton: HTMLElement) => {
            this.setMenu(menuButton);
        });
    }

    openClosestMenu () : void {
        let activeButton: HTMLElement | null = document.activeElement as HTMLElement | null,
            activeMenu: HTMLElement | null = activeButton?.nextElementSibling as HTMLElement | null,
            showing: boolean = activeButton?.getAttribute('aria-expanded')?.toLowerCase() === 'true';
        if (activeButton?.getAttribute('aria-controls') === this.#sel.ids.wrapper) {
            activeMenu = this.#el.wrapper;
        }

        if (activeButton?.getAttribute('aria-controls') && activeMenu && !showing) {
            activeButton.click();
            let firstFocusable: HTMLElement | null = activeMenu.querySelector(this.#sel.focusable);
            firstFocusable?.focus();
        }
    }

    closeClosestMenu () : void {
        let activeElement: HTMLElement | null = document.activeElement as HTMLElement | null,
            activeMenu: HTMLElement | null = activeElement?.closest(this.#sel.subMenu) as HTMLElement | null,
            activeButton: HTMLElement | null = activeMenu?.previousElementSibling ? activeMenu.previousElementSibling as HTMLElement : this.#el.mobileButton;
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
            this.#el.mobileButton?.focus();
            if (document.activeElement === this.#el.mobileButton) {
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