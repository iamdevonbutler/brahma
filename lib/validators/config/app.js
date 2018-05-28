// @todo does the entire obj get injected or just a portion.
module.exports = {
  app(obj) {
    if (obj.https && obj.http) {
      console.error(`"https" and "http" cannot both be TRUE (${appName})`)
    }


  },
};
