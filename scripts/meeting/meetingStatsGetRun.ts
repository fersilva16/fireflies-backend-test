import { config } from '../../src/config';

const [, , ...unsanitizedArgs] = process.argv;

if (unsanitizedArgs.length < 3) {
  console.log(
    'Usage: npm run x scripts/meeting/meetingStatsGetRun.ts <userId>',
  );

  process.exit(1);
}

const [userId] = unsanitizedArgs;

const response = await fetch(
  `http://localhost:${config.PORT}/api/meetings/stats`,
  {
    method: 'GET',
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
