import { IObserver, Listener, Observer } from './ob';
import { Events } from './type';

type T = keyof Events;

type ObserversMap = {
  [Type in T]?: IObserver<Type>;
};

class EventBus {
  private static instance: EventBus;
  private observers: ObserversMap = {};

  private constructor() {}

  static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }

    return EventBus.instance;
  }

  public publish<Type extends T>(type: Type, event: Events[Type]): void {
    if (!EventBus.getInstance().observers[type]) {
      EventBus.getInstance().observers = {
        ...EventBus.getInstance().observers,
        [type]: new Observer<Type>(),
      };
    }

    // @ts-expect-error 这里不会为空的
    EventBus.getInstance().observers[type].publish(event);
  }

  public subscribe<Type extends T>(
    type: Type,
    listener: Listener<Type>
  ): () => void {
    if (!EventBus.getInstance().observers[type]) {
      EventBus.getInstance().observers = {
        ...EventBus.getInstance().observers,
        [type]: new Observer<Type>(),
      };
    }

    // @ts-expect-error 这里不会为空的
    return EventBus.getInstance().observers[type].subscribe(listener);
  }

  public clear(type: T) {
    if (EventBus.getInstance().observers[type]) {
      // @ts-expect-error 这里不会为空的
      EventBus.getInstance().observers[type].clear();
    }
  }

  public once<Type extends T>(type: Type): Promise<Events[Type]> {
    return new Promise((resolve) => {
      EventBus.getInstance().subscribe(type, (event) => {
        resolve(event)
        EventBus.getInstance().clear(type)
      })
    })
  }
}

const eventBus = EventBus.getInstance()

export {
  eventBus
}