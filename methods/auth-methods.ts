import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';
import {
  DeviceVerificationEventOnReceived,
  LoginWithEmailOTPEventEmit,
  LoginWithEmailOTPEventOnReceived,
} from '@magic-sdk/types';
import { serverLogin } from '@/app/services/kitchen-server';
import {
  RecencyCheckEventEmit,
  RecencyCheckEventOnReceived,
  UpdateEmailEventEmit,
  UpdateEmailEventOnReceived,
} from 'magic-sdk';

import store from '@/store/store';
import { setEmail, setPhoneNumber } from '@/store/config-slice';
import { customAuthorizationJWT } from '@/const/custom-auth-jwt';

export const groupName = 'Auth';

export const methods: MethodConfig[] = [
  {
    name: 'auth.loginWithMagicLink({ email })',
    description: 'Initiate a login via an emailed magic link',
    args: [
      { name: 'Email', default: '', fallbackGlobalStateKey: 'email' },
      { name: 'Show Pending Modal', default: true },
    ],
    func: async (email: string, showUI: false) => {
      store.dispatch(setEmail(email));
      await getMagicInstance().auth.loginWithMagicLink({ email, showUI });
      alert('Login complete!');
    },
  },
  {
    name: 'auth.loginWithMagicLink({ email, redirectUri })',
    description:
      'Initiate a login via an emailed magic link. ⚠️ redirectUri is pre-configured to "/redirect"',
    args: [
      { name: 'Email', default: '', fallbackGlobalStateKey: 'email' },
      { name: 'Redirect URI', default: '' },
    ],
    func: async (email: string, redirectURI: string) => {
      store.dispatch(setEmail(email));
      await getMagicInstance().auth.loginWithMagicLink({
        email,
        redirectURI: redirectURI ?? `${window.origin}/redirect`,
      });
      alert('Login complete!!');
    },
  },

  {
    name: 'auth.loginWithSMS({ phoneNumber })',
    description: 'Initiate a login via SMS.',
    args: [
      {
        name: 'Phone number',
        default: '+19999999999',
        fallbackGlobalStateKey: 'phoneNumber',
      },
    ],
    func: async (phoneNumber: string) => {
      store.dispatch(setPhoneNumber(phoneNumber));
      await getMagicInstance().auth.loginWithSMS({ phoneNumber });
      alert('Login complete!');
    },
  },

  {
    name: 'auth.loginWithEmailOTP({ email, showUI, deviceCheckUI }',
    description: 'Initiate an email otp login.',
    args: [
      { name: 'email', default: '', fallbackGlobalStateKey: 'email' },
      { name: 'Show Pending Modal', default: true },
      { name: 'Show Device Check Modal', default: true },
    ],
    func: async (email: string, showUI: boolean, deviceCheckUI: boolean) => {
      let didToken;
      store.dispatch(setEmail(email));
      // UI
      if (showUI) {
        didToken = await getMagicInstance().auth.loginWithEmailOTP({
          email,
          showUI,
          deviceCheckUI,
        });
        if (didToken) {
          alert('Login complete!');
        }
      } else {
        // whitelabel
        const handle = getMagicInstance().auth.loginWithEmailOTP({
          email,
          showUI,
          deviceCheckUI,
        });
        if (!deviceCheckUI) {
          handle.on(
            DeviceVerificationEventOnReceived.DeviceNeedsApproval,
            () => {
              window.alert('Device Needs Approval, Check your Email Inbox');
            },
          );
          handle.on(
            DeviceVerificationEventOnReceived.DeviceVerificationEmailSent,
            () => {
              window.alert('Device Verification Email Sent');
            },
          );
          handle.on(DeviceVerificationEventOnReceived.DeviceApproved, () => {
            window.alert('Device has been approved');
          });
          handle.on(
            DeviceVerificationEventOnReceived.DeviceVerificationLinkExpired,
            () => {
              window.alert('Device Verification link Expired');
            },
          );
        }

        handle.on(LoginWithEmailOTPEventOnReceived.EmailOTPSent, () => {
          const otp = window.prompt('Enter Email OTP');
          handle.emit(LoginWithEmailOTPEventEmit.VerifyEmailOtp, otp as never);
        });
        handle.on(LoginWithEmailOTPEventOnReceived.MfaSentHandle, () => {
          const otp = window.prompt('Please enter the MFA code!');
          handle.emit(LoginWithEmailOTPEventEmit.VerifyMFACode, otp as never);
        });
        let retriesMFA = 2;
        handle.on(LoginWithEmailOTPEventOnReceived.InvalidMfaOtp, () => {
          if (!retriesMFA) {
            handle.emit(LoginWithEmailOTPEventEmit.Cancel);
          } else {
            const otp = window.prompt(
              `Invalid MFA code, Please enter MFA code again. Retries left: ${retriesMFA}`,
            );
            retriesMFA--;
            handle.emit(
              LoginWithEmailOTPEventEmit.VerifyMFACode,
              otp as string,
            );
          }
        });
        let retries = 2;
        handle.on(LoginWithEmailOTPEventOnReceived.InvalidEmailOtp, () => {
          if (!retries) {
            handle.emit(LoginWithEmailOTPEventEmit.Cancel);
          } else {
            const otp = window.prompt(
              `Invalid code, Please enter OTP again. Retries left: ${retries}`,
            );
            retries--;
            handle.emit(
              LoginWithEmailOTPEventEmit.VerifyEmailOtp,
              otp as never,
            );
          }
        });
        handle.on('error', (error) => {
          alert(`Error: ${error}`);
        });
        handle.on('done', () => {
          alert('Login complete!');
        });
        didToken = await handle;
      }

      // Validate in Admin SDK
      if (didToken) {
        const res = await serverLogin(didToken);
        console.log(
          `admin SDK login with DIDToken\n ${didToken} \n Res: ${JSON.stringify(
            res,
          )}`,
        );
      }
    },
  },

  {
    name: 'auth.loginWithCredential()',
    description:
      'Parses a `magic_credential` from the URL query and use it to hydrate the user session.',
    func: async () => {
      console.log(await getMagicInstance().auth.loginWithCredential());
      alert('Login complete!');
    },
  },

  {
    name: 'auth.updateEmailWithUI({ email, showUI })',
    description: 'Update current user email address',
    args: [
      { name: 'Email', default: '', fallbackGlobalStateKey: 'email' },
      { name: 'Show Pending Modal', default: true },
    ],
    func: async (email: string, showUI: boolean) => {
      store.dispatch(setEmail(email));
      const handle = getMagicInstance().auth.updateEmailWithUI({
        email,
        showUI,
      });

      if (!showUI) {
        /**
         * Recency Check
         */
        let recencyCheckRetries = 5;
        handle.on(RecencyCheckEventOnReceived.EmailSent, () => {
          const otp = window.prompt('Primary Email OTP');
          handle.emit(RecencyCheckEventEmit.VerifyEmailOtp, otp as never);
        });
        handle.on(RecencyCheckEventOnReceived.PrimaryAuthFactorVerified, () => {
          window.alert('Primary Factor has been verified');
        });
        handle.on(RecencyCheckEventOnReceived.EmailNotDeliverable, () => {
          handle.emit(RecencyCheckEventEmit.Cancel);
          window.alert('Email Not Deliverable');
        });
        handle.on(RecencyCheckEventOnReceived.InvalidEmailOtp, () => {
          if (!recencyCheckRetries) {
            alert('Too many attempts');
            handle.emit(RecencyCheckEventEmit.Cancel);
          } else {
            const otp = window.prompt(
              `Invalid code, Please enter OTP again. Retries left: ${recencyCheckRetries}`,
            );
            recencyCheckRetries--;
            handle.emit(RecencyCheckEventEmit.VerifyEmailOtp, otp as never);
          }
        });

        /**
         * Update Email
         */
        handle.on(UpdateEmailEventOnReceived.EmailSent, () => {
          const otp = window.prompt('Enter new Email OTP');
          handle.emit(UpdateEmailEventEmit.VerifyEmailOtp, otp as never);
        });
        handle.on(UpdateEmailEventOnReceived.InvalidEmail, () => {
          const newEmail = window.prompt('Invalid Email, Enter a new Email');
          handle.emit(
            UpdateEmailEventEmit.RetryWithNewEmail,
            newEmail || email,
          );
        });
        handle.on(UpdateEmailEventOnReceived.EmailAlreadyExists, () => {
          const newEmail = window.prompt(
            'Email address already in use, Enter a different Email',
          );
          handle.emit(
            UpdateEmailEventEmit.RetryWithNewEmail,
            newEmail || email,
          );
        });
        let updateEmailRetries = 5;
        handle.on(UpdateEmailEventOnReceived.InvalidEmailOtp, () => {
          if (!updateEmailRetries) {
            alert('Too many attempts');
            handle.emit(UpdateEmailEventEmit.Cancel);
          } else {
            const otp = window.prompt(
              `Invalid code, Please enter OTP again. Retries left: ${updateEmailRetries}`,
            );
            updateEmailRetries--;
            handle.emit(UpdateEmailEventEmit.VerifyEmailOtp, otp as never);
          }
        });
        handle.on('error', () => {
          alert('Error occurred');
        });
      }

      const res = await handle;
      console.log(res);
      alert('Email Updated');
    },
  },
  {
    name: 'auth.setAuthorizationToken(jwt)',
    description: 'Custom Auth, once used by Kresus',
    args: [
      {
        name: 'JWT',
        default: customAuthorizationJWT,
      },
    ],
    func: async (customAuth: string) => {
      await getMagicInstance().auth.setAuthorizationToken(customAuth);
    },
  },
];
