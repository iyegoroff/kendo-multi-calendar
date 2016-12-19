export * from './intern';

export const environments = [
    {
        browserName: 'chrome',
        version: ['54'],
        platform: ['Windows 10'],
        recordVideo: false,
        recordScreenshots: false
    }
];

export const tunnel = 'SauceLabsTunnel';

export const maxConcurrency = 5;
