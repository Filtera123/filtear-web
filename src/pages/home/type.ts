export type HomeTabType = 'recommended' | 'subscriptions' | 'following';

export const HOME_TABS = {
  Recommended: 'recommended',
  Subscriptions: 'subscriptions',
  Following: 'following',
} as const;

export type HomeTabs = (typeof HOME_TABS)[keyof typeof HOME_TABS];
