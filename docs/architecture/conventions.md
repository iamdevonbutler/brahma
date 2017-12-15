# Conventions

It's called "Node" for a reason. Our projects deploy as a collection of distributed servers, a single app running running on each server, all communicating w/ eachother over TCP (and SSL over TCP). This architecture begets a series of "conventions", some of which differ from Node tradition.

## Argument destructuring
@todo show examples

## Env

### namming
@todo
Node precedent suggests naming your local `NODE_ENV` "development", your testing environment "test", and your production environment "production".
- names kinda long.
- stage is not specific enough. rarely do u stage changes on stage. it turns into the not dev branch.
use remote0 remote1

### values
any valid js type

## Decorators
@todo

## File handling
Node excels at handling lot's of concurrent request asynchronously. Unfortunately it makes a lackluster file server. Given a distributed server architecture, file IO add complications, mandating the use of a distributed file systems such as [Amazon S3](https://aws.amazon.com/s3). Don't fret, like all core Brahma plugins, there's a free tier.

## Dot syntax
- @todo
- give usage examples
- favors flat Objects and Arrays over nested data.
- explain why this is helpful for accessing object properties - interface would be weird w/o it
- keeps you config files looking simple - scales better

## $wrap it up
By convention, we prefix wrapped code, injected into our resources, w/ the dollar sign ("$").

This visual queue informs developers that the code's interface and/or data has been modified.

Here's a use case...Apps use many contributed libraries, and third party APIs. Often, the interfaces to these libraries clash w/ your coding style. e.g. Your memory cache uses callbacks instead of promises...In this case, you may want to wrap some of the cache functions to return promises, and inject the wrapped cache in your resources. You probably wont patch every cache function, so you also want to inject the original cache library just in case you're in need of more functionality.

```javascript
// ./config/apps.js
module.exports = ({env, load}) => {
  router: {
    ...common,
    redis: true,
    injectables: {
      $redis: load.resource('libraries', 'redis', {}),
    }
  }
};
```

```javascript
// ./endpoints/employees/getAll.js
module.exports = {
  location: 'router',
  async main({$redis}) {
    var result = await $redis.get('key');
    return result;
  }
};
```

## Namespacing
resourceType.name

Endpoints
app.group.name

@todo
