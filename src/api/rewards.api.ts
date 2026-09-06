import { apiFetch } from './api-client';

export interface RewardCatalogItem {
  id: string;
  name: string;
  description: string | null;
  costPoints: number;
}

export interface RewardsSummary {
  pointsBalance: number;
  catalog: RewardCatalogItem[];
}

export interface RedeemedReward {
  id: string;
  points: number;
  source: 'CASHBACK' | 'REDEMPTION';
  description: string | null;
  createdAt: string;
}

export const rewardsApi = {
  async getSummary(): Promise<RewardsSummary> {
    return apiFetch<RewardsSummary>('/rewards');
  },
  async redeem(catalogItemId: string): Promise<RedeemedReward> {
    return apiFetch<RedeemedReward>('/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ catalogItemId }),
    });
  },
};