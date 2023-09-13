Team Forecast is a service to let teams forecast on events to help hone their
prediction skills.

## Getting Started

```zsh
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"' > .env.local
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
docker compose up
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Commiting to main will trigger a deploy in vercel automatically.

Work to do:

P0s:

# Models

## Question

- QuestionID: A unique identifier for each question.
- CreatedBy: The UserID of the user who created the question.
- CreatedAt: The date and time the question was created.
- AnonymousQuestion: whether the question's author should be visible
- Title: The title of the question.
- Description: A detailed description of the question.
- Category: The category or topic to which the question belongs.
- ClosingDate: The date and time when the prediction window closes.
- ResultDate: The date and time of the result set being set.
- ResultValue: Final value (0 or 1) for the question.

## Forecast Log Entry

- PredictionID: A unique identifier for each prediction.
- QuestionID: The ID of the question to which the prediction relates.
- UserID: The ID of the user who made the prediction.
- AnonymousPrediction: whether the prediction's author should be visible
- CreatedAt: The date and time the prediction was made.
- PredictionValue: The specific prediction made by the user (% chance only rn)

## Categories

- CategoryID: A unique identifier for each category.
- CategoryName: The name of the category.
- Description: A brief description of the category.

## Comments

- CommentID: A unique identifier for each comment.
- UserID: The ID of the user who made the comment.
- QuestionID: The ID of the question to which the comment relates.
- AnonymousComment: whether the comment's author should be visible
- CreatedAt: The date and time the comment was made.
- CommentText: The text of the comment.

# Functionality

## Question creation

- create new question
- edit existing question
- close question
- resolve question

## Create prediction

- create new prediction

## Comments

- copy from team prediction

## Category

- create category

## Send Slack message

- send slack on new market creation
