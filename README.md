# Recipe Generator

AI-powered recipe generator that analyzes photos of ingredients and creates personalized recipes.

## Features

- **Image Analysis** – Upload photos of ingredients; AI identifies them automatically
- **Recipe Generation** – Get recipes tailored to your ingredients, dietary needs, cuisine preference, skill level, and available time
- **AI Image Generation** – Generate appetizing images of your recipes in various styles

## Setup

```bash
npm install
```

Create `.env.local` with:

```
OPENAI_API_KEY=your_key
OPENAI_ANALYZE_PROMPT_ID=your_prompt_id
OPENAI_ANALYZE_PROMPT_VERSION=your_version
OPENAI_RECIPE_PROMPT_ID=your_prompt_id
OPENAI_RECIPE_PROMPT_VERSION=your_version
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

Next.js 16 · React 19 · Tailwind CSS · OpenAI API
