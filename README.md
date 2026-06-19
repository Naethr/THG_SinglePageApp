# Game Explorer

Webpack SPA built with vanilla JavaScript and SCSS to browse video games through the RAWG API.

## Installation

```bash
npm install
```

## RAWG API key

This project uses the RAWG API.

Create a `.env` file at the root of the project:

```env
RAWG_API_KEY=your_rawg_api_key_here
```

Then restart the dev server.

Because this is a front-end-only SPA, the API key is exposed in the browser bundle. This is acceptable for this exercise, but a production application should use a backend/proxy.

A template is provided in `.env.example`.

## Running The App

```bash
npm run dev
```

Production build:

```bash
npm run build
```

## Routes

- `/`: list of anticipated games for the coming year.
- `/search/:query`: list filtered by search query.
- `/platform/:id`: list filtered by platform.
- `/genre/:id`: list filtered by genre.
- `/tag/:id`: list filtered by tag.
- `/developer/:id`: list filtered by developer.
- `/publisher/:id`: list filtered by publisher.
- `/game/:slug`: game detail page.

## Implemented Features

- Webpack Dev Server with `historyApiFallback`.
- SCSS compiled by Webpack.
- Simple SPA router using the History API.
- PageList with game cards, search, platform filter, and `Show more` button in 9 / 18 / 27 steps.
- Home page based on a dynamic date range: today to today + 1 year.
- PageDetail with description, image, release date, developers, tags, genres, publishers, platforms, official website, videos when available, ratings, screenshots, and store links.
- Internal SPA links from detail pages to filtered list pages.
- Loader, readable error messages, and empty state.
- Basic mobile responsive layout.

## Known Limitations

- RAWG videos are sometimes unavailable depending on the game or API plan. The video section is hidden when no video is available.
- Similar games are not implemented as a priority because of the free RAWG API limitations.
- Publishers are not always present in RAWG list responses, so cards display only the available fields.
- The API key is visible client-side because the exercise does not include a backend.
