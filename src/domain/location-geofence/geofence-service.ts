// FR-19: Safe Zones, Geofencing, Hysteresis (R vs 1.3R), 2m Dwell Time & Accuracy Uncertainty Guard

export type SafeZoneType = 'home' | 'school' | 'custom';

export interface SafeZone {
  id: string;
  name: string;
  type: SafeZoneType;
  latitude: number;
  longitude: number;
  radiusMeters: number; // R
  activeDaysOfWeek: number[]; // 0 = Sun, 1 = Mon...
  activeStartHour?: number;
  activeEndHour?: number;
  recipients: string[]; // guardian IDs
}

export type GeofenceState = 'inside' | 'outside' | 'uncertain';

export interface GeofenceEvaluationResult {
  zoneId: string;
  zoneName: string;
  state: GeofenceState;
  distanceMeters: number;
  accuracyMeters: number;
  dwellMinutes: number;
  shouldNotify: boolean;
  notificationEvent?: 'entered' | 'exited';
  reason: string;
}

// Haversine formula to calculate distance between two coordinates in meters
export function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export class GeofenceService {
  private zones: Map<string, SafeZone> = new Map();
  // State memory: key `${childId}:${zoneId}` -> { state, stateSince, lastNotifiedState }
  private stateMemory: Map<
    string,
    {
      state: GeofenceState;
      stateSince: string;
      lastNotifiedEvent?: 'entered' | 'exited';
    }
  > = new Map();

  public addZone(zone: Omit<SafeZone, 'id'>): SafeZone {
    const id = `zone-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newZone: SafeZone = { ...zone, id };
    this.zones.set(id, newZone);
    return newZone;
  }

  public getZones(): SafeZone[] {
    return Array.from(this.zones.values());
  }

  public evaluateLocation(params: {
    childId: string;
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    currentDate?: Date;
  }): GeofenceEvaluationResult[] {
    const now = params.currentDate || new Date();
    const results: GeofenceEvaluationResult[] = [];

    for (const zone of this.zones.values()) {
      const memKey = `${params.childId}:${zone.id}`;
      const memory = this.stateMemory.get(memKey) || {
        state: 'outside',
        stateSince: now.toISOString(),
      };

      const dist = haversineDistanceMeters(params.latitude, params.longitude, zone.latitude, zone.longitude);

      // FR-19 Invariant 1: Inaccurate location => UNCERTAIN.
      // If accuracy is worse than 100m or greater than 50% of zone radius, avoid false triggers!
      if (params.accuracyMeters > 100 || params.accuracyMeters > zone.radiusMeters * 0.5) {
        results.push({
          zoneId: zone.id,
          zoneName: zone.name,
          state: 'uncertain',
          distanceMeters: Math.round(dist),
          accuracyMeters: params.accuracyMeters,
          dwellMinutes: 0,
          shouldNotify: false,
          reason: `Geolokatsiya aniqligi (±${Math.round(params.accuracyMeters)}m) xavfsiz zona uchun yetarli emas. Soxta xabarnoma chiqarilmaydi.`,
        });
        continue;
      }

      // FR-19 Invariant 2: Hysteresis logic
      // Entry radius = R
      // Exit radius = 1.3 * R
      const exitRadius = zone.radiusMeters * 1.3;
      let rawState: GeofenceState = memory.state;

      if (memory.state === 'outside' || memory.state === 'uncertain') {
        if (dist <= zone.radiusMeters) {
          rawState = 'inside';
        }
      } else if (memory.state === 'inside') {
        if (dist > exitRadius) {
          rawState = 'outside';
        }
      }

      // FR-19 Invariant 3: Dwell time 2 minutes
      let shouldNotify = false;
      let notificationEvent: 'entered' | 'exited' | undefined;

      const stateDurationMs = now.getTime() - new Date(memory.stateSince).getTime();
      const dwellMinutes = Math.floor(stateDurationMs / (60 * 1000));

      if (rawState !== memory.state) {
        // State just transitioned
        memory.state = rawState;
        memory.stateSince = now.toISOString();
      } else {
        // State has been stable
        if (dwellMinutes >= 2) {
          if (rawState === 'inside' && memory.lastNotifiedEvent !== 'entered') {
            shouldNotify = true;
            notificationEvent = 'entered';
            memory.lastNotifiedEvent = 'entered';
          } else if (rawState === 'outside' && memory.lastNotifiedEvent !== 'exited') {
            shouldNotify = true;
            notificationEvent = 'exited';
            memory.lastNotifiedEvent = 'exited';
          }
        }
      }

      this.stateMemory.set(memKey, memory);

      results.push({
        zoneId: zone.id,
        zoneName: zone.name,
        state: rawState,
        distanceMeters: Math.round(dist),
        accuracyMeters: params.accuracyMeters,
        dwellMinutes,
        shouldNotify,
        notificationEvent,
        reason:
          rawState === 'inside'
            ? `${zone.name} hududida (${Math.round(dist)}m markazdan).`
            : `${zone.name} hududidan tashqarida (${Math.round(dist)}m markazdan).`,
      });
    }

    return results;
  }
}
