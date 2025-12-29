# JetEmail SDK

Official Node.js SDK for the [JetEmail](https://jetemail.com) transactional email service.

## Installation

```bash
npm install jetemail
```

> **Note:** You need to create an account at [jetemail.com](https://jetemail.com) to get an API key before using this SDK.

## Quick Start

```ts
import { JetEmail } from 'jetemail';

const jetemail = new JetEmail('your-transactional-api-key');

// Send a single email
await jetemail.email.send({
  from: 'Your App <hello@yourapp.com>',
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to our app!</h1>'
});
```

## API Reference

### Constructor

```ts
// Simple API key
const jetemail = new JetEmail('your-api-key');

// With options
const jetemail = new JetEmail({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.jetemail.com' // optional
});
```

---

### `jetemail.email.send(options)`

Send a single email.

```ts
const result = await jetemail.email.send({
  from: 'Your App <hello@yourapp.com>',
  to: 'user@example.com',
  subject: 'Hello!',
  html: '<h1>Hello World!</h1>'
});

console.log(result.id); // Message ID
```

#### Options

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | `string` | ✓ | Sender address in format `"Name <email@domain.com>"` |
| `to` | `string \| string[]` | ✓ | Recipient(s) - max 50 |
| `subject` | `string` | ✓ | Email subject line |
| `html` | `string` | * | HTML content (at least one of `html` or `text` required) |
| `text` | `string` | * | Plain text content (at least one of `html` or `text` required) |
| `cc` | `string \| string[]` | | CC recipient(s) - max 50 |
| `bcc` | `string \| string[]` | | BCC recipient(s) - max 50 |
| `reply_to` | `string \| string[]` | | Reply-to address(es) - max 50 |
| `headers` | `Record<string, string>` | | Custom email headers |
| `attachments` | `Attachment[]` | | File attachments (max 40MB total) |

#### Response

```ts
{
  id: string;       // Unique message ID
  response: string; // Queue confirmation message
}
```

---

### `jetemail.batch.send(emails)`

Send multiple emails in a single batch request (up to 100 emails).

```ts
const result = await jetemail.batch.send([
  {
    from: 'Your App <hello@yourapp.com>',
    to: 'user1@example.com',
    subject: 'Welcome!',
    html: '<h1>Welcome User 1!</h1>'
  },
  {
    from: 'Your App <hello@yourapp.com>',
    to: 'user2@example.com',
    subject: 'Welcome!',
    html: '<h1>Welcome User 2!</h1>'
  }
]);

console.log(result.summary);
// { total: 2, successful: 2, failed: 0 }

// Check individual results
result.results.forEach((r, i) => {
  if (r.status === 'success') {
    console.log(`Email ${i}: sent with ID ${r.id}`);
  } else {
    console.log(`Email ${i}: failed - ${r.error}`);
  }
});
```

#### Response

```ts
{
  summary: {
    total: number;      // Total emails in batch
    successful: number; // Successfully queued
    failed: number;     // Failed to queue
  };
  results: Array<
    | { status: 'success'; id: string; response: string }
    | { status: 'error'; error: string; email: SendEmailOptions }
  >;
}
```

---

## Examples

### HTML Email with Plain Text Fallback

```ts
await jetemail.email.send({
  from: 'Newsletter <news@yourapp.com>',
  to: 'subscriber@example.com',
  subject: 'Weekly Digest',
  html: '<h1>This Week\'s Updates</h1><p>Check out what\'s new...</p>',
  text: 'This Week\'s Updates\n\nCheck out what\'s new...'
});
```

### Multiple Recipients with CC/BCC

```ts
await jetemail.email.send({
  from: 'Team <team@yourapp.com>',
  to: ['alice@example.com', 'bob@example.com'],
  cc: 'manager@example.com',
  bcc: 'archive@yourapp.com',
  subject: 'Team Update',
  text: 'Hello team...'
});
```

### Email with Attachments

```ts
import { readFileSync } from 'fs';

const pdfBuffer = readFileSync('./report.pdf');
const base64Data = pdfBuffer.toString('base64');

await jetemail.email.send({
  from: 'Reports <reports@yourapp.com>',
  to: 'user@example.com',
  subject: 'Monthly Report',
  html: '<p>Please find the report attached.</p>',
  attachments: [
    {
      filename: 'report.pdf',
      data: base64Data
    }
  ]
});
```

### Custom Headers

```ts
await jetemail.email.send({
  from: 'Your App <hello@yourapp.com>',
  to: 'user@example.com',
  subject: 'Order Confirmation',
  html: '<h1>Order Confirmed!</h1>',
  headers: {
    'X-Order-ID': '12345',
    'X-Campaign': 'order-confirmation'
  }
});
```

---

## Error Handling

The SDK throws `JetEmailError` for API errors:

```ts
import { JetEmail, JetEmailError } from 'jetemail';

try {
  await jetemail.email.send({ /* ... */ });
} catch (error) {
  if (error instanceof JetEmailError) {
    console.error('API Error:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Response:', error.response);
  } else {
    throw error;
  }
}
```

### Common Error Codes

| Status | Description |
|--------|-------------|
| 400 | Invalid request (missing fields, invalid format) |
| 401 | Invalid or missing API key |
| 500 | Server error |

---

## TypeScript Support

Full TypeScript support with exported types:

```ts
import {
  JetEmail,
  SendEmailOptions,
  SendEmailResponse,
  SendBatchResponse,
  JetEmailError,
  Attachment
} from 'jetemail';
```

---

## Requirements

- Node.js 18+ (uses native `fetch`)

---

## License

MIT
