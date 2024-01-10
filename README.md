<p align="center">
  <a href="https://nextjs-postgres-auth.vercel.app/">
    <img src="/public/logo.png" height="96">
    <h3 align="center">Next.js Prisma PostgreSQL Auth Starter</h3>
  </a>
</p>

<p align="center">
This is a <a href="https://nextjs.org/">Next.js</a> starter kit that uses <a href="https://next-auth.js.org/">Next-Auth</a> for simple email + password login<br/>
<a href="https://www.prisma.io/">Prisma</a> as the ORM, and a <a href="https://vercel.com/postgres">Vercel Postgres</a> database to persist the data.</p>

<br/>

## Developing Locally


Clone the repo

```bash
npm i
# or
yarn install
```

## Getting Started

First, run the prisma setup, then the server.
Yarn does it automatically, npn not

```bash
npm run prisma:generate
npm run dev
# or
yarn dev
# if not working run a primsa:generate command before
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
