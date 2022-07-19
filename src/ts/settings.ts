/**
 * Imports
 */
import { sunSettings } from "@sunderapps/util";

/**
 * Settings management
 * @public
 */
export default abstract class n4vSettings extends sunSettings {
    /**
     * Update the provided settings variables
     * @param settings - Object of settings variables to update
     */
    static override set (settings: {[key: string]: any}) : void {
        super.set(settings);
    }
}