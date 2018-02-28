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

// @todo C also forces https, prevents DDoS, ratelimits, letsencrypt, and forwards asset requests to s3 w/ static caching.
// @todo make it easy to change the nodeUpdateInterval. if ur twitter and ur expecting a superbowl spike u may want to change it to like 5 seconds.
// @note node group ip selection is a round robin. viable strat because working w/ requests of similar durations.

var lastNodeUpdate;
var nodeUpdateInterval = 1000*60;

var endpoints = {
  'employees.getThing': {
    nodeGroup: 0,
    perfAvg: 5,
    perfHistory: [],
  },
  'employees.updateThing': {
    nodeGroup: 0,
    perfAvg: 10,
    perfHistory: [],
  },
};

var nodeGroupIPs = [
  [127.0.0.1, 127.0.0.2, 127.0.0.3],
  [127.0.0.4, 127.0.0.5],
];

var nodeGroups = [
  ['name', 'name1'], // group0
  ['name2', 'name3'], // group0
];

async function sendResponse(res) {};

async function executeRequest(req, node) {
  return await request(req, node.ip)
};

function selectNode(req) {
  for (let name in endpoints) {
    if (name === req.name) {
      let ip = nodeGroupIPs[endpoints[name].nodeGroup].shift();
      nodeGroupIPs[endpoints[name].nodeGroup].push(ip);
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

// 3 4 4 5 5 6 6 7 9
// 10 17 20 20 20
// 34
// 50 50
// 63
// 200
var x = [
function updateNodes() {
  for (let name in endpoints) {

  }

  lastNodeUpdate = Date.now();
};

async function handleRequest(req) {
  var startTime = Date.now();
  var node = selectNode(req);
  var res = await executeRequest(req, node);
  updateEndpointHistory(req, startTime);
  if (startTime - lastNodeUpdate >= nodeUpdateInterval) {
    updateNodes();
  };
  sendResponse(res);
};

//////////////// init

initializeNodeGroups(); // @todo

//////////////// test

handleRequest({
  name: '',
  url: '',
  body: '',
  address: '',
});
