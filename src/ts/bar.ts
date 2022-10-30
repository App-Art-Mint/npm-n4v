/**
 * Imports
 */
import { sunUtil, sunSide } from '@sunderapps/util';
import n4vSelectors from './selectors';
import n4vSettings from './settings';

/**
 * Main n4vbar functionality
 * @public
 */
export default class n4vBar {
    /**
     * Frequently-referenced elements
     */
    el: {[key: string]: HTMLElement | null} = {};

    /**
     * Initializes and closes the menu
     */
    constructor (settings?: {[key: string]: any}) {
        let defaultSettings: {[key: string]: any} = {
            from: sunSide.Top,
            fixed: true
        };
        n4vSettings.set({ ...defaultSettings, ...settings });
        this.attachElements();
        this.attachEvents();
        this.enableJavascript();

        this.setMobileMenu();

        let focusables: HTMLElement[] = n4vSelectors.getFocusables(this.el.header as HTMLElement);
        console.log(focusables);
    }

    /**
     * Adds elements to {@link el | `this.el`}
     */
    attachElements () : void {
        this.el.body = document.querySelector('body');
        this.el.header = document.getElementById(n4vSelectors.getId('header'));
        this.el.mobileButton = this.el.header?.querySelector(n4vSelectors.controls(n4vSelectors.getId('wrapper'))) || null;
        this.el.wrapper = document.getElementById(n4vSelectors.getId('wrapper'));

        
    }

    /**
     * Adds events to the dom
     */
    attachEvents () : void {
        window.addEventListener('resize', sunUtil.throttle(this.eHandleResize.bind(this), n4vSettings.delay.default, { trailing: false }) as EventListenerOrEventListenerObject);
        window.addEventListener('scroll', sunUtil.throttle(this.eHandleScroll.bind(this), n4vSettings.delay.default, { trailing: false }) as EventListenerOrEventListenerObject);

        let focusables: NodeListOf<HTMLElement> | undefined = this.el.header?.querySelectorAll(n4vSelectors.focusable),
            lastFocusable: HTMLElement | undefined = focusables?.[focusables?.length - 1];
        lastFocusable?.addEventListener('keydown', sunUtil.throttle(this.eWrapTab.bind(this)) as EventListenerOrEventListenerObject);
        focusables?.forEach((focusable: HTMLElement) => {
            focusable.addEventListener('keydown', sunUtil.throttle(this.eHandleKeypress.bind(this)) as EventListenerOrEventListenerObject);
        });

        let menuButtons: NodeListOf<HTMLElement> | undefined = this.el.header?.querySelectorAll(n4vSelectors.controls() + n4vSelectors.neg(n4vSelectors.controls(n4vSelectors.ids.wrapper as string)));
        menuButtons?.forEach((menuButton: HTMLElement) => {
            menuButton.addEventListener('mousedown', sunUtil.throttle(this.eToggleMenu.bind(this), n4vSettings.delay.slow, { trailing: false }) as EventListenerOrEventListenerObject);
        });

        this.el.mobileButton?.addEventListener('mousedown', sunUtil.throttle(this.eToggleMobileMenu.bind(this), n4vSettings.delay.slow, { trailing: false }) as EventListenerOrEventListenerObject);
    }

    /**
     * Adds classes that inform the styles that javascript is enabled
     */
    enableJavascript () : void {
        this.el.header?.classList.add(n4vSelectors.getClass('js'));
    }

    /**
     * Sets the state of the mobile menu
     * @param open - `true` to open the menu or `false` to close it
     */
    setMobileMenu (open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
            ariaLabel: string = open ? 'close menu' : 'open menu';

        this.el.mobileButton?.setAttribute('aria-expanded', ariaExpanded);
        setTimeout(() => {
            this.el.mobileButton?.setAttribute('aria-label', ariaLabel);
        }, n4vSettings.delay.fast);

        if (open) {
            if (n4vSettings.fixed !== true) {
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            }
            setTimeout(() => {
                if (this.el.body) {
                    this.el.body.style.overflow = 'hidden';
                }
            }, n4vSettings.from === sunSide.Left ? n4vSettings.delay.default : n4vSettings.delay.instant);
            this.el.wrapper?.classList.add(n4vSelectors.getClass('open'));
        } else {
            if (this.el.body) {
                this.el.body.style.overflow = 'auto';
            }
            this.el.wrapper?.classList.remove(n4vSelectors.getClass('open'));
            this.closeAllMenus();
        }
    }

    /**
     * Toggles the state of the mobile menu
     */
    toggleMobileMenu () : void {
        this.setMobileMenu(this.el.mobileButton?.getAttribute('aria-expanded')?.toLowerCase() === 'false');
    }

    /**
     * Sets the state of the provided button's menu
     * @param button - Button element to set
     * @param open - `true` to open the menu or `false` to close it
     */
    setMenu (button?: HTMLElement | null,
             open: boolean = false) : void {
        let ariaExpanded: string = open ? 'true' : 'false',
            menu: HTMLElement | null = button?.nextElementSibling as HTMLElement | null;
        if (button && menu) {
            button.setAttribute('aria-expanded', ariaExpanded);
            if (open) {
                sunUtil.show(menu);
            } else {
                sunUtil.hide(menu);
                this.closeSubMenus(button);
            }
        }
    }

    /**
     * Toggles the state of the provided button's menu
     * @param button - Button element to toggle
     */
    toggleMenu (button?: HTMLElement | null) : void {
        this.setMenu(button, button?.getAttribute('aria-expanded')?.toLowerCase() !== 'true');
    }

    /**
     * Closes all submenus of the provided button's menu
     * @param button - Button element of the parent menu
     */
    closeSubMenus (button?: HTMLElement | null) : void {
        let menu: HTMLElement | null | undefined = button?.nextElementSibling as HTMLElement,
            subMenus: NodeListOf<HTMLElement> = menu?.querySelectorAll(n4vSelectors.subMenuButtons) as NodeListOf<HTMLElement>;
        subMenus.forEach((child: HTMLElement) => {
            // setMenu calls this function, so ignore subsub menus
            if (child.parentElement?.parentElement === menu) {
                this.setMenu(child);
            }
        });
    }

    /**
     * Closes all submenus of the n4vbar
     */
    closeAllMenus () : void {
        let menuButtons: NodeListOf<HTMLElement> | undefined = this.el.wrapper?.querySelectorAll(n4vSelectors.subMenuButtons);
        menuButtons?.forEach((menuButton: HTMLElement) => {
            this.setMenu(menuButton);
        });
    }

    /**
     * Opens the menu closest to the document's focus
     */
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

    /**
     * Closes the menu closest to the document's focus
     */
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

    /**
     * Toggles the menu closest to the document's focus
     */
    toggleClosestMenu () : void {
        if (document.activeElement?.getAttribute('aria-expanded')?.toLowerCase() === 'true') {
            this.closeClosestMenu();
        } else {
            this.openClosestMenu();
        }
    }

    /**
     * Closes the mobile menu when the window resizes
     */
    eHandleResize () : void {
        this.setMobileMenu();
    }

    /**
     * Closes all submenus when the page is scrolled
     */
    eHandleScroll () : void {
        this.closeAllMenus();
    }

    /**
     * Sends the focus to the menu button after tabbing past the last menu item
     * @param e - Keyboard event
     */
    eWrapTab (e: KeyboardEvent) : void {
        if (e.key.toLowerCase() === 'tab' && !e.shiftKey) {
            this.el.mobileButton?.focus();
            if (document.activeElement === this.el.mobileButton) {
                e.preventDefault();
            }
        }
    }

    /**
     * Handles keypresses on n4vbar buttons
     * @param e - Keyboard event
     */
    eHandleButtonKeypress (e: KeyboardEvent) : void {
        let target = e.target as HTMLElement,
            subMenu = target.closest('li');
        switch (e.key.toLowerCase()) {
            case 'escape':
                if (subMenu?.classList.contains(n4vSelectors.classes.open as string)) {
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

    /**
     * Handles keypresses on n4vbar links
     * @param e - Keyboard event
     */
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

    /**
     * Handles keypresses on the n4vbar
     * @param e - Keyboard event
     */
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

    /**
     * Toggles the mobile menu
     */
    eToggleMobileMenu () : void {
        this.toggleMobileMenu();
    }

    /**
     * Toggles the clicked submenu
     * @param e - Mouse event
     */
    eToggleMenu (e: MouseEvent) : void {
        this.toggleMenu(e.target as HTMLElement | null);
    }
}