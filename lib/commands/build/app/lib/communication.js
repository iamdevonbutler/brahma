const self = module.exports;

const connection = self.connect({
  clientIP: '',
  networkIps: [],
});

// connect to servers in networkIPs
// when connecting it retrys for 30 seconds before SIGTERM if there are no clients available
// optional auth for connection
// optional ssl
// ask connected client for other networkIPs
// connect to those other servers
// ask them for networkIPs, and if u have nothing new then your good. if not itterate.
// if you request a client that 404s, u retry 3 times.
// if the client is offline u let the other clients know.
// if they have a client u dont, they let that client know, and let u know about the client.
// if a client 404s w/ another client, it lets u know.
// if you have clients it doesnt, you let it know about them.
// if a client is being shutdown, it broadcasts to all other clients. they let others know about the news.
// all events are timestamped.
// each client keeps track of last offline time and last online time for all clients in case they get a online followed by a late offline relay.
// pings and asks for updated data every 5 seconds.

// need to group networkIPs by type.
// special error for u to log. if cron sends a message to a worker expecting a reply, cron dies, the worker replys, the reply retuns a 404, error that the job finished but the requesting resrouce did not receive the reply because it died.

// methods?
// - broadcast - all clients on system, or all clients in cluster (by type)
// - call

// timeout
// reply

// load balancing number system. each cluseter load balances among itself.
// @todo how to build implementation API that calls each server by name?

// round robin logic
// find your order amongs you type peers
// get order of client peers
// var start = new Router();
//

// http api for network info.

class router {
  constructor(startPos, siblings, friends) {
    if (!siblings.length || !friends.length) return null;
    this.siblings = siblings;
    this.friends = friends;
    this.pos = this.getStartPosition(startPos);
  }
  loop(num) {
    var i = 0;
    return () => {
      if (i === num) {
        i = 1;
      }
      else {
        i++;
      }
      return i;
    };
  }
  getStartPosition(startPos) {
    var sibLoop = this.loop(this.siblings.length);
    var friendLoop = this.loop(this.friends.length);
    while (sibCount = sibLoop()) {
      friendCount = friendLoop();
      if (sibCount === startPos) return friendCount;
    }
  }
  increment() {
    if (this.pos++ > this.friends.length) {
       this.pos = this.pos - this.friends.length - 1;
       this.increment();
    }
    return this.pos;
  }
  update(friends) {'
  ..wjat if friends inc to 2 from 1.'
    this.friends = friends;
  }
}
