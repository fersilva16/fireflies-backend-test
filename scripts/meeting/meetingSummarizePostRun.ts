import { config } from '../../src/config';

const [, , ...unsanitizedArgs] = process.argv;

if (unsanitizedArgs.length < 2) {
  console.log(
    'Usage: npm run x scripts/meeting/meetingSummarizePost.ts <userId> <meetingId>',
  );

  process.exit(1);
}

const [userId, meetingId] = unsanitizedArgs;

const response = await fetch(
  `http://localhost:${config.PORT}/api/meetings/${meetingId}/summarize`,
  {
    method: 'POST',
    headers: {
      'x-user-id': userId,
    },
  },
);

if (!response.ok) {
  const text = await response.text();

  console.log(text);

  process.exit(1);
}

const data = await response.json();

console.log(data);
