export type SimpleChange<V> = Readonly<{
  firstChange: boolean;
  previousValue: V;
  currentValue: V;
  isFirstChange: () => boolean;
}>;

export function OnChange<V>(callbackName: string): (target: any, propertyKey: PropertyKey) => void {
  return (target: any, propertyKey: PropertyKey): void => {

    if (!callbackName || !target[callbackName] || typeof target[callbackName] !== 'function') {
      throw new Error(`there's no such a method ${callbackName} in ${target.constructor.name} or ${callbackName} is not a function`);
    }

    const values: WeakMap<object, V> = new WeakMap();
    const firstChanges: WeakMap<object, boolean> = new WeakMap();

    Object.defineProperty(target, propertyKey, {
      get(): V {
        return values.get(this);
      },
      set(value: V): void {
        const previousValue: V = values.get(this);
        let firstChange: boolean = firstChanges.get(this);

        if (!firstChange && previousValue === value) {
          return;
        }

        values.set(this, value);
        const currentValue: V = values.get(this);

        firstChanges.set(this, firstChange === undefined);
        firstChange = firstChanges.get(this);

        const simpleChange: SimpleChange<V> = {
          firstChange,
          previousValue,
          currentValue,
          isFirstChange: () => firstChange,
        };

        this[callbackName].call(this, value, simpleChange);
      }
    });
  };
}
