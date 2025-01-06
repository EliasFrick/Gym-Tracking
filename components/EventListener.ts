type Listener = (...args: any[]) => void;

class EventEmitter {
  private events: Record<string, Listener[]> = {};
  private sharedState: Record<string, any> = {};

  // Add a listener for an event
  on(event: string, listener: Listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // Remove a listener for an event
  off(event: string, listener: Listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  // Emit an event, calling all listeners
  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => listener(...args));
  }

  // Shared state management
  setState(key: string, value: any) {
    this.sharedState[key] = value;
    this.emit(key, value); // Notify listeners of the state change
  }

  getState(key: string) {
    return this.sharedState[key];
  }
}

export default new EventEmitter(); // Export a single instance
