/**
 * Email attachment with base64 encoded content
 */
interface Attachment {
    /** Name of the attachment file */
    filename: string;
    /** Base64 encoded file content */
    data: string;
}
/**
 * Custom email headers
 */
type EmailHeaders = Record<string, string>;
/**
 * Single or multiple email addresses
 */
type EmailRecipient = string | string[];
/**
 * Email payload for sending a single email
 */
interface SendEmailOptions {
    /** Sender email address in format: "Name <email@domain.com>" */
    from: string;
    /** Recipient email address(es) - max 50 recipients */
    to: EmailRecipient;
    /** Email subject line */
    subject: string;
    /** HTML content of the email */
    html?: string;
    /** Plain text content of the email */
    text?: string;
    /** CC recipient(s) - max 50 */
    cc?: EmailRecipient;
    /** BCC recipient(s) - max 50 */
    bcc?: EmailRecipient;
    /** Reply-to address(es) - max 50 */
    reply_to?: EmailRecipient;
    /** Custom email headers */
    headers?: EmailHeaders;
    /** Email attachments (max total size: 40MB) */
    attachments?: Attachment[];
}
/**
 * Successful email send response
 */
interface SendEmailResponse {
    /** Unique message ID */
    id: string;
    /** Queue confirmation message */
    response: string;
}
/**
 * Batch email result for a successful send
 */
interface BatchEmailSuccess {
    status: 'success';
    /** Message ID */
    id: string;
    /** Success message */
    response: string;
}
/**
 * Batch email result for a failed send
 */
interface BatchEmailError {
    status: 'error';
    /** Error message */
    error: string;
    /** The original email request that failed */
    email: SendEmailOptions;
}
/**
 * Individual batch email result
 */
type BatchEmailResult = BatchEmailSuccess | BatchEmailError;
/**
 * Batch email send response
 */
interface SendBatchResponse {
    summary: {
        /** Total number of emails in batch */
        total: number;
        /** Number of successfully sent emails */
        successful: number;
        /** Number of failed emails */
        failed: number;
    };
    /** Results for each email in the batch */
    results: BatchEmailResult[];
}
/**
 * JetEmail SDK configuration options
 */
interface JetEmailConfig {
    /** Your JetEmail API key (transactional key) */
    apiKey: string;
    /** Base URL for the API (defaults to https://api.jetemail.com) */
    baseUrl?: string;
}
/**
 * Error response from the API
 */
interface ApiErrorResponse {
    message?: string;
    error?: string;
}
/**
 * JetEmail SDK Error
 */
declare class JetEmailError extends Error {
    readonly statusCode: number;
    readonly response?: ApiErrorResponse;
    constructor(message: string, statusCode: number, response?: ApiErrorResponse);
}

/**
 * Emails API for sending transactional emails
 */
declare class Emails {
    private readonly request;
    constructor(request: <T>(endpoint: string, body: unknown) => Promise<T>);
    /**
     * Validate email options before sending
     */
    private validateEmailOptions;
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
    send(options: SendEmailOptions): Promise<SendEmailResponse>;
}
/**
 * Batch API for sending multiple emails
 */
declare class Batch {
    private readonly request;
    constructor(request: <T>(endpoint: string, body: unknown) => Promise<T>);
    /**
     * Validate email options before sending
     */
    private validateEmailOptions;
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
    send(emails: SendEmailOptions[]): Promise<SendBatchResponse>;
}

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
declare class JetEmail {
    private readonly apiKey;
    private readonly baseUrl;
    /** Send single emails */
    readonly email: Emails;
    /** Send batch emails */
    readonly batch: Batch;
    constructor(apiKey: string);
    constructor(config: JetEmailConfig);
    /**
     * Make an authenticated request to the JetEmail API
     */
    private request;
}

export { type Attachment, Batch, type BatchEmailError, type BatchEmailResult, type BatchEmailSuccess, type EmailHeaders, type EmailRecipient, Emails, JetEmail, type JetEmailConfig, JetEmailError, type SendBatchResponse, type SendEmailOptions, type SendEmailResponse };
