# Climate Assets

Premium static website for Climate Assets, a carbon credits platform focused on bankable and trustworthy projects.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Framer Motion
- Password-protected Git-backed CMS
- Markdown content files
- Web3Forms contact delivery

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## CMS Development

The admin panel is available at `http://localhost:3000/admin`.

Run the site:

```bash
pnpm dev
```

In local development, the CMS password defaults to `admin` when `CMS_ADMIN_PASSWORD`
is not set. Local CMS saves write directly to files under `content/` and
`public/uploads/`.

## Production CMS

The production CMS is password-protected and writes content to GitHub through
Vercel API routes. The client's browser never receives the GitHub token.

Add these environment variables in Vercel:

```bash
CMS_ADMIN_PASSWORD=choose-a-client-password
GITHUB_TOKEN=github_fine_grained_token_with_contents_read_write
GITHUB_REPO=Supernetrix/triochar
GITHUB_BRANCH=main
GITHUB_COMMITTER_NAME=Climate Assets CMS
GITHUB_COMMITTER_EMAIL=Partnerships@climate-assets.com
```

When the client saves content in `/admin`, the API commits Markdown/image changes
to GitHub. Vercel then redeploys from the new commit.

## Contact Form

Create a Web3Forms access key and add it to `.env.local`:

```bash
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_access_key
```

Without the key, the form still validates locally and shows the fallback email path.

## Production Build

```bash
pnpm build
pnpm start
```

The public pages are still statically rendered by Next.js where possible, while
the CMS uses Vercel API routes for GitHub commits.
