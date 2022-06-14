class ThrottleOptions {
    leading: boolean = true;
    trailing: boolean = true;

    constructor (leading: boolean = true, trailing: boolean = true) {
        this.leading = leading;
        this.trailing = trailing;
    }
}

export default ThrottleOptions;