import packsData from '@/data/packs.json';

const ENTITLEMENT_KEY = 'twinkletots_plus_unlocked';

export interface PackInfo {
  id: string;
  type: string;
  title: { en: string; hi: string };
  tier: 'free' | 'plus';
  itemCount: number;
  icon?: string;
}

export function isPlusOwned(): boolean {
  try {
    return localStorage.getItem(ENTITLEMENT_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPlusOwned(owned: boolean): void {
  try {
    localStorage.setItem(ENTITLEMENT_KEY, owned ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export function isUnlocked(packId: string, itemIndex = 0): boolean {
  const pack = (packsData as PackInfo[]).find((p) => p.id === packId);
  if (!pack || pack.tier === 'free') {
    return true;
  }

  // If user owns Plus
  if (isPlusOwned()) {
    return true;
  }

  // Free sample rule: first 3 items are always free
  return itemIndex < 3;
}

export function purchasePlusMock(): boolean {
  setPlusOwned(true);
  return true;
}

export function restorePurchasesMock(): boolean {
  const current = isPlusOwned();
  return current;
}
