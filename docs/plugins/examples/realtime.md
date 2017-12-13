# Plugin `brahma-app-realtime`

realtime app
- handshake
  - client connects
  - server asks for JWT
  - server uses JWT to verify (via mamaba communication syntax)
  - server asks client for subscriptions
  - client sends subscriptions
  - server associates subscriptions list w/ socket client ID.
  - server listens for all events
    - for each event, get each users subs w/ filters, check to see if each user
    gets updated, and update
  - maybe we can integrate a restful interface to add montioring/control
* this is a reminder to let me know that our apps need a way to communicate that is secure.
