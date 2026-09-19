// FR-22: Child "I Arrived" Button, Manual Check-ins & Storage

export interface CheckInRecord {
  id: string;
  childId: string;
  timestamp: string;
  source: 'manual_button' | 'geofence_auto';
  locationAvailable: boolean;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  nearestZoneName?: string;
  userNote?: string;
}

export class CheckInService {
  private checkIns: CheckInRecord[] = [];

  // Child clicks "I arrived" button
  public recordManualCheckIn(params: {
    childId: string;
    location?: { latitude: number; longitude: number; accuracyMeters: number };
    nearestZoneName?: string;
    userNote?: string;
  }): CheckInRecord {
    const id = `chk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const record: CheckInRecord = {
      id,
      childId: params.childId,
      timestamp: now,
      source: 'manual_button', // FR-22: strictly distinguished from geofence_auto
      locationAvailable: Boolean(params.location),
      latitude: params.location?.latitude,
      longitude: params.location?.longitude,
      accuracyMeters: params.location?.accuracyMeters,
      nearestZoneName: params.nearestZoneName || (params.location ? 'Noma’lum joy' : 'Joylashuv aniqlanmadi'),
      userNote: params.userNote,
    };

    this.checkIns.unshift(record);
    return record;
  }

  public getCheckIns(childId?: string): CheckInRecord[] {
    return childId ? this.checkIns.filter((c) => c.childId === childId) : [...this.checkIns];
  }
}
