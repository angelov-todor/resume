import { createHash } from 'node:crypto';

export type AvatarResult =
  | { type: 'local'; src: string }
  | { type: 'gravatar'; src: string };

export interface AvatarInput {
  hasLocalFile: boolean;
  email: string;
  base: string;
}

export function resolveAvatar({ hasLocalFile, email, base }: AvatarInput): AvatarResult {
  const prefix = base === '/' ? '' : base.replace(/\/$/, '');

  if (hasLocalFile) {
    return { type: 'local', src: `${prefix}/avatar.png` };
  }

  const normalized = email.trim().toLowerCase();
  const hash = createHash('md5').update(normalized).digest('hex');
  return { type: 'gravatar', src: `https://www.gravatar.com/avatar/${hash}?s=192&d=mp` };
}
