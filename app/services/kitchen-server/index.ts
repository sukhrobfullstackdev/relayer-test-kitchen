// Send this token to our validation endpoint
export const serverLogin = async (didToken: string) => {
  const res = await fetch('/api/token/validate', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${didToken}`,
    },
  });

  // If successful send back the response
  if (res.ok) {
    return res.json();
  }
};

export const postWithAuthToken = async (didToken: string, endpoint: string) => {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${didToken}`,
    },
  });

  return res;
};

export const postIssuer = async (issuer: string, endpoint: string) => {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ issuer }),
  });

  return res;
};

export const postPublicAddress = async (
  publicAddress: string,
  endpoint: string,
) => {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publicAddress }),
  });

  return res;
};
