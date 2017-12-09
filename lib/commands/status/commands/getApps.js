const self = module.exports;

self.main = async ({apps}) => {
  const apps1 = apps ? Object.keys(apps) : [];
  return {
    info: apps1.length ? [apps1.map(item => `"${item}"`).join(', ')] : null,
    errors: !apps1.length ? [`No apps (apps.js)`] : null,
  };
};
