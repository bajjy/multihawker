class Processes {
    constructor() {
        this.processes = new Map();
    };
    process(name, script) {
        this.process.set(name, script);
    };
    get(name) {
        return this.process.get(name)
    };
};

export {
    Processes
}