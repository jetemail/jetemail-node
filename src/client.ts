import {
  JetEmailConfig,
  JetEmailError,
  ApiErrorResponse,
} from './types';
import { Emails, Batch } from './emails';

const DEFAULT_BASE_URL = 'https://api.jetemail.com';

/**
 * JetEmail SDK client for sending transactional emails
 *
 * @example
 * ```ts
 * import { JetEmail } from 'jetemail';
 *
 * const jetemail = new JetEmail('your-api-key');
 *
 * await jetemail.email.send({
 *   from: 'Your App <hello@yourapp.com>',
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Welcome to our app!</h1>'
 * });
 * ```
 */
export class JetEmail {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  /** Send single emails */
  readonly email: Emails;

  /** Send batch emails */
  readonly batch: Batch;

  constructor(apiKey: string);
  constructor(config: JetEmailConfig);
  constructor(configOrApiKey: JetEmailConfig | string) {
    const config = typeof configOrApiKey === 'string' 
      ? { apiKey: configOrApiKey } 
      : configOrApiKey;

    if (!config.apiKey) {
      throw new Error('JetEmail: apiKey is required');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl?.replace(/\/$/, '') ?? DEFAULT_BASE_URL;

    // Bind the request method and pass to sub-clients
    const boundRequest = this.request.bind(this);
    this.email = new Emails(boundRequest);
    this.batch = new Batch(boundRequest);
  }

  /**
   * Make an authenticated request to the JetEmail API
   */
  private async request<T>(
    endpoint: string,
    body: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    let data: T | ApiErrorResponse;

    try {
      data = await response.json();
    } catch {
      throw new JetEmailError(
        `Request failed with status ${response.status}`,
        response.status
      );
    }

    if (!response.ok) {
      const errorResponse = data as ApiErrorResponse;
      const message = errorResponse.message || errorResponse.error || 'Unknown error';
      throw new JetEmailError(message, response.status, errorResponse);
    }

    return data as T;
  }
}
