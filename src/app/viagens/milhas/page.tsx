import { getLoyaltyAccounts } from '@/lib/data';
import MilhasClient from './milhas-client';

export const dynamic = 'force-dynamic';

export default async function MilhasPage() {
  const accounts = await getLoyaltyAccounts();
  return <MilhasClient accounts={accounts} />;
}
