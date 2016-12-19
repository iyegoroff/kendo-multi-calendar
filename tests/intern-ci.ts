export * from './intern';

export const environments = [
    {
        browserName: 'iphone',
        version: ['8.1', '9.2'],
        recordVideo: false,
        recordScreenshots: false
    },
    {
        browserName: 'android',
        version: ['4.4', '5.1'],
        recordVideo: false,
        recordScreenshots: false
    },
    {
        browserName: 'chrome',
        version: ['53', '54'],
        platform: ['Windows 10'],
        recordVideo: false,
        recordScreenshots: false
    },
    {
        browserName: 'firefox',
        version: ['49', '50'],
        platform: ['Windows 10'],
        recordVideo: false,
        recordScreenshots: false
    },
    {
        browserName: 'MicrosoftEdge',
        version: ['13', '14'],
        platform: 'Windows 10',
        recordVideo: false,
        recordScreenshots: false
    },
    {
        browserName: 'internet explorer',
        version: ['10', '11'],
        platform: 'Windows 7',
        recordVideo: false,
        recordScreenshots: false
    },
    {
        browserName: 'safari',
        version: ['9', '10'],
        platform: 'OS X 10.11',
        recordVideo: false,
        recordScreenshots: false
    }
];

export const tunnel = 'SauceLabsTunnel';

export const maxConcurrency = 5;

export const reporters = ['Runner'];
