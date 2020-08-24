const fleek = require('@fleekhq/fleek-storage-js');
const requireContext = require('require-context');

const NAMESPACE = 'balancer-claim';
const SNAPSHOT_KEY = `${NAMESPACE}/snapshot`;
const config = {
  apiKey: process.env.FLEEK_API_KEY,
  apiSecret: process.env.FLEEK_API_SECRET
};

async function getSnapshot() {
  const input = config;
  input.key = SNAPSHOT_KEY;
  input.getOptions = ['data'];
  const result = await fleek.get(input);
  return JSON.parse(result.data.toString());
}

async function uploadJson(key, body) {
  const input = config;
  input.key = key;
  input.data = JSON.stringify(body);
  const result = await fleek.upload(input);
  return {
    key,
    ipfsHash: result.hashV0
  };
}

const requireFile = requireContext(`${__dirname}/reports`, true, /_totals.json$/);
const files = Object.fromEntries(requireFile.keys().map(
  (fileName) => [fileName.replace('/_totals.json', ''), requireFile(fileName)]
));

(async () => {
  const snapshot = await getSnapshot();
  console.log('Last snapshot', snapshot);

  const promises = [];
  Object.entries(files).forEach(([week, file]) => {
    if (!snapshot[week]) {
      console.log(`Publish week ${week}`);
      const key = `${NAMESPACE}/reports/${week}`;
      promises.push(uploadJson(key, file));
    }
  });

  if (promises.length === 0) {
    console.log('Already updated');
    return;
  }

  try {
    await Promise.all(promises).then(result => {
      result.forEach(upload => {
        const week = upload.key.replace(`${NAMESPACE}/reports/`, '');
        snapshot[week] = upload.ipfsHash;
      })
    });
    const snapshotUpload = await uploadJson(SNAPSHOT_KEY, snapshot);
    console.log('Successfully published', snapshotUpload);
  } catch (e) {
    console.error(e);
  }
})();