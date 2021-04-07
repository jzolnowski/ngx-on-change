export function OnChange<K extends keyof T, T extends object = any>(
  callbackName: string
): (target: T, propertyKey: K) => void {
  return (target: T, propertyKey: K): void => {
    const originalDescriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(target, propertyKey);
    const values: WeakMap<T, T[K]> = new WeakMap();

    Object.defineProperty(target, propertyKey, {
      set(prototypeValue: T[K]): T[K] {
        Object.defineProperty(this, propertyKey, {
          get(): T[K] {
            return originalDescriptor ? originalDescriptor.get.call(this) : values.get(this);
          },
          set(instanceValue: T[K]): void {
            const previousValue: T[K] | undefined = values.get(this);

            if (previousValue !== instanceValue) {
              values.set(this, instanceValue);

              originalDescriptor?.set.call(this, instanceValue);
              this[callbackName].call(this, instanceValue, previousValue);
            }
          }
        });

        return (this[propertyKey] = prototypeValue);
      }
    });
  };
}
