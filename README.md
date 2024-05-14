# Rabin-Karp 2D Pattern Matching Algorithm

## What is it?

This is a simple implementation of rabin-karp string matching algorithm extended to handle 2D arrays! It can look for `N*N` array in `K*M` array. The approach is sub logarithmic, as the after initial top row `M*N` hashes calculation, later the whole row is recalculated only when going down by 1 row. When mowing the current pattern window to the right previous column hash is used in recalculation. As a result, all later (after 1st row) slides to the rights are linear.

## How to run

- Clone the repo
- Build it using `npm run build`
- Run it using `npm run start`

OR

- Visit it [hosted here]("https://rabin-karp.encape.me")

## What is used?

As a practice NextJS was used (even though the 'use client' is utilized). [ShadCDN](https://ui.shadcn.com/) was used as a component library.
