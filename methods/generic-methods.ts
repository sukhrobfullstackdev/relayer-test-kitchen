import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';
import store from '@/store/store';
import {
  setGenericRpcMethodName,
  setGenericRpcMethodParams,
} from '@/store/config-slice';

export const groupName = 'Generic';

export const methods: MethodConfig[] = [
  {
    name: 'rpcProvider.request',
    description: 'Generic SDK Request',
    args: [
      {
        name: 'RPC Method',
        default: 'magic_auth_login_with_email_otp',
        fallbackGlobalStateKey: 'genericRpcMethodName',
      },
      {
        name: 'Params Json Object ',
        default: '{"showUI": true, "email": "david.he@magic.link"}',
        fallbackGlobalStateKey: 'genericRpcMethodParams',
      },
    ],
    func: async (rpcMethod: string, paramsObjStr: string) => {
      store.dispatch(setGenericRpcMethodName(rpcMethod));
      store.dispatch(setGenericRpcMethodParams(paramsObjStr));
      let params;
      if (paramsObjStr && JSON.parse(paramsObjStr)) {
        params = [JSON.parse(paramsObjStr)];
      }
      try {
        const res = await getMagicInstance().rpcProvider.request({
          id: '1',
          method: rpcMethod,
          params,
        });
        console.log('res', res);
      } catch (err) {
        console.log('err', err);
      }
    },
  },
];
