import { greeting } from '../src/index';
import { describe, expect, it } from 'vitest';

describe('greeting', () => {
    it('uses the given name', () => {
        expect(greeting('Matchory')).toBe('Hello, Matchory!');
    });
});
