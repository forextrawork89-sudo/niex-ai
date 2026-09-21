'use strict';

module.exports = {
  SecretManager: require('./secretManager').SecretManager,
  ...require('./ed25519Utils'),
  DeviceRegistry: require('./deviceRegistry').DeviceRegistry,
  NonceStore: require('./nonceStore').NonceStore,
  SessionStore: require('./sessionStore').SessionStore,
  PolicyManager: require('./policyManager').PolicyManager,

  ...require('./ssrfGuard'),
  securityHeaders: require('./securityHeaders').securityHeaders,
  ...require('./rateLimit'),

  ...require('./pinGuard'),
  OtpService: require('./otpService').OtpService,

  ...require('./webhookGuard'),

  ...require('./redactor'),

  LocationGuard: require('./locationGuard').LocationGuard,

  promptGuard: require('./promptGuard'),
};