import { config } from '../../src/config';

const [, , ...unsanitizedArgs] = process.argv;

if (unsanitizedArgs.length < 1) {
  console.log(
    'Usage: npm run x scripts/meeting/meetingAllGetRun.ts <userId> [page] [limit]',
  );

  process.exit(1);
}

const [userId, page, limit] = unsanitizedArgs;

const queryParams = new URLSearchParams();

if (page) queryParams.append('page', page);
if (limit) queryParams.append('limit', limit);

const response = await fetch(
  `http://localhost:${config.PORT}/api/meetings?${queryParams.toString()}`,
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
