import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';
import { type FlowExtension } from '@magic-ext/flow';
import * as fcl from '@onflow/fcl';

export const groupName = 'Flow';

export const methods: MethodConfig[] = [
  {
    name: 'Send Transaction',
    description: 'Sends a transaction',
    args: [],
    func: async () => {
      try {
        fcl.config().put('accessNode.api', 'https://rest-testnet.onflow.org');
        const AUTHORIZATION_FUNCTION =
          getMagicInstance<[FlowExtension]>().flow?.authorization;
        console.log('Sending transaction...');
        const response = await fcl.send([
          fcl.transaction`
            transaction {
              var acct: &Account
      
              prepare(acct: &Account) {
                self.acct = acct
              }
      
              execute {
                log(self.acct.address)
              }
            }
          `,
          fcl.proposer(AUTHORIZATION_FUNCTION),
          fcl.authorizations([AUTHORIZATION_FUNCTION]),
          fcl.payer(AUTHORIZATION_FUNCTION),
          fcl.limit(9999),
        ]);
        console.log('Tx response', response);

        console.log('Waiting for transaction to be sealed...');
        const data = await fcl.tx(response).onceSealed();
        console.log('Sealed', data);

        if (data.status === 4 && data.statusCode === 0) {
          console.log('It worked!');
        } else {
          console.log(`Something went wrong: ${data.errorMessage}`);
        }
      } catch (error) {
        console.error('FAILED TRANSACTION', error);
      }
    },
  },
];
