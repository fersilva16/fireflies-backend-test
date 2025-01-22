import { config } from '../../src/config';

const [, , ...unsanitizedArgs] = process.argv;

if (unsanitizedArgs.length < 4) {
  console.log(
    'Usage: npm run x scripts/meeting/meetingPostRun.ts <userId> <title> <date> [...participants]',
  );

  process.exit(1);
}

const [userId, title, date, ...participants] = unsanitizedArgs;

const body = {
  title,
  date,
  participants,
};

const response = await fetch(`http://localhost:${config.PORT}/api/meetings`, {
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'x-user-id': userId,
  },
});

if (!response.ok) {
  const text = await response.text();

  console.log(text);

  process.exit(1);
}

const data = await response.json();

console.log(data);
