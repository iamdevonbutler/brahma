# Testing

talk about why we dont need CI

`testing`
- in ./tests, u should be able to write a test, that is used by multiple apps. in app config, pull in tests, do some wildcard path shit idk.
- @todo for resources/middleware/decorators/services and other shit? see if i can implement some of my new testing style
- i want to use mocha and chai. i could integrate this so that these tools can be replaced by the user. will prob just use as defaults but in future versions.
- write your tests...last?
  - generate tests feature. generates tests for resources, ...,. if test does not yet exist.
  - list empty tests - you can keep calling generate tests as you continue to develope, eventually your will forget about some. this helps you get back to them.
  - remove tests for shit that doesnt exist (y/N prompt)
- want ot be able to run all tests, one test, or match wildcard...so api.* all api tests
- WILL WANT A WAY TO RUN TESTS ON SERVER - should be called automatically on update.
- --watch. test on save tdd feature - when ur writing a util or something, tell it what the name of the file is, and on save, it will run your test. `test utils.thenify --watch`
- how to load fixtures
- tests: {unit, system}
- property name is "test" not "tests" - throw special error.
- how to emlutate before each? and before? and other scripts?
