#Considerations for a Fluent Interface

Is the interface directly on the object? Or is there a "builder"?
    How do you do a read-only object with fluent iface?
Nesting configuration (if your "Person" contains other persons?)
Covariance injection (`MyClass : BaseClass<MyClass>`)
Config delegates
