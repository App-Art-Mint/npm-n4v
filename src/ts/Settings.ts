class Settings {
    delay: {[key: string]: number} = {
        instant: 0,
        fast: 100,
        medFast: 200,
        default: 300,
        medSlow: 400,
        slow: 500
    };
}

export default Settings;