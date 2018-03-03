export * from './intern-ci-minimal';

export const environments = [
  {
    browserName: 'chrome',
    version: ['60'],
    platform: ['Windows 10'],
    recordVideo: false,
    recordScreenshots: false
  },
  {
    browserName: 'firefox',
    version: ['57', '58'],
    platform: ['Windows 10'],
    marionette: true,
    recordVideo: false,
    recordScreenshots: false
  },
  {
    browserName: 'MicrosoftEdge',
    version: ['16'],
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
  }
];

export const reporters = ['Runner'];

export const excludeInstrumentation = true;
