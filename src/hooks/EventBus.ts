// src/utils/eventBus.ts
type EventHandler<T = any> = (payload: T) => void

class EventBus {
  private events: Record<string, EventHandler[]> = {}

  on<T>(event: string, callback: EventHandler<T>) {
    (this.events[event] ||= []).push(callback as EventHandler)
  }

  off<T>(event: string, callback: EventHandler<T>) {
    if (!this.events[event])
      return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }

  emit<T>(event: string, payload: T) {
    if (!this.events[event])
      return
    this.events[event].forEach(cb => cb(payload))
  }

  once<T>(event: string, callback: EventHandler<T>) {
    const onceWrapper: EventHandler<T> = (payload) => {
      callback(payload)
      this.off(event, onceWrapper)
    }
    this.on(event, onceWrapper)
  }
}

export const eventBus = new EventBus()
