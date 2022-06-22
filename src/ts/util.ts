import n4vSelectors from "./selectors";
import n4vSettings from "./settings";

class n4vUtil {
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

    static getHeight (el?: HTMLElement | null) : number {
        el?.classList.add(n4vSelectors.classes.gettingHeight);
        let height: number = el?.scrollHeight || 0;
        el?.classList.remove(n4vSelectors.classes.gettingHeight);
        return height;
    }

    static slideDown (el?: HTMLElement | null) : void {
        if (el) {
            el.classList.add(n4vSelectors.classes.anime);
            el.style.height = `${this.getHeight(el)}px`;
            setTimeout(() => {
                el.style.height = 'auto';
                el.classList.remove(n4vSelectors.classes.anime);
            }, n4vSettings.delay.default);
        }
    }

    static slideUp (el?: HTMLElement | null) : void {
        if (el) {
            el.classList.add(n4vSelectors.classes.anime);
            let height = this.getHeight(el),
                transition = el.style.transition;
            el.style.transition = '';
            requestAnimationFrame(function () {
                el.style.height = `${height}px`;
                el.style.transition = transition;
                requestAnimationFrame(function () {
                    el.style.height = '0px';
                });
            });
            setTimeout(() => {
                el.classList.remove(n4vSelectors.classes.anime);
            }, n4vSettings.delay.default);
        }
    }
}

export default n4vUtil;