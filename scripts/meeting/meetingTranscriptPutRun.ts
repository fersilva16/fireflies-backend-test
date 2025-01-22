import { config } from '../../src/config';

const [, , ...unsanitizedArgs] = process.argv;

if (unsanitizedArgs.length < 3) {
  console.log(
    'Usage: npm run x scripts/meeting/meetingTranscriptPutRun.ts <userId> <meetingId> <transcript>',
  );

  process.exit(1);
}

const [userId, meetingId, transcript] = unsanitizedArgs as [
  string,
  string,
  string,
];

const body = {
  transcript,
};

const response = await fetch(
  `http://localhost:${config.PORT}/api/meetings/${meetingId}/transcript`,
  {
    method: 'PUT',
    body: JSON.stringify(body),
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
