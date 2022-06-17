class Selectors {
    #lib: string = 'n4v';
    #pre: string = `${this.#lib}-`;
    #controls: string = '[aria-controls]';
    #disabled: string = '[disabled]';
    #expanded: string = '[aria-expanded]';
    #tabbable: string = '[tabindex]';
    #hasLink: string = '[href]';
    #hasId: string = '[id]';
    #noTab: string = '[tabindex^="-"]';
    focusable: string = `input${this.not(this.#disabled)}${this.not(this.#noTab)},
                         select${this.not(this.#disabled)}${this.not(this.#noTab)},
                         textarea${this.not(this.#disabled)}${this.not(this.#noTab)},
                         button${this.not(this.#disabled)}${this.not(this.#noTab)},
                         object${this.not(this.#disabled)}${this.not(this.#noTab)},
                         a${this.#hasLink},
                         area${this.#hasLink},
                         ${this.#tabbable}${this.not(this.#noTab)}`.replace(/\s/g, '');
    subMenuButtons: string = `button${this.#controls}`;
    subMenu: string = `${this.subMenuButtons} + ul${this.#hasId}`;
    ids: {[key: string]: string} = {
        header: `${this.#pre}header`,
        logo: `${this.#pre}logo`,
        wrapper: `${this.#pre}wrapper`,
        mainContent: `${this.#pre}mainContent`
    };
    classes: {[key: string]: string} = {
        srOnly: `${this.#pre}sr-only`,
        js: `${this.#pre}js`,
        fixed: `${this.#pre}fixed`,
        gettingHeight: `${this.#pre}geting-height`,
        anime: `${this.#pre}anime`,
        open: `${this.#pre}open`
    };

    not (base: string) : string {
        return `:not(${base})`;
    }

    controls (id?: string | null) : string {
        return id ? `[aria-controls="${id}"]` : this.#controls;
    }

    expanded (bool?: boolean | null) : string {
        return typeof bool === 'boolean' ? `[aria-expanded="${bool}"]` : this.#expanded;
    }
}

export default Selectors;