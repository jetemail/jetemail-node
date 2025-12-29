import {
  SendEmailOptions,
  SendEmailResponse,
  SendBatchResponse,
  JetEmailError,
  ApiErrorResponse,
} from './types';

/**
 * Emails API for sending transactional emails
 */
export class Emails {
  constructor(private readonly request: <T>(endpoint: string, body: unknown) => Promise<T>) {}

  /**
   * Validate email options before sending
   */
  private validateEmailOptions(options: SendEmailOptions): void {
    if (!options.from) {
      throw new Error('JetEmail: "from" is required');
    }
    if (!options.to) {
      throw new Error('JetEmail: "to" is required');
    }
    if (!options.subject) {
      throw new Error('JetEmail: "subject" is required');
    }
    if (!options.html && !options.text) {
      throw new Error('JetEmail: at least one of "html" or "text" is required');
    }
  }

  /**
   * Send a single email
   *
   * @param options - Email options including from, to, subject, and content
   * @returns Promise resolving to the message ID and confirmation
   *
   * @example
   * ```ts
   * const { data, error } = await jetemail.email.send({
   *   from: 'Your App <hello@yourapp.com>',
   *   to: 'user@example.com',
   *   subject: 'Hello!',
   *   text: 'Hello from JetEmail!'
   * });
   * ```
   */
  async send(options: SendEmailOptions): Promise<SendEmailResponse> {
    this.validateEmailOptions(options);
    return this.request<SendEmailResponse>('/email', options);
  }
}

/**
 * Batch API for sending multiple emails
 */
export class Batch {
  constructor(private readonly request: <T>(endpoint: string, body: unknown) => Promise<T>) {}

  /**
   * Validate email options before sending
   */
  private validateEmailOptions(options: SendEmailOptions): void {
    if (!options.from) {
      throw new Error('JetEmail: "from" is required');
    }
    if (!options.to) {
      throw new Error('JetEmail: "to" is required');
    }
    if (!options.subject) {
      throw new Error('JetEmail: "subject" is required');
    }
    if (!options.html && !options.text) {
      throw new Error('JetEmail: at least one of "html" or "text" is required');
    }
  }

  /**
   * Send multiple emails in a batch (up to 100 emails)
   *
   * @param emails - Array of email options (max 100)
   * @returns Promise resolving to batch results with summary
   *
   * @example
   * ```ts
   * const { data, error } = await jetemail.batch.send([
   *   {
   *     from: 'Your App <hello@yourapp.com>',
   *     to: 'user1@example.com',
   *     subject: 'Welcome!',
   *     html: '<h1>Welcome User 1!</h1>'
   *   },
   *   {
   *     from: 'Your App <hello@yourapp.com>',
   *     to: 'user2@example.com',
   *     subject: 'Welcome!',
   *     html: '<h1>Welcome User 2!</h1>'
   *   }
   * ]);
   * ```
   */
  async send(emails: SendEmailOptions[]): Promise<SendBatchResponse> {
    if (!Array.isArray(emails) || emails.length === 0) {
      throw new Error('JetEmail: emails array is required and must not be empty');
    }

    if (emails.length > 100) {
      throw new Error('JetEmail: maximum batch size is 100 emails');
    }

    // Validate each email in the batch
    emails.forEach((email, index) => {
      try {
        this.validateEmailOptions(email);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`JetEmail: email at index ${index} is invalid - ${message}`);
      }
    });

    return this.request<SendBatchResponse>('/email-batch', { emails });
  }
}

