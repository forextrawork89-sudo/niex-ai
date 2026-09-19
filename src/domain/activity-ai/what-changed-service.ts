// FR-45: "What Changed" Block (Max 5-row Diff, Guardian Last-Seen Tracking, Empty State)

export type ChangeRowType = 'new_app' | 'block_count' | 'permission_request' | 'capability_change';

export interface ChangeDiffRow {
  type: ChangeRowType;
  title: string;
  detail: string;
  occurredAt: string;
}

export interface WhatChangedBlockState {
  guardianId: string;
  lastSeenAt: string;
  diffRows: ChangeDiffRow[]; // Maximum 5 rows
  isEmpty: boolean;
  emptyMessage: string;
}

export class WhatChangedService {
  private guardianLastSeen: Map<string, string> = new Map(); // guardianId -> ISO timestamp

  public setGuardianLastSeen(guardianId: string, timestampIso = new Date().toISOString()) {
    this.guardianLastSeen.set(guardianId, timestampIso);
  }

  public getGuardianLastSeen(guardianId: string): string {
    return this.guardianLastSeen.get(guardianId) || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  }

  public computeWhatChanged(params: {
    guardianId: string;
    newApps: Array<{ appName: string; installedAt: string }>;
    blocks: Array<{ domain: string; blockedAt: string }>;
    permissionRequests: Array<{ target: string; requestedAt: string }>;
    capabilityChanges: Array<{ description: string; changedAt: string }>;
  }): WhatChangedBlockState {
    const lastSeen = this.getGuardianLastSeen(params.guardianId);
    const rows: ChangeDiffRow[] = [];

    // 1. New Apps since last seen
    for (const app of params.newApps) {
      if (app.installedAt > lastSeen) {
        rows.push({
          type: 'new_app',
          title: 'Yangi ilova o‘rnatildi',
          detail: app.appName,
          occurredAt: app.installedAt,
        });
      }
    }

    // 2. Blocks since last seen
    const newBlocks = params.blocks.filter((b) => b.blockedAt > lastSeen);
    if (newBlocks.length > 0) {
      rows.push({
        type: 'block_count',
        title: 'Saytlar bloklandi',
        detail: `${newBlocks.length} ta xavfli/cheklangan manzil bloklandi (${newBlocks.map((b) => b.domain).slice(0, 2).join(', ')})`,
        occurredAt: newBlocks[0].blockedAt,
      });
    }

    // 3. Permission requests since last seen
    for (const req of params.permissionRequests) {
      if (req.requestedAt > lastSeen) {
        rows.push({
          type: 'permission_request',
          title: 'Yangi ruxsat so‘rovi',
          detail: req.target,
          occurredAt: req.requestedAt,
        });
      }
    }

    // 4. Capability changes since last seen
    for (const cap of params.capabilityChanges) {
      if (cap.changedAt > lastSeen) {
        rows.push({
          type: 'capability_change',
          title: 'Tizim imkoniyati o‘zgardi',
          detail: cap.description,
          occurredAt: cap.changedAt,
        });
      }
    }

    // Sort descending by occurredAt
    rows.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

    // FR-45 Invariant: Maximum 5 rows
    const diffRows = rows.slice(0, 5);
    const isEmpty = diffRows.length === 0;

    return {
      guardianId: params.guardianId,
      lastSeenAt: lastSeen,
      diffRows,
      isEmpty,
      emptyMessage: 'Oxirgi kirishingizdan buyon muhim o‘zgarishlar yuz bermadi.',
    };
  }
}
