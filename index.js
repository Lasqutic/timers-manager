import TimersManager from './timersManager.js'

const manager = new TimersManager();
const t1 = {
    name: 't1',
    delay: 1000,
    interval: false,
    job: () => JSON.parse("{ Error? }")
};
const t2 = {
    name: 't2',
    delay: 5000,
    interval: false,
    job: (a, b) => a / b
};
const i1 = {
    name: 'i1',
    delay: 4000,
    interval: true,
    job: (n) => n
};

manager.add(t1).add(t2, 10, 2).add(i1, 3);
manager.start();
manager.pause("t2");
manager.print()
