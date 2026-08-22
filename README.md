# epilog

epilog is an open-source media tracking application built with TanStack Start, Convex, and Better Auth.  
Track everything you watch and read — movies, TV, anime, books, and manga — in one place with status-based logs, a media shelf, and a movie calendar.

## Features

### Media Tracking

- Track five media types: **Movies**, **TV**, **Anime**, **Books**, and **Manga**
- Status-based logging (interest, to-read / watchlist, in-progress, finished, and dropped) for every media type
- Reading progress for books (pages read / total page count)
- Custom edition covers — pick a specific book edition and cover from its editions
- Series tracking (series name, position, and total)

### Search & Discovery

- Search **Movies & TV** via TMDB
- Search **Anime & Manga** via MyAnimeList (MAL)
- Search **Books** via Open Library, with edition and cover browse

### Organization

- **Media Shelf** — your library organized by status
- **Movie Calendar** — schedule watch events on specific dates
- Switch between grid and list views, and filter by media type

### UI

- Responsive layout with a mobile bottom bar and bottom-sheet dialogs
- ShadCN (Base UI) components styled with Tailwind CSS v4

### Authentication

- Google OAuth sign-in (via Better Auth)

## Tech Stack

**Frontend**

- TanStack Start (full-stack React framework)
- TanStack Router (routing)
- TanStack Query (server state management)
- ShadCN (Base UI components)
- Tailwind CSS v4
- Phosphor Icons
- React 19

**Backend**

- Convex (real-time database and backend)
- Better Auth (authentication)
- Zod (schema validation)

**External APIs**

- TMDB (movies & TV)
- MyAnimeList (anime & manga)
- Open Library (books & covers)

**Development**

- Oxlint for linting and Oxfmt for formatting

## Installation

### Prerequisites

- Node.js 18+
- pnpm 10+ (used here)
- Git
- A [Convex](https://www.convex.dev/) account
- A [TMDB](https://www.themoviedb.org/) API key
- Google OAuth credentials (for sign-in)
- MyAnimeList client credentials (required for anime & manga search)

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/ankitk26/epilog.git
    cd epilog
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Set up Convex:

    ```bash
    npx convex dev
    ```

    Follow the prompts to create a new Convex project and get your deployment URL.

4. Create a `.env.local` file in the root directory:

    ```env
    # Convex (Required)
    CONVEX_DEPLOYMENT=dev:your_project_name
    CONVEX_DEPLOYMENT_KEY=your_deployment_key
    VITE_CONVEX_URL=https://your_project_url.convex.cloud
    VITE_CONVEX_SITE_URL=https://your_project_url.convex.site

    # Site URL (Required)
    VITE_SITE_URL=http://localhost:3000
    SITE_URL=http://localhost:3000

    # Better Auth (Required for authentication)
    BETTER_AUTH_SECRET=your_better_auth_secret

    # Google OAuth (Required for authentication)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # TMDB (Required for movies & TV search)
    TMDB_API_KEY=your_tmdb_api_key
    TMDB_TOKEN=your_tmdb_bearer_token

    # MyAnimeList (Required for anime & manga search)
    MAL_CLIENT_ID=your_mal_client_id
    MAL_CLIENT_SECRET=your_mal_client_secret

    # Optional: enhanced book covers
    HARDCOVER_API_TOKEN=your_hardcover_token

    # Optional: rate limiting / caching
    UPSTASH_REDIS_REST_URL=your_upstash_url
    UPSTASH_REDIS_REST_TOKEN=your_upstash_token
    ```

5. Run the development servers (Vite and Convex together):

    ```bash
    pnpm run dev:all
    ```

6. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Sign in with your Google account
2. Search for a movie, TV show, anime, book, or manga
3. Add it to your log and set its status
4. Track reading progress, pick custom book covers, and organize your media shelf
5. Schedule movies on the calendar to plan what to watch next

## Support

- Issues: [GitHub Issues](https://github.com/ankitk26/epilog/issues)
- Discussions: [GitHub Discussions](https://github.com/ankitk26/epilog/discussions)
- Documentation: Check the code comments and type definitions
