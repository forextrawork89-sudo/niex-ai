import { describe, it, expect } from 'vitest';
import { loadKBFolder as loader } from './kb-folder-loader';
import * as fs from 'fs';
import * as path from 'path';

describe('KB folder loader multimodal additions', () => {
  it('loads authored NIEX multimodal guidance files via encryptedFiles map', async () => {
    const base = path.resolve(process.cwd(), 'knowledge_base');
    const files = [
      'clothing/ni_ex_clothing_context_multimodal.md',
      'pose/ni_ex_pose_context_multimodal.md',
      'movement/ni_ex_movement_context_multimodal.md',
      'camera_focus/ni_ex_camera_focus_multimodal.md',
      'emotion/ni_ex_facial_emotion_context.md',
      'scene_understanding/ni_ex_temporal_persistence.md',
      'clothing/ni_ex_clothing_pose_combinations.md',
      'pose/ni_ex_pose_camera_combinations.md',
      'movement/ni_ex_movement_camera_combinations.md',
      'context/ni_ex_multisignal_combinations.md',
      'context/ni_ex_uzbek_social_media_trends.md',
    ];

    const encMap: Record<string, string> = {};
    for (const f of files) {
      const p = path.join(base, f);
      encMap[f] = fs.readFileSync(p, 'utf8');
    }

    const res = await loader({ encryptedFiles: encMap } as any);
    expect(res.loaded).toBe(files.length);
    for (const f of files) {
      const folder = f.split('/')[0];
      expect(res.by_folder[folder]).toBeTruthy();
    }
  });
});
