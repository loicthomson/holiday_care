# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
bunx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv@0.15.2 create --template minimal --types ts --install bun .
```

## Developing

Once you've created a project and installed dependencies with `bun install`, start a development server:

```sh
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```sh
bun run build
```

You can preview the production build with `bun run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Deploying to GitHub Pages

This project is already configured for GitHub Pages with:

- static adapter in [svelte.config.js](svelte.config.js)
- deploy workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

### 1. Push to GitHub

Push your branch to `main`:

```sh
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

### 2. Enable GitHub Pages

In your repository on GitHub:

1. Go to `Settings` -> `Pages`
2. Under `Build and deployment`, set `Source` to `GitHub Actions`

### 3. Wait for deployment

The workflow named `Deploy to GitHub Pages` will:

1. install dependencies with Bun
2. build the site
3. publish the `build` output

Once complete, your site URL will appear in the workflow summary.

### Local production check

You can test a production build locally with a repo-style base path:

```sh
BASE_PATH=/holiday-childcare bun run build
```

## Running with Docker

This repository includes [Dockerfile](Dockerfile), [docker-compose.yml](docker-compose.yml), and [nginx.conf](nginx.conf).

### Start locally

```sh
docker compose up --build
```

The app will be available at `http://localhost:8080`.

### Stop containers

```sh
docker compose down
```

### Build with a custom BASE_PATH

If you need a GitHub Pages-style base path in the container build:

```sh
docker compose build --build-arg BASE_PATH=/holiday-childcare
docker compose up
```
