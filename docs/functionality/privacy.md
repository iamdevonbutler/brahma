# Privacy

## ./private
@todo structure

## .private()
- private.read('path', encoding) // reads files fs.readFileSync
- private.load() // loads resources

## Collaboration
Implementations of Brahma privacy tooling need to communicate the contents of their ".gitngnored" `./private` directory to other collaborators; otherwise, developers would `clone` a repo w/ broken references to private information.

Currently, Brahma doesn't assist in this process, favoring documentation and manual communication as acceptable solutions...but we are open to suggestions.

## .gitignore
Make sure the `./private` directory is included in your `.gitignore`.

@todo
local -> remote transfer. some data will be different depending on env. different api keys perhaps.
