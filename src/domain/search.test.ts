import { describe, expect, it } from 'vitest';
import { NODES } from '../data';
import { searchNodes } from './search';

describe('search', () => {
  it('matches multilingual node fields and prioritizes node names', () => {
    expect(searchNodes('   ', NODES)).toEqual([]);
    expect(searchNodes('贝多芬', NODES)[0]?.node.id).toBe('vienna-classical');
    expect(searchNodes('BEATLES', NODES)[0]?.node.id).toBe('london-rock');
    expect(searchNodes('东京', NODES)[0]?.matchedOn).toBe('name');
  });
});
