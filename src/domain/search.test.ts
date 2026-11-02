import { describe, expect, it } from 'vitest';
import { NODES } from '../data';
import { searchNodes } from './search';

describe('search', () => {
  it('matches multilingual node fields and prioritizes node names', () => {
    expect(searchNodes('   ', NODES)).toEqual([]);
    expect(searchNodes('贝多芬', NODES)[0]?.node.id).toBe('vienna-classical');
    expect(searchNodes('BEATLES', NODES)[0]?.node.id).toBe('london-rock');
    expect(searchNodes('东京', NODES)[0]?.matchedOn).toBe('name');
    expect(searchNodes('广陵散', NODES)[0]?.node.id).toBe('han-wei-yuefu');
    expect(searchNodes('嵇康', NODES)[0]?.node.id).toBe('han-wei-yuefu');
    expect(searchNodes('声无哀乐论', NODES)[0]?.node.id).toBe('han-wei-yuefu');
    expect(searchNodes('乐记', NODES)[0]?.node.id).toBe('zhou-ritual');
    expect(searchNodes('舞论', NODES)[0]?.node.id).toBe('vedic-chant');
    expect(searchNodes('诗篇', NODES)[0]?.node.id).toBe('hebrew-temple');
    expect(searchNodes('恩赫杜安娜', NODES)[0]?.node.id).toBe('sumer-lyre');
  });
});
