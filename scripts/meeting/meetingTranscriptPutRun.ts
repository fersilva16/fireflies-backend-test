import { config } from '../../src/config';

const [, , ...unsanitizedArgs] = process.argv;

if (unsanitizedArgs.length < 4) {
  console.log(
    'Usage: npm run x scripts/meeting/meetingTranscriptPutRun.ts <userId> <meetingId> <transcript> <duration>',
  );

  process.exit(1);
}

const [userId, meetingId, transcript, duration] = unsanitizedArgs as [
  string,
  string,
  string,
  string,
];

const body = {
  transcript,
  duration: Number(duration),
};

const response = await fetch(
  `http://localhost:${config.PORT}/api/meetings/${meetingId}/transcript`,
  {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'x-user-id': userId,
      'content-type': 'application/json',
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
