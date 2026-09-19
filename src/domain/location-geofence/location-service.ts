// FR-17: Latest Location Point, Accuracy, Telemetry & Stale Location Handling (15+ min => "last known")

export interface LocationPoint {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  measuredAt: string; // Measured on device
  receivedAt: string; // Received by backend
  batteryPercentage: number;
  isCharging: boolean;
  networkState: 'wifi' | 'cellular' | 'none';
}

export interface LatestLocationView {
  point: LocationPoint | null;
  isStale: boolean;
  statusLabel: 'current' | 'last_known' | 'unavailable';
  staleMinutes: number;
  displayText: string;
}

const STALE_THRESHOLD_MINUTES = 15;

export class LocationService {
  private latestPoint: Map<string, LocationPoint> = new Map(); // childId -> LocationPoint

  public updateLocation(childId: string, point: Omit<LocationPoint, 'receivedAt'>): LocationPoint {
    const fullPoint: LocationPoint = {
      ...point,
      receivedAt: new Date().toISOString(),
    };
    this.latestPoint.set(childId, fullPoint);
    return fullPoint;
  }

  public getLatestLocation(childId: string, currentDate = new Date()): LatestLocationView {
    const point = this.latestPoint.get(childId);
    if (!point) {
      return {
        point: null,
        isStale: true,
        statusLabel: 'unavailable',
        staleMinutes: 0,
        displayText: 'Geolokatsiya ma’lumoti mavjud emas.',
      };
    }

    const measuredMs = new Date(point.measuredAt).getTime();
    const currentMs = currentDate.getTime();
    const diffMinutes = Math.max(0, Math.floor((currentMs - measuredMs) / (60 * 1000)));

    // FR-17 Invariant: 15+ minutes old => "last known"
    const isStale = diffMinutes >= STALE_THRESHOLD_MINUTES;
    const statusLabel: LatestLocationView['statusLabel'] = isStale ? 'last_known' : 'current';

    const displayText = isStale
      ? `Oxirgi ma’lum manzil (${diffMinutes} daqiqa oldin qayd etilgan, aniqlik: ±${Math.round(point.accuracyMeters)}m).`
      : `Hozirgi manzil (aniqlik: ±${Math.round(point.accuracyMeters)}m, batareya: ${point.batteryPercentage}%).`;

    return {
      point,
      isStale,
      statusLabel,
      staleMinutes: diffMinutes,
      displayText,
    };
  }
}
