# Testing grounds

Reminder to self: this is all likely to be throwaway code or rewritten code if it is repurposed.

Command line prototypes.

* Essentially a REPL-state machine that starts off on the main menu.
* Each state is an async function.
    * When the state is complete, it resolves with an async function, or null to return to the main menu.
    * The main menu must provide a clean way to quit the program.
* The terminal screen will be cleared before a state function is called.
    * Any text necessary for context should be provided by the state function.
    * If text should be read by the user, the state should pause before yielding control back to the person at the keyboard.

Run with:

```bash
NODE_PATH=src:src/testing-grounds babel-node src/testing-grounds
```
