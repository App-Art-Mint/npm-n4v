class n4vSettings {
    static delayBase: number = 0;
    static delayStep: number = 100;
    static delay: {[key: string]: number} = {
        instant: this.delayBase + this.delayStep * 0,
        fast: this.delayBase + this.delayStep * 1,
        medFast: this.delayBase + this.delayStep * 2,
        default: this.delayBase + this.delayStep * 3,
        medSlow: this.delayBase + this.delayStep * 4,
        slow: this.delayBase + this.delayStep * 5
    };

    static set (settings: {[key: string]: any}) : void {
        let newDelay: boolean = false;
        if (typeof settings.delayBase === 'number') {
            this.delayBase = settings.delayBase;
            newDelay = true;
        }
        if (typeof settings.delayStep === 'number') {
            this.delayStep = settings.delayStep;
            newDelay = true;
        }
        if (newDelay) {
            this.#setDelay();
        }

        if (settings.delay && Object.keys(settings.delay).length) {
            if (Object.values(settings.delay).reduce((prev, next) => prev && typeof next === 'number', true)) {
                this.delay = {...this.delay, ...settings.delay};
            }
        }
    }

    static #setDelay () : void {
        this.delay = {
            instant: this.delayBase + this.delayStep * 0,
            fast: this.delayBase + this.delayStep * 1,
            medFast: this.delayBase + this.delayStep * 2,
            default: this.delayBase + this.delayStep * 3,
            medSlow: this.delayBase + this.delayStep * 4,
            slow: this.delayBase + this.delayStep * 5
        };
    }
}

export default n4vSettings;