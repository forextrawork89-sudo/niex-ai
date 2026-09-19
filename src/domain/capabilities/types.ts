export type PlatformType = 'android_device_owner' | 'android_normal' | 'ios' | 'web_desktop' | 'unknown';

export type CapabilityStatus = 'supported' | 'degraded' | 'unsupported';

export type UIState = 'loading' | 'empty' | 'permission_denied' | 'unsupported' | 'offline' | 'stale' | 'error';

export interface PlatformCapabilities {
  platform: PlatformType;
  appBlock: CapabilityStatus;
  webFilter: CapabilityStatus;
  locationBackground: CapabilityStatus;
  smsOffline: CapabilityStatus;
  tamperPin: CapabilityStatus;
  screenTime: CapabilityStatus;
  newAppBlock: CapabilityStatus;
  quarantine: CapabilityStatus;
  cameraMicrophoneDetection: CapabilityStatus;
}

export function detectPlatformCapabilities(platform: PlatformType): PlatformCapabilities {
  switch (platform) {
    case 'android_device_owner':
      return {
        platform: 'android_device_owner',
        appBlock: 'supported',
        webFilter: 'supported',
        locationBackground: 'supported',
        smsOffline: 'supported',
        tamperPin: 'supported',
        screenTime: 'supported',
        newAppBlock: 'supported',
        quarantine: 'supported',
        cameraMicrophoneDetection: 'supported',
      };
    case 'android_normal':
      return {
        platform: 'android_normal',
        appBlock: 'degraded', // Accessibility / UsageStats based
        webFilter: 'supported', // VPN / Accessibility based
        locationBackground: 'supported',
        smsOffline: 'degraded', // Needs user runtime permission
        tamperPin: 'degraded', // Cannot prevent uninstall without Device Owner
        screenTime: 'supported',
        newAppBlock: 'unsupported', // Cannot block app install without Device Owner
        quarantine: 'degraded',
        cameraMicrophoneDetection: 'supported',
      };
    case 'ios':
      return {
        platform: 'ios',
        appBlock: 'supported', // via Screen Time API
        webFilter: 'supported', // via Content Filter
        locationBackground: 'degraded', // strict background location limits
        smsOffline: 'unsupported', // iOS does not allow programmatic SMS
        tamperPin: 'supported',
        screenTime: 'supported',
        newAppBlock: 'degraded', // App Store restrictions
        quarantine: 'unsupported', // Sandboxed filesystem
        cameraMicrophoneDetection: 'unsupported',
      };
    case 'web_desktop':
    default:
      return {
        platform: 'web_desktop',
        appBlock: 'unsupported',
        webFilter: 'supported',
        locationBackground: 'degraded', // Geolocation API requires page active / permission
        smsOffline: 'unsupported',
        tamperPin: 'degraded',
        screenTime: 'degraded',
        newAppBlock: 'unsupported',
        quarantine: 'unsupported',
        cameraMicrophoneDetection: 'unsupported',
      };
  }
}
