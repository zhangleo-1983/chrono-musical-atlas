import { describe, expect, it } from 'vitest';
import { NODES } from './index';
import { ARTIFACT_IMAGES } from './images';

const ALLOWED_LICENSES = new Set([
  'Public domain', 'CC0', 'CC BY 2.0', 'CC BY 3.0', 'CC BY-SA 1.0',
  'CC BY-SA 2.0', 'CC BY-SA 3.0', 'CC BY-SA 4.0',
]);

describe('artifact image metadata', () => {
  it('covers exactly every music node with a valid Commons image record', () => {
    const nodeIds = new Set(NODES.map((node) => node.id));
    expect(Object.keys(ARTIFACT_IMAGES).sort()).toEqual([...nodeIds].sort());
    for (const image of Object.values(ARTIFACT_IMAGES)) {
      expect(image.src.startsWith('https://upload.wikimedia.org/') || image.src.startsWith('https://thumb.wikimedia.org/')).toBe(true);
      expect(image.src).not.toContain('?');
      expect(image.page.startsWith('https://commons.wikimedia.org/wiki/File:')).toBe(true);
      expect(ALLOWED_LICENSES.has(image.license)).toBe(true);
      expect(image.credit.trim()).not.toBe('');
      expect(image.caption.trim()).not.toBe('');
    }
  });
});
