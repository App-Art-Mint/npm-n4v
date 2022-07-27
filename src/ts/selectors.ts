/**
 * Imports
 */
import { sunSelectors } from "@sunderapps/util";

/**
 * CSS-selector helpers
 * @public
 */
export default abstract class n4vSelectors extends sunSelectors {
    /**
     * The library name that will be added as a prefix
     */
    static override lib: string = 'n4v';

     /**
      * The prefix built from the library name
      */
    static override pre: string = `${this.lib}-`;

    /**
     * CSS-selector for submenu buttons
     */
    static subMenuButtons: string = `button${this.hasControls}`;

    /**
     * CSS-selector for submenus
     */
    static subMenu: string = `${this.subMenuButtons} + ul${this.hasId}`;

    /**
     * Frequently-used ids
     */
    static ids: {[key: string]: string | {[key: string]: string}} = {
        header: this.prefix('header'),
        logo: this.prefix('logo'),
        wrapper: this.prefix('wrapper'),
        mainContent: this.prefix('main-content')
    };

    /**
     * Frequently-used classes
     */
    static classes: {[key: string]: string | {[key: string]: string}} = {
        ...super.classes,
        srOnly: this.prefix('sr-only'),
        js: this.prefix('js'),
        ready: this.prefix('ready'),
        fixed: this.prefix('fixed'),
        open: this.prefix('open')
    };
}