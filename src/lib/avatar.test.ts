import { describe, it, expect } from 'vitest';
import { resolveAvatar } from './avatar';

describe('resolveAvatar', () => {
  it('returns local source when avatar file exists', () => {
    const result = resolveAvatar({
      hasLocalFile: true,
      email: 'todor.angelov@wisertech.com',
      base: '/resume',
    });
    expect(result).toEqual({ type: 'local', src: '/resume/avatar.jpg' });
  });

  it('returns gravatar URL with correct md5 when no local file', () => {
    const result = resolveAvatar({
      hasLocalFile: false,
      email: 'todor.angelov@wisertech.com',
      base: '/resume',
    });
    expect(result.type).toBe('gravatar');
    expect(result.src).toMatch(/^https:\/\/www\.gravatar\.com\/avatar\/[a-f0-9]{32}\?s=192&d=mp$/);
  });

  it('lowercases and trims email before hashing (gravatar spec)', () => {
    const a = resolveAvatar({ hasLocalFile: false, email: 'Test@Example.com', base: '/' });
    const b = resolveAvatar({ hasLocalFile: false, email: '  test@example.com  ', base: '/' });
    expect(a.src).toBe(b.src);
  });

  it('handles base path with no trailing slash', () => {
    const result = resolveAvatar({ hasLocalFile: true, email: 'x@y.z', base: '/resume' });
    expect(result.src).toBe('/resume/avatar.jpg');
  });

  it('handles base path of "/"', () => {
    const result = resolveAvatar({ hasLocalFile: true, email: 'x@y.z', base: '/' });
    expect(result.src).toBe('/avatar.jpg');
  });
});
