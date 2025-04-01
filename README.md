# Timers Manager

## Overview
Timers Manager is a lightweight JavaScript library for managing timers and intervals. It provides an intuitive API for adding, starting, pausing, resuming, and removing timers while logging execution results and errors.

## Features
- Add and manage multiple timers with custom delays.
- Support for both one-time and recurring (interval) timers.
- Ability to pause, resume, and remove timers dynamically.
- Automatic logging of execution results and errors.
- Prevents duplicate timers and ensures safe execution.

## Installation
No installation required. Clone the repository and run the script using Node.js.

```sh
git clone https://github.com/Lasqutic/timers-manager.git
cd timers-manager
npm install  # If dependencies are added in the future
```

## Usage
### Quickstart

Run the following command to start the application:

```sh
npm start
```

### Example Code
Here’s how you can use `TimersManager` in your project:

```javascript
import TimersManager from './timersManager.js';

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
manager.print();
```

## Expected Output
After running `npm start`, you can expect output similar to:

```sh
Timers have been started

[
  {
    "name": "t1",
    "in": [],
    "out": null,
    "created": "2025-04-01T10:20:30.449Z",
    "error": {
      "name": "SyntaxError",
      "message": "Expected property name or '}' in JSON at position 2 (line 1 column 3)",
      "stack": "SyntaxError: Expected property name or '}' in JSON at position 2 (line 1 column 3)\n    at JSON.parse (<anonymous>)\n    at Object.job (file:///C:/Users/User/Desktop/lessonsProg/NodeBasic/1/index.js:8:21)\n    at #logJobResult (file:///C:/Users/User/Desktop/lessonsProg/NodeBasic/1/timersManager.js:183:34)\n    at Timeout._onTimeout (file:///C:/Users/User/Desktop/lessonsProg/NodeBasic/1/timersManager.js:150:35)\n    at listOnTimeout (node:internal/timers:594:17)\n    at process.processTimers (node:internal/timers:529:7)"
    }
  },
  {
    "name": "i1",
    "in": [
      3
    ],
    "out": 3,
    "created": "2025-04-01T10:20:33.454Z"
  },
  {
    "name": "i1",
    "in": [
      3
    ],
    "out": 3,
    "created": "2025-04-01T10:20:37.468Z"
  },
  {
    "name": "i1",
    "in": [
      3
    ],
    "out": 3,
    "created": "2025-04-01T10:20:41.474Z"
  }
]
```

## API
### `add(timer, ...args)`
Adds a new timer.
- **timer**: Object `{ name, delay, interval, job }`
- **args**: Arguments passed to the `job` function

### `start()`
Starts all added timers.

### `pause(name)`
Pauses a specific timer.

### `resume(name)`
Resumes a paused timer.

### `stop()`
Stops all running timers.

### `remove(name)`
Removes a timer by name.

### `dispose()`
Clears all timers and logs from memory.

### `print()`
Prints execution logs.

