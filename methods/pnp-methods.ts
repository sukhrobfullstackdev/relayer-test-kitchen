import { type MethodConfig } from '@/components/method-group/method-group';

export const groupName = 'PnP';

export const methods: MethodConfig[] = [
  {
    name: 'Link to /pnp/login',
    description: 'Start login flow using the PnP login form.',
    func: async () => {
      window.location.pathname = '/pnp/login';
    },
  },
];
