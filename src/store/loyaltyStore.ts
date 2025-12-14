import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'freeShipping' | 'product';
  value?: number; // Para descuentos
  productId?: string; // Para productos gratis
}

interface LoyaltyStore {
  points: number;
  pointsHistory: { date: Date; points: number; description: string }[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  rewards: LoyaltyReward[];
  addPoints: (points: number, description: string) => void;
  redeemReward: (reward: LoyaltyReward) => boolean;
  calculateTier: () => void;
  getPointsForPurchase: (amount: number) => number;
}

const mockRewards: LoyaltyReward[] = [
  { 
    id: 'r1', 
    name: 'Descuento 5%', 
    description: 'Descuento del 5% en tu próxima compra',
    pointsCost: 100,
    type: 'discount',
    value: 5
  },
  { 
    id: 'r2', 
    name: 'Descuento 10%', 
    description: 'Descuento del 10% en tu próxima compra',
    pointsCost: 200,
    type: 'discount',
    value: 10
  },
  { 
    id: 'r3', 
    name: 'Envío Gratis', 
    description: 'Envío gratis en tu próximo pedido',
    pointsCost: 150,
    type: 'freeShipping'
  },
  { 
    id: 'r4', 
    name: 'Descuento 20%', 
    description: 'Descuento del 20% en tu próxima compra',
    pointsCost: 500,
    type: 'discount',
    value: 20
  },
];

export const useLoyaltyStore = create<LoyaltyStore>()(
  persist(
    (set, get) => ({
      points: 0,
      pointsHistory: [],
      tier: 'bronze',
      rewards: mockRewards,
      
      addPoints: (points, description) => {
        set((state) => ({
          points: state.points + points,
          pointsHistory: [
            ...state.pointsHistory,
            { date: new Date(), points, description }
          ]
        }));
        get().calculateTier();
      },
      
      redeemReward: (reward) => {
        const { points } = get();
        if (points >= reward.pointsCost) {
          set((state) => ({
            points: state.points - reward.pointsCost,
            pointsHistory: [
              ...state.pointsHistory,
              { 
                date: new Date(), 
                points: -reward.pointsCost, 
                description: `Canje: ${reward.name}` 
              }
            ]
          }));
          return true;
        }
        return false;
      },
      
      calculateTier: () => {
        const { points } = get();
        let tier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
        
        if (points >= 1000) tier = 'platinum';
        else if (points >= 500) tier = 'gold';
        else if (points >= 200) tier = 'silver';
        
        set({ tier });
      },
      
      getPointsForPurchase: (amount) => {
        // 1 punto por cada $1000 COP gastados
        return Math.floor(amount / 1000);
      },
    }),
    {
      name: 'loyalty-storage',
    }
  )
);
