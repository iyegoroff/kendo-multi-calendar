export const environments = [
    { browserName: 'chrome' },
    { browserName: 'firefox' }
];

export const tunnel = 'SeleniumTunnel';

export const tunnelOptions = {
    drivers: [ 'chrome', 'firefox' ]
};

export const reporters = [
    'Runner',
    {
        id: 'node_modules/remap-istanbul/lib/intern-reporters/JsonCoverage',
        filename: 'coverage/coverage-final.json'
    }
];

export const loaderOptions = {
    packages: [
        { name: 'dojo', location: 'node_modules/dojo' }
    ]
};

export const functionalSuites = [ 'build/tests/functional/index' ];

export const excludeInstrumentation = /^(?:build|tests|node_modules)\//;
