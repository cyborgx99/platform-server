export const sendConfirmationEmail = 'sendConfirmationEmail';

export class SendConfirmationEmailEvent {
  constructor(public readonly email: string) {}
}
