# Solution for the Backend Test from Fireflies.ai

This project contains a API server for a implementation of a Meeting Bot that summarizes meetings and extract tasks and other key points from meetings.

## How to run

To run with Docker, simply clone the project, add the `.env` with your variables and run `docker compose up`. The server will build and run along with a MongoDB instance.

For development:

- Ensure you have a MongoDB instance running (the docker compose can be used) and Node v22.
- Install the dependencies: `npm install`.
- Add the `.env`.
- Seed the database: `npm run seed`.
- Start the server: `npm run start`.

## API specification

The specification to how to use the API.

All scripts to manually test the API can be found in the [scripts](./scripts/) folder.

### Authentication

The authentication is done through the `x-user-id` header.

### GET /api/meetings

Return all meetings for the current user with pagination.

**Query Params**:

- page: the page to retrieve, starting at 1 (default 1)
- limit: the limit to retrieve (default 100)

**Response**:

- total: total of meetings for the current user
- limit: the limit sent to the API
- page: the current page
- count: the count of items returned
- hasNextPage: if there's a next page
- data: the list of meetings

Example

```json
{
  "total": 2,
  "limit": 100,
  "page": 1,
  "count": 2,
  "hasNextPage": false,
  "data": [
    {
      "_id": "6791a617f427a0de47c5eba8",
      "title": "Meeting Title",
      "date": "2025-01-23T02:14:47.777Z",
      "participants": ["Alice", "Bob"],
      "duration": 120,
      "actionItems": []
    }
  ]
}
```

### POST /api/meetings

Create a meeting with the `title`, `date` and `participants`:

```json
{
  "title": "Meeting Title",
  "date": "2025-01-22T17:27:56.721Z",
  "participants": ["John Doe", "Alice Brown"]
}
```

**Response**:

The created meeting

```json
{
  "_id": "6791a6dc69948aa37b765fce",
  "title": "Meeting Title",
  "date": "2025-01-22T17:27:56.721Z",
  "participants": ["John Doe", "Alice Brown"],
  "actionItems": []
}
```

### GET /api/meetings/:id

Retrieve a specific meeting and its tasks by id.

**Response**:

The meeting details and tasks linked to it.

```json
{
  "_id": "6791b4f3acf74348eec55610",
  "title": "Meeting Title",
  "date": "2025-01-23T03:18:11.161Z",
  "participants": ["Alice", "Bob"],
  "duration": 120,
  "actionItems": ["Action item 1"],
  "tasks": [
    {
      "_id": "6791b4f3acf74348eec55612",
      "title": "Task Title",
      "description": "Task Description",
      "status": "pending",
      "dueDate": "2025-01-23T03:18:11.313Z"
    }
  ]
}
```

### PUT /api/meetings/:id/transcript

Update a meeting with the transcript and duration.

Note: I've decided to add the duration to the body of this request as it's the most suitable place. Adding the `duration` to the meeting create endpoint wouldn't make sense as you can create upcoming meetings.

**Body**:

```json
{
  "transcript": "This is the new transcript",
  "duration": 183
}
```

**Response**:

```json
{
  "_id": "6791b5a170de671f0c294eed",
  "title": "Meeting Title",
  "date": "2025-01-23T03:21:05.112Z",
  "participants": ["Alice", "Bob"],
  "transcript": "This is the new transcript",
  "duration": 183,
  "actionItems": []
}
```

### POST /api/meetings/:id/summarize

Summarize a transcript and extract action items from a meeting using the [Summary Provider](#summary-provider)

It automatically creates tasks for each action item.

**Response**:

The updated meeting with the summary and created tasks.

```json
{
  "_id": "6791b68852923e9e74788b53",
  "title": "Meeting Title",
  "date": "2025-01-23T03:24:56.811Z",
  "participants": [],
  "transcript": "This is the transcript",
  "summary": "This is the tra",
  "duration": 120,
  "actionItems": ["Action item 1", "Action item 2"],
  "tasks": [
    {
      "_id": "6791b68852923e9e74788b5d",
      "title": "Action item 1",
      "status": "pending"
    },
    {
      "_id": "6791b68852923e9e74788b5e",
      "title": "Action item 2",
      "status": "pending"
    }
  ]
}
```

### GET /api/meetings/stats

Retrieve the stats for all meetings from the current user.

**Response**:

Returns the general stats, top participants and meetings by day of week.

Note: `meetingsByDayOfWeek` will **always** return a 7 item array for each day.

```json
{
  "generalStats": {
    "averageDuration": 102.33,
    "averageParticipants": 1.67,
    "longestMeeting": 172,
    "shortestMeeting": 12,
    "totalMeetings": 3,
    "totalParticipants": 5
  },
  "topParticipants": [
    { "participant": "John Doe", "meetingCount": 3 },
    { "participant": "Alice Brown", "meetingCount": 1 },
    { "participant": "Lorem Ipsum", "meetingCount": 1 }
  ],
  "meetingsByDayOfWeek": [
    { "dayOfWeek": 1, "count": 1 },
    { "dayOfWeek": 2, "count": 0 },
    { "dayOfWeek": 3, "count": 0 },
    { "dayOfWeek": 4, "count": 1 },
    { "dayOfWeek": 5, "count": 1 },
    { "dayOfWeek": 6, "count": 0 },
    { "dayOfWeek": 7, "count": 0 }
  ]
}
```

### GET /api/dashboard

Retrieve the dashboard information for the current user

**Response**:

Returns the total meetings, upcoming meetings, summary of tasks and the overdue tasks

```json
{
  "totalMeetings": 3,
  "upcomingMeetings": [
    {
      "title": "Meeting 3",
      "date": "2025-02-12T12:00:00.000Z",
      "participantCount": 2
    }
  ],
  "taskSummary": {
    "pending": 2,
    "inProgress": 2,
    "completed": 1
  },
  "overdueTasks": [
    {
      "_id": "6777d1406f3ae4fcae22ea5d",
      "title": "Task 1",
      "dueDate": "2025-01-03T12:00:00.000Z",
      "meetingId": "6777d1406f3ae4fcae22ea5b",
      "meetingTitle": "Meeting 1"
    }
  ]
}
```

## Summary Provider

One part of this project that is worth mentioning separately is the Summary Provider.

It's a [hexagonal architecture](<https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)>) approach to implement the summary so that the developers can test different prompts and models without changing the current behaviour of the application.

The implementation is pretty simple, there's the [definition](src/modules/summaryProvider/SummaryProvider.ts) for the provider using interfaces, the [enum](src/modules/summaryProvider/SummaryProviderEnum.ts) to keep the list of providers and a simple [register](src/modules/summaryProvider/summaryProviderRegister.ts) to avoid coupling the definition to each implementation.

It uses the `SUMMARY_PROVIDER` environment variable as feature flag to determine which provider to use, but could be improved to be stored in the user for testing in staging and production environments in the future.

As for now, I've the [mock provider](src/modules/summaryProviderMock/MockSummaryProvider.ts) (the default) and [OpenAI provider](src/modules/summaryProviderOpenai/OpenaiSummaryProvider.ts) with `gpt-4o-mini`.

To use the OpenAI provider, set the `SUMMARY_PROVIDER` to `openai` and add your OpenAI key with the `OPENAI_API_KEY` variable in the `.env`.

## Next steps

While this project aims to be bare minimum to meet the requirements, there's some improvements that can be made to make it more robust and scalable.

**Implement queues**

This is the most important improvement that can be made:

Calling LLMs are slow and can be expensive, so having a queue system to manage is really important.

This could be implemented using RabbitMQ, BullMQ or Redis.

The summarization is completly synchronous, and having a queue system would be good to help break LLM calls if needed

Retrying.

**Cache MongoDB aggregations**

Both `/api/dashboard` and `/api/meetings/stats` routes use aggregations to generate the responses, but this in large scale with lots of requests will be a problem.

Considering the nature of those routes, we can extrapolate that they will have more read than write operations linked to them. For example, `/api/dashboard` that would probably be used in the home of the front-end and handling users constantly acessing it.

We could make use of [materialized views](https://www.mongodb.com/docs/manual/core/materialized-views) from MongoDB to keep the state until certain point and only aggregation over 1 day (or way less depending on the scale) of data instead.

Or just keeping this data stored directly if the write is easily managable and there's no problem with concurrency. Concurrency could be mitigated with stream/queues too if needed.

This problem can be solved in lots of different ways, so it's up to the scale of the application and its demands.

**Better documentation**

While I kept all the documentation for the project in the README, it could be useful to implement Swagger with OpenAPI for a better and more interactive API documentation.

**Enrich tasks from action items**

As of today, this project only creates the task with the title as the action item, but, as I comment [here](https://github.com/fersilva16/fireflies-backend-test/blob/655bc68a56080a90d14e833bf7f21242974b40ed/src/modules/meeting/api/meetingSummarizePost.ts#L76), we could make another call to the LLM with the transcript/summary to get more information about the task, such as the description and due date.

**Chunk the transcript**

I've made a little implementation with [js-tiktoken](https://github.com/dqbd/tiktoken) to estimate the number of tokens for the transcript and avoid context window limit errors from the API.

While it works, it's also ignoring the rest of the transcript, the next step would be to improve both the implementation and prompt to handle iterating over the summary and action items with the next chunks to enrich them.

Here's the [link](https://github.com/fersilva16/fireflies-backend-test/blob/5522d56666d24a283fa82a20b1e68dc2c780d583/src/modules/summaryProviderOpenai/OpenaiSummaryProvider.ts#L32) to the code.

## Project Structure

The project follows the structure that I'm most familiar with for Node.js REST APIs.

The folders are separated by feature to keep it easy to navigate, keeping together what is used together. The `modules` folder is the most notable one, as it contains the modules that make up the API, and where I kept most of the business logic.

The name for files follows the pattern of containing first the feature/module it belongs to, and then the action. For example, the `meetingGet.ts` file. It helps with search to easily narrow down the desired file.

For routing, each "level" of routes is separated into a different file. For example, the `/api/meetings` routes is defined in the `meetings` module, or the `/api` routes are defined separately as it is secured by the `authMiddleware`, and so on.

Test files follow the pattern `__tests__/*.spec.ts` and are kept alongside the source code to keep them grouped together. More on tests [here](#testing).

## Stack

Some details on the stack and tools used:

- MongoDB with mongoose as the database
- Koa as the web framework, while the original challenge use express, I changed it to have better async and sync error handling with the [errorMiddleware](./src/middleware/errorMiddleware.ts). It's also the modern and actively maintenated alternative from the same team that created Express.
- Vitest for testing framework.
- Zod for schema validation.
- ESLint for linting with `typescript-eslint` and `eslint-import`.
- Prettier for formatting.
- Husky and lint-staged for pre-commit validations, both to run lint, formatting, type-checking and also [disabling commiting to the main branch](https://github.com/fersilva16/fireflies-backend-test/blob/09c782d7aed42bfc078f29d2c477af8fafbd85de/.husky/pre-commit#L4-L8).
- tsup for building the source code.
- Nix for the local development environment.

## Testing

This project contains a suite of integration tests that cover all the routes and functionality using [supertest](https://github.com/ladjs/supertest) and [mongodb-memory-server](https://github.com/typegoose/mongodb-memory-server).

The tests mainly sends a request to the server, checks the response and asserts the expected database state.

To run the tests, use the command `npm run test`.

**Coverage**

I've set the coverage threshold to 80% and tried to focus on the most important parts of the code such as the routes.

To check the code coverage, use the command `npm run test:coverage`.
