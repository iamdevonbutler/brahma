// delegation. an equation takeIng:
// - droplet spinup time
// - perfAvg (relative to other endpoints),
// - actual perf (realtive to other endpoints)
// - endpoint call frequency
// - #nodes,
// - cron tasks
//
// say a endpoint is called (perf === 50ms)
// LB to a medium node. nodes can be small, medium, large, or ...
//
// 3 4 4 5 5 6 6 7 9
// 10 17 20 20 20
// 34
// 50 50
// 63
// 200

function waitTime(interval = 10000ms, frequency = 1 req/ms, time per request = 10ms) {
  return (requestDuration * interval) - (frequency * interval); // 9000 ms after a 1 minute interval
}

// over the next 15 seconds, 30 seconds, ...., highest perfAvg.
function predictTraffic() {

};

function groupWaitTime([3,4,4,5,5,6,6,7,9]) {
  return obj.reduce((p, c) => {
    return p+c;
  }, 0);
};

0-9   groupWaitTime(predictTraffic(obj, 1000*15))
10-19 groupWaitTime(predictTraffic(obj, 1000*15))
20-29 groupWaitTime(predictTraffic(obj, 1000*15))

[1,2,...29,30]
function optimizeGroups(groups) {
  var matrix = possibilities(groups);
  var waits = matrix.map((row, i) => {
    var numNodes = 0;
    while (numNodes++) {
      // @todo
    }
    return {
      key,
      time: groupWaitTime(row),
      numNodes: getNumNodes(groupWaitTime(row), waitMultiplier)
    }
  })
  waits = orderAsc(waits);
  var fastestConfig = waits.find(wait => {
    if (perfAvg * waitMultiplier < wait) return wait;
  });
  return fastestConfig;
}

function getNumNodes(time, waitMultiplier, averagePerf) {};

////////////////////////////////////////////////////////////////
var lastNodeUpdate;
var nodeUpdateInterval = 1000*60;

var endpoints = {
  'employees.getThing': {
    ips: [127.0.0.1, 127.0.0.2, 127.0.0.3],
    perfAvg: 5,
    perfHistory: [],
  },
  'employees.updateThing': {
    ips: [127.0.0.1, 127.0.0.2, 127.0.0.3],
    perfAvg: 10,
    perfHistory: [],
  },
};

var nodes = {

};

async function sendResponse(res) {};

async function executeRequest(req, node) {
  return await request(req, node.ip)
};

// function getRequestHandler(req) {
//   return {
//     endpointName: 'name',
//     perfAvg: 10, // ms
//     perHistory: [1519830352, 18, 1519830352, 22],
//   };
// };

function selectNode(req) {
  for (let name in endpoints) {
    if (name === req.name) {
      let ip = endpoints[name].ips.pop(); // round robin, works here because working w/ requests of similar
      endpoints[name].ips.unshift(ip);
      return ip;
    }
  }
};

function updateEndpointHistory(req, startTime) {
  var endTime = Date.now();
  endpoints[req.name].perfHistory.unshift(endTime - startTime);
  endpoints[req.name].perfHistory.unshift(endTime);
};

// - droplet spinup time
// - perfAvg (relative to other endpoints),
// - actual perf (realtive to other endpoints)
// - endpoint call frequency
// - #nodes,
// - cron tasks
function updateNodes() {
  lastNodeUpdate = Date.now();
};

async function handleRequest(req) {
  var startTime = Date.now();
  var node = selectNode(req);
  var res = await executeRequest(req, node);
  updateEndpointHistory(req, startTime);
  if (startTime - lastNodeUpdate > nodeUpdateInterval) {
    updateNodes();
  };
  sendResponse(res);
};

handleRequest({
  name: '',
  url: '',
  body: '',
  address: '',
});
