# ngx-on-change
## Description
Fully generic decorator to replace `Getter / Setter` and `ngOnChanges`. 

If the value of the class field changes, `@OnChange` decorator calls callback, whose name is supplied as a decorator argument.
Callback function takes exactly the same values as in the case of Angular `ngOnChanges`: the current value after the change and `SimpleChange`

    export type SimpleChange<V> = Readonly<{
      firstChange: boolean;
      previousValue: V;
      currentValue: V;
      isFirstChange: () => boolean;
    }>;
    
Decorator will throw an error if :
- argument is not passed
- callback definition does not exist in the class 
- callback definition is not a function
Decorator doesn't have to be used on `@Input` property binding, but whatever class fields you want to track change.

##Installation
First, you need to install the npm module:

`npm install ngx-on-change --save`

## Arguments
`callbackName: string` - the name of the method to be called when value change

## Usage
Instead of defining `Getter / Setter` for a class field, usually using an additional '_temp' field used only to be returned by the `get` method like below:

    
    export class ConfigComponent {
      @Input() set config(value: Config) {
        this._config = value;
        ...
      }
    
      get config(): Config {
        return this._config;
      }
    
      _config: Config;
    }


we can use the decorator on the class property and invoke the callback if the field value changes.

    export class ConfigComponent {
      @Input()
      @OnChange('onConfigChange')
      config: Config;
        
      onConfigChange(newValue: Config, change: SimpleChange) {
        consolg.log(newValue, change);
      }
    }
    
Similarly, we can replace the `ngOnChanges` method
    
    export class ConfigComponent extends OnChanges {
      @Input config1: Config;
      @Input config2: Config;
      @Input config3: Config;
              
      ngOnChanges({config1, config2, config3}}: SimpleChanges): void {
        if (config1.previousValue !=== config1.currentValue) {
          ...
        }
        if (config2.previousValue !=== config2.currentValue) {
          ...
        }   
        if (cconfig3.previousValue !=== config3.currentValue) {
          ...
        }
      }
    }
    
to make the code more scaled, e.g. by getting rid of multiple if statements:
    
    export class ConfigComponent extends OnChanges {
      @Input @OnChange('onConfig1Change) config1: Config;
      @Input @OnChange('onConfig2Change) config2: Config;
      @Input @OnChange('onConfig3Change) config3: Config;
          
      onConfig1Change(config1: Config, change: SimpleChange) {
        ...
      }
      onConfig2Change(config2: Config, change: SimpleChange) {
        ...
      }
      onConfig3Change(config3: Config, change: SimpleChange) {
        ...
      }
    }

        
## Additional info
This decorator is instance-targeted meaning it is invoked per class instance rather than once per class.
