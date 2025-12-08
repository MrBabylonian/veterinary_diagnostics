This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Branch Protection

This repository uses GitHub branch protection rules to prevent direct pushes to the `main` branch.

### Setting Up Branch Protection (Repository Admin Required):

To properly protect the main branch, a repository administrator must configure branch protection rules in GitHub:

1. Go to repository Settings → Branches
2. Add a branch protection rule for `main`
3. Enable the following settings:
   - ☑ Require a pull request before merging
   - ☑ Require status checks to pass before merging
   - ☑ Do not allow bypassing the above settings

### How to contribute:

1. Create a new feature branch from `main`
2. Make your changes and commit them to your feature branch
3. Push your feature branch to GitHub
4. Create a pull request to merge your changes into `main`

**Note**: The GitHub Actions workflow in `.github/workflows/protect-main-branch.yml` serves as a status check that will fail if someone attempts to push directly to main. However, the primary protection comes from the branch protection rules configured in the repository settings.
