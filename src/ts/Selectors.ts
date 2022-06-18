class n4vSelectors {
    static #lib: string = 'n4v';
    static #pre: string = `${this.#lib}-`;
    static #controls: string = '[aria-controls]';
    static #expanded: string = '[aria-expanded]';
    static disabled: string = '[disabled]';
    static tabbable: string = '[tabindex]';
    static hasLink: string = '[href]';
    static hasRouterLink: string = '[routerLink]';
    static hasId: string = '[id]';
    static noTab: string = '[tabindex^="-"]';
    static focusable: string = `input${this.not(this.disabled)}${this.not(this.noTab)},
                                select${this.not(this.disabled)}${this.not(this.noTab)},
                                textarea${this.not(this.disabled)}${this.not(this.noTab)},
                                button${this.not(this.disabled)}${this.not(this.noTab)},
                                object${this.not(this.disabled)}${this.not(this.noTab)},
                                a${this.hasLink}, a${this.hasRouterLink},
                                area${this.hasLink},
                                ${this.tabbable}${this.not(this.noTab)}`.replace(/\s/g, '');
    static subMenuButtons: string = `button${this.#controls}`;
    static subMenu: string = `${this.subMenuButtons} + ul${this.hasId}`;
    static ids: {[key: string]: string} = {
        header: this.prefix('header'),
        logo: this.prefix('logo'),
        wrapper: this.prefix('wrapper'),
        mainContent: this.prefix('main-content')
    };
    static classes: {[key: string]: string} = {
        srOnly: this.prefix('sr-only'),
        js: this.prefix('js'),
        fixed: this.prefix('fixed'),
        gettingHeight: this.prefix('getting-height'),
        anime: this.prefix('anime'),
        open: this.prefix('open')
    };

    static prefix (base: string) : string {
        base = base.toLowerCase();
        return base.startsWith(this.#pre) ? base : `${this.#pre}${base}`;
    }

    static cssPrefix (base: string) : string {
        return `--${this.prefix(base.replace(/^-+/, ''))}`;
    }

    static cssVar (base: string) : string {
        return `var(${this.cssPrefix(base)})`;
    }

    static not (base: string) : string {
        return `:not(${base})`;
    }

    static class (base: string) : string {
        return `.${this.prefix(base)}`;
    }

    static id (base: string) : string {
        return `#${this.prefix(base)}`;
    }

    static controls (id?: string | null) : string {
        return id ? `[aria-controls="${this.prefix(id)}"]` : this.#controls;
    }

    static expanded (bool?: boolean | null) : string {
        return typeof bool === 'boolean' ? `[aria-expanded="${bool}"]` : this.#expanded;
    }
}

export default n4vSelectors;