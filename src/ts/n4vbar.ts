import '../scss/n4v.scss';

import n4vSelectors from './selectors';
import n4vSettings from './settings';
import n4vUtil from './util';

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
        window.addEventListener('resize', n4vUtil.throttle(this.eHandleResize.bind(this), n4vSettings.delay.default, { trailing: false }) as EventListenerOrEventListenerObject);
        window.addEventListener('scroll', n4vUtil.throttle(this.eHandleScroll.bind(this), n4vSettings.delay.default, { trailing: false }) as EventListenerOrEventListenerObject);

        let focusables: NodeListOf<HTMLElement> | undefined = this.el.header?.querySelectorAll(n4vSelectors.focusable),
            lastFocusable: HTMLElement | undefined = focusables?.[focusables?.length - 1];
        lastFocusable?.addEventListener('keydown', n4vUtil.throttle(this.eWrapTab.bind(this)) as EventListenerOrEventListenerObject);
        focusables?.forEach((focusable: HTMLElement) => {
            focusable.addEventListener('keydown', n4vUtil.throttle(this.eHandleKeypress.bind(this)) as EventListenerOrEventListenerObject);
        });

        let menuButtons: NodeListOf<HTMLElement> | undefined = this.el.header?.querySelectorAll(n4vSelectors.controls() + n4vSelectors.not(n4vSelectors.controls(n4vSelectors.ids.wrapper)));
        menuButtons?.forEach((menuButton: HTMLElement) => {
            menuButton.addEventListener('mousedown', n4vUtil.throttle(this.eToggleMenu.bind(this), n4vSettings.delay.slow, { trailing: false }) as EventListenerOrEventListenerObject);
        });

        this.el.mobileButton?.addEventListener('mousedown', n4vUtil.throttle(this.eToggleMobileMenu.bind(this), n4vSettings.delay.slow, { trailing: false }) as EventListenerOrEventListenerObject);
    }

    enableJavascript () : void {
        this.el.header?.classList.add(n4vSelectors.classes.js);
        this.el.header?.classList.add(n4vSelectors.classes.fixed);
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

    toggleMobileMenu () : void {
        this.setMobileMenu(this.el.mobileButton?.getAttribute('aria-expanded')?.toLowerCase() === 'false');
    }

    setMenu (button?: HTMLElement | null,
             open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
            menu: HTMLElement | null = button?.nextElementSibling as HTMLElement | null;
        if (button && menu) {
            button.setAttribute('aria-expanded', ariaExpanded);
            if (open) {
                n4vUtil.slideDown(menu);
            } else {
                n4vUtil.slideUp(menu);
                this.closeSubMenus(button);
            }
        }
    }

    toggleMenu (button?: HTMLElement | null) {
        this.setMenu(button, button?.getAttribute('aria-expanded')?.toLowerCase() !== 'true');
    }

    closeSubMenus (button?: HTMLElement | null) {
        let menu: HTMLElement | null | undefined = button?.nextElementSibling as HTMLElement,
            subMenus: NodeListOf<HTMLElement> = menu?.querySelectorAll(n4vSelectors.subMenuButtons) as NodeListOf<HTMLElement>;
        subMenus.forEach((child: HTMLElement) => {
            // setMenu calls this function, so ignore subsub menus
            if (child.parentElement?.parentElement === menu) {
                this.setMenu(child);
            }
        });
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
    eHandleResize () : void {
        this.setMobileMenu();
    }

    eHandleScroll () : void {
        this.closeAllMenus();
    }

    eWrapTab (e: KeyboardEvent) : void {
        if (e.key.toLowerCase() === 'tab' && !e.shiftKey) {
            this.el.mobileButton?.focus();
            if (document.activeElement === this.el.mobileButton) {
                e.preventDefault();
            }
        }
    }

    eHandleButtonKeypress (e: KeyboardEvent) : void {
        let target = e.target as HTMLElement,
            subMenu = target.closest('li');
        switch (e.key.toLowerCase()) {
            case 'escape':
                if (subMenu?.classList.contains(n4vSelectors.classes.open)) {
                    this.setMenu(subMenu);
                } else {
                    this.setMobileMenu();
                    this.el.menuButton?.focus();
                }
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

    eToggleMobileMenu () : void {
        this.toggleMobileMenu();
    }

    eToggleMenu (e: MouseEvent) : void {
        this.toggleMenu(e.target as HTMLElement | null);
    }
}

export default n4vBar;