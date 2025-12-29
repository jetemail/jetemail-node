"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Batch: () => Batch,
  Emails: () => Emails,
  JetEmail: () => JetEmail,
  JetEmailError: () => JetEmailError
});
module.exports = __toCommonJS(index_exports);

// src/types.ts
var JetEmailError = class extends Error {
  constructor(message, statusCode, response) {
    super(message);
    this.name = "JetEmailError";
    this.statusCode = statusCode;
    this.response = response;
  }
};

// src/emails.ts
var Emails = class {
  constructor(request) {
    this.request = request;
  }
  /**
   * Validate email options before sending
   */
  validateEmailOptions(options) {
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
  async send(options) {
    this.validateEmailOptions(options);
    return this.request("/email", options);
  }
};
var Batch = class {
  constructor(request) {
    this.request = request;
  }
  /**
   * Validate email options before sending
   */
  validateEmailOptions(options) {
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
  async send(emails) {
    if (!Array.isArray(emails) || emails.length === 0) {
      throw new Error("JetEmail: emails array is required and must not be empty");
    }
    if (emails.length > 100) {
      throw new Error("JetEmail: maximum batch size is 100 emails");
    }
    emails.forEach((email, index) => {
      try {
        this.validateEmailOptions(email);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`JetEmail: email at index ${index} is invalid - ${message}`);
      }
    });
    return this.request("/email-batch", { emails });
  }
};

// src/client.ts
var DEFAULT_BASE_URL = "https://api.jetemail.com";
var JetEmail = class {
  constructor(configOrApiKey) {
    const config = typeof configOrApiKey === "string" ? { apiKey: configOrApiKey } : configOrApiKey;
    if (!config.apiKey) {
      throw new Error("JetEmail: apiKey is required");
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl?.replace(/\/$/, "") ?? DEFAULT_BASE_URL;
    const boundRequest = this.request.bind(this);
    this.email = new Emails(boundRequest);
    this.batch = new Batch(boundRequest);
  }
  /**
   * Make an authenticated request to the JetEmail API
   */
  async request(endpoint, body) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    });
    let data;
    try {
      data = await response.json();
    } catch {
      throw new JetEmailError(
        `Request failed with status ${response.status}`,
        response.status
      );
    }
    if (!response.ok) {
      const errorResponse = data;
      const message = errorResponse.message || errorResponse.error || "Unknown error";
      throw new JetEmailError(message, response.status, errorResponse);
    }
    return data;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Batch,
  Emails,
  JetEmail,
  JetEmailError
});
