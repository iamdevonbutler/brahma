const jackrabbit = require('jackrabbit');
const {RABBIT_URL} = process.env;
const {logger} = require('../services');
const {addShutdownCallback} = require('../connections');
const {throttleByTime, callNTimes} = require('../utils');

module.exports = ({shutdownApp}) => {
  var closedByClient;
  return new Promise((resolve, reject) => {
    logger.info('rabbit.startup.request');

    const rabbit = jackrabbit(RABBIT_URL);
    const {onConnection} = rabbit;
    const {amqp} = rabbit.getInternals();

    function reconnect() {
      var attempts = 0, locked = false;
      return function connect(err) {
        if (closedByClient) return;
        if (attempts === 0) {
          logger.error('rabbit.connection.error');
          logger.error('rabbit.connection.reconnecting');
        }
        if (!locked) {
          locked = true;
          amqp.connect(RABBIT_URL, (err, conn) => {
            locked = false;
            if (attempts > 25) {
              logger.fatal('rabbit.connection.error');
              return shutdownApp(1);
            }
            if (err) {
              attempts += 1;
              setTimeout(() => {
                onConnection(err, conn);
              }, 200);
            }
            else {
              attempts = 0;
              onConnection(err, conn);
            }
          });
        }
      };
    }

    rabbit.on('connected', () => {
      logger.info('rabbrabbit.connection.connected');
      resolve(rabbit);
    });

    rabbit.on('error', reconnect());

    rabbit.on('close', () => {
      if (!closedByClient) logger.info('rabbit.connection.close');
    });

    addShutdownCallback(() => {
      closedByClient = true;
      logger.info('rabbit.shutdown.request');
      return new Promise((resolve, reject) => {
        rabbit.close((err) => {
          if (err) {
            logger.error(err, 'rabbit.shutdown.error');
            reject(err);
          }
          else {
            logger.info('rabbit.shutdown.success');
            resolve();
          }
        });
      });
    });

  });
};
