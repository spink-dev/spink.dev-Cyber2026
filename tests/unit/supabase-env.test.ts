import { describe, expect, it } from 'vitest';
import { resolveSupabaseEnv } from '@lib/supabase/env';

describe('resolveSupabaseEnv', () => {
    it('returns null when either value is missing', () => {
        expect(resolveSupabaseEnv(undefined, undefined)).toBeNull();
        expect(resolveSupabaseEnv('http://127.0.0.1:54321', undefined)).toBeNull();
        expect(resolveSupabaseEnv(undefined, 'sb_publishable_x')).toBeNull();
    });

    it('rejects a URL that does not parse', () => {
        expect(resolveSupabaseEnv('not a url', 'sb_publishable_x')).toBeNull();
    });

    it('returns the pair when both are valid', () => {
        expect(resolveSupabaseEnv('http://127.0.0.1:54321', 'sb_publishable_x')).toEqual({
            url: 'http://127.0.0.1:54321',
            publishableKey: 'sb_publishable_x',
        });
    });
});
