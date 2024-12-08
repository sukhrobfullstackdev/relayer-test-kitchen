# Magic Auth Relayer Test Kitchen

This NextJs app is useful for local relayer development, as well as to test our entire suite of product offerings.

## Getting Started

Unless you want to make changes to the dApp implementation, you don't need to run this repo locally.

Instead visit https://relayer-test-kitchen.vercel.app and point the `endpoint` field at which ever relayer environment you want to target.

- ie. `http://localhost:3014`
- `https://auth.stagef.magic.link`
- `https://auth.magic.link`
- `https://auth.{preview-deploy-branch}.magic.link`

Remember the Api Key must be from the api environment that your relayer endpoint is targetting.

auth.stagef.magic.link -> api.stagef.magic.link

auth.magic.link -> api.magic.link

localhost:3014 -> Depends if you ran `pnpm start -stagef` or `pnpm start -prod` or `pnpm start -dev` for phantom (auth relayer) repo.

## Local development

To start the development server locally:

```bash
pnpm dev
```

Runs on [http://localhost:3013](http://localhost:3013) locally.

### (Optional) Configure Admin SDK Locally

To add your own Secret API key for use with the admin SDK, rename the `.env.local.example` file to `.env.local`:

```bash
mv .env.local.example .env.local
```

Then add your secret key:

```javascript
MAGIC_SECRET_KEY = 'sk_live_...';
```

## Features

### Blockchain Network Targeting via Url params

You can pre-select a supported blockchain with the network url parameter: `?network={network}`

ie. https://relayer-test-kitchen.vercel.app?network=flow-testnet

### Endpoint + ApiKey + Custom Node Url auto suggestions

The Endpoint TextField will auto suggest known environments (dev, stagef, prod local relayers)

- it is still a free-form text field

The ApiKey and Custom Node Url TextFields will auto suggest keys that were used in the past by the current browser

- they are still free-form text fields

### Endpoint + Apikey Targeting via Url params

You can pre-fill the Apikey text box with the api_key url paramter: `?api_key={api_key}`

ie. https://relayer-test-kitchen.vercel.app?api_key=PK123

This will auto fill the specified ApiKey

You can also pre-fill the Endpoint text box with the env Url parameter: `?env={env}`

ie. https://relayer-test-kitchen.vercel.app?env=stagef

This will auto fill `https://auth.stagef.magic.link` as the endpoint

## Deployment

Deployed to: https://relayer-test-kitchen.vercel.app

Vercel Deployment Pipeline: https://vercel.com/magiclabs/relayer-test-kitchen
