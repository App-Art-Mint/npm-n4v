import { v4r } from '../scss/v4r.scss';

class Settings {
    delay = {
        instant: v4r.delayInstant,
        fast: v4r.delayFast,
        medFast: v4r.delayMedFast,
        default: v4r.delayDefault,
        medSlow: v4r.delayMedSlow,
        slow: v4r.delaySlow
    };
}

export default Settings;