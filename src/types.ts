/**
 * Email attachment with base64 encoded content
 */
export interface Attachment {
  /** Name of the attachment file */
  filename: string;
  /** Base64 encoded file content */
  data: string;
}

/**
 * Custom email headers
 */
export type EmailHeaders = Record<string, string>;

/**
 * Single or multiple email addresses
 */
export type EmailRecipient = string | string[];

/**
 * Email payload for sending a single email
 */
export interface SendEmailOptions {
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
export interface SendEmailResponse {
  /** Unique message ID */
  id: string;
  /** Queue confirmation message */
  response: string;
}

/**
 * Batch email result for a successful send
 */
export interface BatchEmailSuccess {
  status: 'success';
  /** Message ID */
  id: string;
  /** Success message */
  response: string;
}

/**
 * Batch email result for a failed send
 */
export interface BatchEmailError {
  status: 'error';
  /** Error message */
  error: string;
  /** The original email request that failed */
  email: SendEmailOptions;
}

/**
 * Individual batch email result
 */
export type BatchEmailResult = BatchEmailSuccess | BatchEmailError;

/**
 * Batch email send response
 */
export interface SendBatchResponse {
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
export interface JetEmailConfig {
  /** Your JetEmail API key (transactional key) */
  apiKey: string;
  /** Base URL for the API (defaults to https://api.jetemail.com) */
  baseUrl?: string;
}

/**
 * Error response from the API
 */
export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

/**
 * JetEmail SDK Error
 */
export class JetEmailError extends Error {
  public readonly statusCode: number;
  public readonly response?: ApiErrorResponse;

  constructor(message: string, statusCode: number, response?: ApiErrorResponse) {
    super(message);
    this.name = 'JetEmailError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

