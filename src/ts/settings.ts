/**
 * Imports
 */
import { mintSettings, mintSide } from "@appartmint/util";
import n4vSelectors from "./selectors";

/**
 * Settings management
 * @public
 */
export abstract class n4vSettings extends mintSettings {
    /**
     * Side of the window the mobile navbar enters from
     */
     static from?: mintSide;

     /**
     * Whether the navbar is fixed or not
     */
      static fixed?: boolean;

    /**
     * Update the provided settings variables
     * @param settings - Object of settings variables to update
     */
    static override set (settings: {[key: string]: any}) : void {
        super.set(settings);
        if (settings.from || settings.from === mintSide.Top) {
            this.setFrom(settings.from);
        }
        if (typeof settings.fixed === 'boolean') {
            this.setFixed(settings.fixed);
        }
    }

    /**
     * Updates the direction the navbar enters from
     */
     protected static setFrom (from: mintSide) : void {
        if (this.from !== from) {
            this.from = from;
            let header: HTMLElement | null = document.getElementById(n4vSelectors.getId('header'));
            header?.classList.remove(...Object.values(n4vSelectors.classes.sides));
            header?.classList.add(n4vSelectors.getClass(mintSide[this.from].toLowerCase(), 'sides'));
        }
    }

    /**
     * Updates whether or not the navbar is fixed
     */
    protected static setFixed (fixed: boolean) : void {
        if (this.fixed !== fixed) {
            this.fixed = fixed;
            let header: HTMLElement | null = document.getElementById(n4vSelectors.getId('header')),
                fixedClass: string = n4vSelectors.getClass('fixed');
            if (this.fixed) {
                header?.classList.add(fixedClass);
            } else {
                header?.classList.remove(fixedClass);
            }
        }
    }
}

/**
 * Exports
 */
export default n4vSettings;