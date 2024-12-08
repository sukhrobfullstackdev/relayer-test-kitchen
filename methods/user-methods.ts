import { type MethodConfig } from '@/components/method-group/method-group';
import { getMagicInstance } from '@/lib/magic';
import { setUser } from '@/store/config-slice';
import store from '@/store/store';
import {
  DisableMFAEventEmit,
  DisableMFAEventOnReceived,
  EnableMFAEventEmit,
  EnableMFAEventOnReceived,
  RecencyCheckEventEmit,
  RecencyCheckEventOnReceived,
  RecoverAccountEventEmit,
  RecoverAccountEventOnReceived,
  RecoveryFactorEventEmit,
  RecoveryFactorEventOnReceived,
  UpdateEmailEventEmit,
  UpdateEmailEventOnReceived,
  type ShowSettingsConfiguration,
} from '@magic-sdk/types';
import { type Magic } from 'magic-sdk';

export const groupName = 'User';

export const methods: MethodConfig[] = [
  {
    name: 'user.isLoggedIn()',
    description: 'Checks if there is a current auth user logged in',
    func: async () => {
      alert(await getMagicInstance().user.isLoggedIn());
    },
  },

  {
    name: 'user.getInfo()',
    description: 'Gets user info associated with the currently logged in user.',
    func: async () => {
      const userInfo = await getMagicInstance().user.getInfo();
      console.log('User Info:', userInfo);
      alert(JSON.stringify(userInfo));
    },
  },

  {
    name: 'user.logout()',
    description: 'Logs out the currently logged in user',
    func: async () => {
      await getMagicInstance().user.logout();
      alert('user has logged out');
      store.dispatch(setUser(null));
    },
  },

  {
    name: 'user.requestInfoWithUI() [GLOBAL WALLETS ONLY]',
    description:
      'Display a prompt to request user information. Limited to email at this time.',
    args: [{ name: 'isResponseRequired', default: true }],
    func: async (_isResponseRequired: boolean) => {
      try {
        const userInfo =
          (await getMagicInstance().user.requestInfoWithUI()) as any;
        console.log('Request User Information', userInfo);
        alert(`Request User Information ${userInfo.email}`);
      } catch (error) {
        console.log('Request user information error: ', error);
      }
    },
  },

  {
    name: 'user.getIdToken({ lifespan }) [SCOPED WALLETS ONLY]',
    description: 'Generates a Decentralized ID Token for the current user.',
    args: [{ name: 'Lifespan (in seconds)', default: 900 }],
    func: async (lifespan: number) => {
      const token = await getMagicInstance().user.getIdToken({ lifespan });
      console.log('Decentralized ID Token:', token);
      alert(`Generated Decentralized ID Token (DAT): ${token}`);
    },
  },

  {
    name: 'user.generateIdToken({ attachment, lifespan }) [SCOPED WALLETS ONLY]',
    description:
      'Generates a Decentralized ID Token for the current user with additional secret attachment.',
    args: [
      { name: 'Additional Signed Secret', default: '' },
      { name: 'Lifespan (in seconds)', default: 900 },
    ],
    func: async (attachment: string | undefined, lifespan: number) => {
      const token = await getMagicInstance().user.generateIdToken({
        attachment,
        lifespan,
      });
      console.log('Decentralized ID Token:', token);
      alert(
        `Generated Decentralized ID Token (DAT): ${token} with attachment ${attachment}`,
      );
    },
  },
  {
    name: 'user.getMetadata() [DEPRECATING]',
    description:
      'Gets all metadata associated with the currently logged in user.',
    func: async () => {
      const metadata = await getMagicInstance().user.getMetadata();
      console.log('Metadata:', metadata);
      alert(JSON.stringify(metadata));
    },
  },
  {
    name: 'user.showSettings()',
    description:
      'Show user settings. Deep link options = update-email | recovery | mfa',
    args: [
      { name: 'page', default: 'mfa' },
      { name: 'Show Pending Modal', default: true },
    ],
    func: async (page: string, showUI: boolean) => {
      try {
        const handle = getMagicInstance().user.showSettings({
          page,
          showUI,
        } as ShowSettingsConfiguration);
        if (!showUI) {
          handle.emit(RecoveryFactorEventEmit.StartEditPhoneNumber);
          handle.on(RecoveryFactorEventOnReceived.EnterNewPhoneNumber, () => {
            const phoneNumber = window.prompt('Enter new a phone number');
            handle.emit(
              RecoveryFactorEventEmit.SendNewPhoneNumber,
              phoneNumber as never,
            );
          });
          handle.on(RecoveryFactorEventOnReceived.EnterOtpCode, () => {
            const otp = window.prompt('Enter otp code:');
            handle.emit(RecoveryFactorEventEmit.SendOtpCode, otp as never);
          });
          handle.on(
            RecencyCheckEventOnReceived.PrimaryAuthFactorNeedsVerification,
            () => {
              alert('You need to verify!');
            },
          );
          handle.on(
            RecencyCheckEventOnReceived.PrimaryAuthFactorVerified,
            () => {
              alert('You passed the verification!');
            },
          );
          handle.on(RecoveryFactorEventOnReceived.MalformedPhoneNumber, () => {
            const phoneNumber = window.prompt(
              'You entered an invalid phone number. Please try again:',
            );
            handle.emit(
              RecoveryFactorEventEmit.SendNewPhoneNumber,
              phoneNumber as never,
            );
          });
          handle.on(
            RecoveryFactorEventOnReceived.RecoveryFactorAlreadyExists,
            () => {
              alert('Recovery factor already exists!');
            },
          );
          handle.on(RecoveryFactorEventOnReceived.InvalidOtpCode, () => {
            const code = window.prompt(
              'Invalid OTP code. Please try one more time:',
            );
            handle.emit(RecoveryFactorEventEmit.SendOtpCode, code as never);
          });
          handle.on(RecencyCheckEventOnReceived.EmailSent, () => {
            const code = window.prompt(
              'Please enter the code which was sent to your email:',
            );
            handle.emit(RecencyCheckEventEmit.VerifyEmailOtp, code as never);
          });
          handle.on('done', () => {
            alert('The phone number has been updated!');
          });
        }
        const res = await handle;
        console.log('res', res);
      } catch (err) {
        console.log(err);
      }
    },
  },
  {
    name: 'user.recoverAccount({ email, showUI })',
    description: 'Recover Account',
    args: [
      { name: 'Email', default: '' },
      {
        name: 'show UI',
        default: true,
      },
    ],
    func: async (email: string, showUI: boolean) => {
      if (showUI) {
        const result = await getMagicInstance().user.recoverAccount({
          email,
          showUI: true,
        });
        console.log('recoverAccount', result);
      } else {
        const handle = getMagicInstance().user.recoverAccount({
          email,
          showUI,
        });
        handle.on(
          RecoverAccountEventOnReceived.SmsOtpSent,
          ({ phoneNumber }) => {
            const otp = window.prompt(`Enter otp sent to ${phoneNumber}`);
            if (!otp) {
              handle.emit(RecoverAccountEventEmit.Cancel);
            } else {
              handle.emit(RecoverAccountEventEmit.VerifyOtp, otp);
            }
          },
        );
        handle.on(RecoverAccountEventOnReceived.LoginThrottled, (error) => {
          window.alert('Login throttled');
          console.log({ error });
        });
        handle.on(
          RecoverAccountEventOnReceived.InvalidSmsOtp,
          ({ errorMessage, errorCode }) => {
            const otp = window.prompt(
              `Invalid OTP, try again: (resend - to resend the OTP \n ${errorMessage}/n(${errorCode})`,
            );
            if (!otp) {
              handle.emit(RecoverAccountEventEmit.Cancel);
            } else if (otp.toLowerCase() === 'resend') {
              handle.emit(RecoverAccountEventEmit.ResendSms);
            } else {
              handle.emit(RecoverAccountEventEmit.VerifyOtp, otp);
            }
          },
        );
        handle.on(RecoverAccountEventOnReceived.SmsVerified, () => {
          window.alert('SMS Verified');
        });
        handle.on(RecoverAccountEventOnReceived.AccountRecovered, () => {
          window.alert('Account recovered');
        });

        handle.on(RecoverAccountEventOnReceived.UpdateEmailRequired, () => {
          const newEmail = window.prompt(
            'Update email required: Enter new email',
          );
          if (newEmail) {
            handle.emit(RecoverAccountEventEmit.UpdateEmail, newEmail);
          } else {
            handle.emit(RecoverAccountEventEmit.Cancel);
          }
        });

        handle.on(UpdateEmailEventOnReceived.EmailSent, () => {
          const otp = window.prompt('Enter new Email OTP');
          console.log('Emitting - UpdateEmail/new-email-verify-otp');
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

        return handle;
      }
    },
  },
  {
    name: 'user.revealPrivateKey()',
    description: 'Shows the private key reveal modal',
    func: async () => {
      try {
        const res = await getMagicInstance().user.revealPrivateKey();
        console.log('res', res);
      } catch (err) {
        console.log(err);
      }
    },
  },
  {
    name: 'user.enableMfa()',
    description: 'Start enable MFA flow',
    args: [{ name: 'Show Pending Modal', default: true }],
    func: async (showUI: boolean) => {
      if (showUI) {
        const magic = getMagicInstance() as Magic;
        magic.rpcProvider.sendAsync(
          { method: 'magic_auth_enable_mfa_flow' },
          (res, err) => {
            console.log(res);
            if (err) {
              console.log('err: ', err?.error);
            }
          },
        );
      } else {
        const handle = getMagicInstance().user.enableMFA({
          showUI,
        });

        handle.on(
          EnableMFAEventOnReceived.MFASecretGenerated,
          ({ QRCode, key }) => {
            window.alert(`QRCode: ${QRCode}\nKey:${key}`);
            const totp = window.prompt(
              'Enter TOTP from the app after scanning QR code from console',
            );
            if (!totp) return;
            if (totp.toLowerCase() === 'cancel') {
              handle.emit(EnableMFAEventEmit.Cancel);
            } else {
              handle.emit(EnableMFAEventEmit.VerifyMFACode, totp);
            }
          },
        );

        handle.on(EnableMFAEventOnReceived.InvalidMFAOtp, ({ errorCode }) => {
          window.alert(errorCode);
        });

        handle.on(
          EnableMFAEventOnReceived.MFARecoveryCodes,
          ({ recoveryCode }) => {
            window.alert(`MFA enabled! Recovery code - ${recoveryCode}`);
          },
        );

        return handle;
      }
    },
  },
  {
    name: 'user.disableMfa()',
    description: 'Start disable MFA flow',
    args: [{ name: 'Show Pending Modal', default: true }],
    func: async (showUI: boolean) => {
      if (showUI) {
        const magic = getMagicInstance() as Magic;
        magic.rpcProvider.sendAsync(
          { method: 'magic_auth_disable_mfa_flow' },
          (res, err) => {
            console.log(res);
            if (err) {
              console.log('err: ', err?.error);
            }
          },
        );
      } else {
        const handle = getMagicInstance().user.disableMFA({
          showUI,
        });
        handle.on(DisableMFAEventOnReceived.MFACodeRequested, () => {
          const totp = window.prompt('Enter MFA code | type LOST DEVICE');
          if (!totp) return;

          if (totp?.toLowerCase() === 'lost device') {
            const recoveryCode = window.prompt('Enter Recovery code');
            if (!recoveryCode) return;
            handle.emit(DisableMFAEventEmit.LostDevice, recoveryCode);
          } else if (totp?.toLowerCase() === 'cancel') {
            handle.emit(DisableMFAEventEmit.Cancel);
          } else {
            handle.emit(DisableMFAEventEmit.VerifyMFACode, totp);
          }
        });
        handle.on(DisableMFAEventOnReceived.InvalidMFAOtp, ({ errorCode }) => {
          window.alert(errorCode);
        });
        handle.on(DisableMFAEventOnReceived.InvalidRecoveryCode, () => {
          window.alert('Invalid Recovery Code');
        });
        handle.on('done', () => {
          window.alert('MFA disabled');
        });

        return handle;
      }
    },
  },
];
