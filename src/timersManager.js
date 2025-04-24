class TimersManager {

    #timers;
    #isRunning = false;
    #logs = [];
    #MAX_DELAY_PLUS_MS = 10000;

    constructor() {
        this.#timers = [];

    }

    getTimers() {
        return this.#timers;
    }

    add(timer, ...args) {

        if (this.#isRunning) {
            throw new Error("Cannot add timers after start");
        }
        if (this.#findTimerByName(timer.name)) {
            throw new Error(`Timer with name "${timer.name}" already exists`);
        }

        this.#validate(timer);

        const timerEntry = this.#createTimer(timer, args);
        this.#timers.push(timerEntry);
        return this;
    }

    start() {
        if (!this.#timers.length) {
            console.log("No timers to start");
            return;
        }

        if (this.#isRunning) {
            console.log("The timers have already started");
            return;
        }

        console.log("Timers have been started");
        this.#isRunning = true;

        this.#stopTimersAfterMaxPlus(this.#MAX_DELAY_PLUS_MS);

        this.#timers.forEach(timer => {
            if (timer.completed) return;

            timer.startTime = Date.now();
            timer.promise = new Promise(resolve => {
                timer.resolve = resolve;
                this.#startTimer(timer);
            });
        });
    }

    stop() {
        this.#isRunning = false;
        this.#timers.forEach(timer => {

            if (!timer.completed && timer.startTime) {
                timer.remaining = timer.delay - (Date.now() - timer.startTime);
            }

            this.#clearTimer(timer);
            if (timer.resolve) {
                timer.resolve();
            }
        });
        console.log("The timers are stopped");
    }

    dispose() {
        this.stop();
        this.#timers = [];
        this.#logs = [];
        this.#isRunning = false;
        console.log("Timers and logs cleared from memory");
    }


    remove(name) {
        const index = this.#timers.findIndex(t => t.name === name);

        if (index !== -1) {
            const timer = this.#timers[index];
            this.#clearTimer(timer);

            this.#timers.splice(index, 1);
            console.log(`"${name}" has been deleted`);
        } else {
            console.log(`Сan't delete "${name}" it's not found`);
        }
    }

    pause(name) {
        const timer = this.#findTimerByName(name)
        if (!timer) {
            console.log(`Сan't pause "${name}" it's not found`);
        }
        if (!timer.id) {
            console.log(`Can't pause "${name}" because it allready paused`);
            return;
        }
        timer.remaining = timer.delay - (Date.now() - timer.startTime);
        console.log(`"${name}" has been paused`)
        this.#clearTimer(timer);
    }

    resume(name) {
        const timer = this.#findTimerByName(name);
        if (!timer) {
            console.log(`Сan't resume "${name}" it's not found`);
            return;
        }
        if (!timer.remaining) {
            console.log(`Can't resume "${name}" because it was not paused`);
            return;
        }
        if (timer.id) {
            console.log(`"${name}" is already running`);
            return;
        }

        console.log(`"${name}" has been resumed`);
        this.#startTimer(timer);
    }

    async print() {
        await Promise.all(this.#timers.map(t => t.promise));

        if (!this.#logs.length) {
            console.log("No logs to print");
            return;
        }
        console.log(JSON.stringify(this.#logs, null, 2));
    }

    #startTimer(timer) {
        const delay = timer.remaining ?? timer.delay;

        if (timer.interval) {
            timer.id = setTimeout(() => {
                this.#logJobResult(timer);
                timer.id = setInterval(() => this.#logJobResult(timer), timer.delay);
            }, delay);
        } else {
            timer.id = setTimeout(() => {
                this.#logJobResult(timer);
                timer.completed = true;
                timer.resolve();
            }, delay);
        }

        timer.remaining = null;
    }

    #createTimer(timer, args) {
        return {
            ...timer,
            startTime: null,
            remaining: null,
            args,
            id: null,
            completed: false
        };
    }

    #validate(timer) {
        if (!timer.name || typeof timer.name !== 'string') {
            throw new Error('The "name" field is required and must be a non-empty string');
        }

        if (!Number.isFinite(timer.delay)) {
            throw new Error('The "delay" field is required and must be a valid number');
        }

        if (timer.delay < 0 || timer.delay > 5000) {
            throw new Error('Delay must be a non-negative number and must be less than or equal to 5000');
        }

        if (typeof timer.interval !== 'boolean') {
            throw new Error('Interval must be a boolean');
        }

        if (typeof timer.job !== 'function') {
            throw new Error('Job must be a function');
        }
    }

    #logJobResult(timer) {
        try {
            const result = timer.job(...timer.args);
            this.#log(timer, result);
        } catch (error) {
            this.#log(timer, null, error);
        }
    }

    #log(timer, result, error = null) {
        const log = {
            name: timer.name,
            in: timer.args,
            out: result,
            created: new Date()
        };

        if (error) {
            log.error = {
                name: error.name,
                message: error.message,
                stack: error.stack
            };
        }

        this.#logs.push(log);
    }

    #clearTimer(timer) {
        if (timer.id) {
            timer.interval ? clearInterval(timer.id) : clearTimeout(timer.id);
            timer.id = null;
        }
    }

    #stopTimersAfterMaxPlus(delay) {
        const maxDelay = this.#timers
            .filter(timer => !timer.completed)
            .reduce((maxDelay, currentTimer) => {
                if (currentTimer.delay > maxDelay) {
                    return currentTimer.delay;
                }
                return maxDelay;
            }, 0);

        console.log(`Timeout for all timers is ${maxDelay + delay}`)

        setTimeout(() => this.stop(), maxDelay + delay);
    }

    #findTimerByName(name) {
        const timer = this.#timers.find(t => t.name === name);
        return timer;
    }
}
export default TimersManager;