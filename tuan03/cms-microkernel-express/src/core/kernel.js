class EventBus {
  constructor() {
    this.handlers = new Map();
  }

  on(eventName, handler) {
    const existing = this.handlers.get(eventName) || [];
    existing.push(handler);
    this.handlers.set(eventName, existing);
  }

  emit(eventName, payload) {
    const listeners = this.handlers.get(eventName) || [];
    listeners.forEach((handler) => handler(payload));
  }
}

class PluginManager {
  constructor({ app, auth, models }) {
    this.app = app;
    this.auth = auth;
    this.models = models;
    this.eventBus = new EventBus();
    this.plugins = [];
  }

  register(plugin) {
    plugin.register({
      app: this.app,
      auth: this.auth,
      eventBus: this.eventBus,
      models: this.models,
    });
    this.plugins.push(plugin.meta);
  }

  listPlugins() {
    return this.plugins;
  }
}

module.exports = { PluginManager };
