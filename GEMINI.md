# Project Overview

This is a Next.js project for the CodingCat.dev website. It's a platform for podcasts, courses, and blog posts, built with a modern tech stack.

## Key Technologies

*   **Framework:** [Next.js](https://nextjs.org/) (React framework)
*   **CMS:** [Sanity.io](https://www.sanity.io/) (headless CMS)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Radix UI](https://www.radix-ui.com/)
*   **Search:** [Algolia](https://www.algolia.com/)
*   **Deployment:** Vercel

## Architecture

The project follows a standard Next.js app directory structure. It uses Sanity for content management, with a dedicated Sanity Studio at the `/studio` route. The frontend is built with React and Tailwind CSS, and it uses various libraries for UI components, search, and more.

# Building and Running

## Key Commands

*   **`pnpm dev`**: Starts the development server.
*   **`pnpm build`**: Builds the application for production.
*   **`pnpm start`**: Starts the production server.
*   **`pnpm lint`**: Lints the code.
*   **`pnpm format`**: Formats the code with Biome.

## Development Conventions

*   **Content Management:** All content is managed through Sanity. The schema is defined in the `sanity/schemas` directory.
*   **Styling:** The project uses Tailwind CSS for styling.
*   **UI Components:** The project uses Radix UI for accessible UI components.
*   **Code Formatting:** The project uses Biome for code formatting.
