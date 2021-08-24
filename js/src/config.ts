const liquidityMiningConfig = {
    homestead: {
        reportsDirectory: `../reports/`,
        reportFilename: '_totals.json',
        jsonSnapshotFilename: '_current.json',
        fleekNamespace: 'balancer-claims',
        offset: 20,
    },
    'homestead-lido': {
        reportsDirectory: `../reports/`,
        reportFilename:
            '__ethereum_0x5a98fcbea516cf06857215779fd812ca3bef1b32.json',
        jsonSnapshotFilename: '_current-lido.json',
        fleekNamespace: 'balancer-claims-lido',
        offset: 63,
    },
    kovan: {
        reportsDirectory: `../reports-kovan/`,
        reportFilename: '_totals.json',
        jsonSnapshotFilename: '_current.json',
        fleekNamespace: 'balancer-claims-kovan',
        offset: 0,
    },
};

const network = process.env.NETWORK || 'homestead'; // || 'kovan' || 'homestead-lido'
const config = liquidityMiningConfig[network];

module.exports = { liquidityMiningConfig, network, config };