function waitTime(interval = 10000, frequency = 1, time_per_request = 10) {
  return (requestDuration * interval) - (frequency * interval); // 9000 ms after a 1 minute interval
}

////////////////////////////////////////////////////////////////

// @todo C also forces https, prevents DDoS, ratelimits, letsencrypt, and forwards asset requests to s3 w/ static caching.
// @todo make it easy to change the nodeUpdateInterval. if ur twitter and ur expecting a superbowl spike u may want to change it to like 5 seconds.
// @note node group ip selection is a round robin. viable strat because working w/ requests of similar durations.
// @note so we are going to need a post deploy primer, - make it less time than the update interval

var lastNodeUpdateTime;
var lastNodeUpdateDuration; //@todo

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
  ['127.0.0.1', '127.0.0.2', '127.0.0.3'],
  ['127.0.0.4', '127.0.0.5'],
];

var nodeGroups = [
  ['name', 'name1'], // group0
  ['name2', 'name3'], // group0
];

// - perfAvg (relative to other endpoints),
// - actual perf (realtive to other endpoints)
// - endpoint call frequency
// - #nodes,
// - cron tasks

// 3 4 4 5 5 6 6 7 9
// 10 17 20 20 20
// 34
// 50 50 51 52 55 55 55 55 57 57
// 63
// 200

var requests = [
  [{name, duration, perfAvg, group, timestamp}], // group 0
  [{name, duration, perfAvg, group, timestamp}], // group 1
];

function deployNodeGroups() {
  // @todo save duration "lastNodeUpdateDuration"
};

function organizeGroups(requests, numNodes = 1, prevWaits = null) {
  function addNodesToGroup(group, numNodes) {
    while (numNodes--) {
      group.push([]);
    }
  };

  function calculateWaitPerGroup(group) {
    var wait = group.map((group1, i) => {
      let startTime = group1[0].timestamp;
      return group1.reduce((wait1, req) => {
        wait1 += req.perfAvg - (startTime - req.timestamp);
        startTime = req.timestamp;
        return wait1;
      }, 0);
    });
    return wait;
  };

  let groups = [], waits = [];
  requests.forEach((group, i) => {
    groups.push([]);
    addNodesToGroup(groups[i], numNodes);
    group.forEach((req, ii) => {
      groups[i][ii % numNodes].push(req);
    });
    var wait = calculateWaitPerGroup(groups[i]);
    waits.push(wait);
  });
  // if (!prevWaits || ) { // @todo
    // var newGroups = organizeGroups(requests, numNodes++, waits);
  // }
  // return groups;
};

function configureNodeGroups() {
  // at first deploy 2 nodes.
  // one handles short requests 1 handles long requests.
  // save all requests.
  // after X time (1 min) recalibrate.
    // we can modify 'the numer of nodes per group', 'the number of groups' and 'group stratisfication'
      // what if we reoptimized based on past data, taking into consideration crons that fall in the next interval.
      // we can try to optimize based on all 3 tehniques listed above.
  // after i complete the above, make sure there's a way to rock realtime servers.

  [groups]


  lastNodeUpdateTime = Date.now();
};

async function handleRequest(req) {
  var node = selectNode(req);
  var startTime = Date.now();
  requests.push({name: req.name, time: startTime}); // @todo push to propert group.
  var res = await executeRequest(req, node);
  updateEndpointPerfHistory(req, startTime);
  if (startTime - lastNodeUpdateTime >= nodeUpdateInterval) {
    let groups = configureNodeGroups();
    deployNodeGroups(groups);
  };
  sendResponse(res);
};

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

function updateEndpointPerfHistory(req, startTime) {
  var endTime = Date.now();
  endpoints[req.name].perfHistory.unshift(endTime - startTime);
  endpoints[req.name].perfHistory.unshift(endTime);
};

//////////////// init

configureNodeGroups(true);

//////////////// test

handleRequest({
  name: '',
  url: '',
  body: '',
  address: '',
});
