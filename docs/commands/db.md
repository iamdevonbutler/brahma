## brahma `db`

### Commands
```
$brahma db ... CHOOSE DB
$brahma db run commandName
$brahma db run --help (lists comands)
$brahma db import strategy
$brahma db export strategy
$brahma db download strategy
$brahma db backup strategy
$brahma db connect (iteractive shell)
$brahma db custom (extended by database plugins)

```

`db`
- run `db` - choose database (mongodb (pluginName)) -> view commands provided by plugin.

@todo strategies can be custom (?) or registered by plugins (database plugins)

@todo database backups - scheduling them? could use cron.
