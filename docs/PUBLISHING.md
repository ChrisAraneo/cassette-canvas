# Publishing

How to release a new version of `@chris.araneo/cassette-canvas` to npm.

## Before you start

```sh
npm whoami        # must print chris.araneo, the owner of the @chris.araneo scope
```

If it prints an error, run `npm login` first. npm asks for a 2FA code, or
opens a browser, when you publish.

tsdown needs Node 22.18+, 24.11+, or 26+. It runs on older versions too, but
prints an `EBADENGINE` warning.

## What `npm publish` does

It runs two scripts from `package.json` before it uploads anything:

1. `prepublishOnly` runs `npm run check` (typecheck, lint, and tests).
2. `prepack` runs `npm run build:lib`, which builds `dist/lib` with tsdown.

The package holds `dist/lib` (`index.js`, `index.js.map`, `index.d.ts`) and
`docs` (every page of the documentation), plus `package.json`, `README.md`,
and `LICENSE`, which npm always includes.
`publishConfig.access` is `public`, so you don't need `--access public`.

The build reads the files on disk, not the last commit, so always publish from
a clean working tree.

## Choosing the version

- `patch` for bug fixes.
- `minor` for new features.
- `major` for breaking changes. While the version is `0.x`, breaking changes go
  in a `minor` release instead.

## Release steps

1. Start from an up-to-date, clean `master`.

   ```sh
   git switch master
   git pull
   git status        # should print nothing
   ```

2. Check the package.

   ```sh
   npm run check
   npm pack --dry-run
   ```

   The file list should show `LICENSE`, `README.md`, `package.json`, the
   three files in `dist/lib`, and the pages in `docs`. Review `dependencies` in
   `package.json` too:
   everyone who installs the package downloads them.

3. Update the version badge at the top of `README.md`
   (`badge/version-v<version>`) to the new version and commit it.

   ```sh
   git commit -am "chore(readme): update version badge"
   ```

4. Bump the version.

   ```sh
   npm version patch -m "chore(release): %s"    # or minor / major
   ```

   This updates `package.json` and `package-lock.json`, commits them, and
   creates the tag `v<version>`. It refuses to run if the working tree is
   dirty.

5. Push the commits and the tag, then wait for CI to pass.

   ```sh
   git push origin master --follow-tags
   ```

6. Publish.

   ```sh
   npm publish --dry-run   # last check
   npm publish
   ```

7. Verify.

   ```sh
   npm view @chris.araneo/cassette-canvas version
   ```

   Open <https://www.npmjs.com/package/@chris.araneo/cassette-canvas> and check
   that the new version, the README and the cassette image show.

8. Optional: create a GitHub release.

   ```sh
   gh release create v<version> --generate-notes
   ```

## Pre-releases

To publish a beta without changing what `npm install` gets:

```sh
npm version prerelease --preid beta -m "chore(release): %s"
git push origin master --follow-tags
npm publish --tag beta
```

Without `--tag beta`, the pre-release becomes `latest`. Users install it with
`npm install @chris.araneo/cassette-canvas@beta`.

## If something goes wrong

- A published version number stays taken. Even after an unpublish, that
  number can't be published again. Fix the problem in a new patch release.
- `npm unpublish @chris.araneo/cassette-canvas@<version>` only works within
  72 hours, and only if no other package depends on that version. After that,
  use `npm deprecate @chris.araneo/cassette-canvas@<version> "reason"`.
- If CI fails after you pushed the tag and nothing was published yet, fix the
  problem, then delete the tag and tag the fixed commit:

  ```sh
  git tag -d v<version>
  git push origin :refs/tags/v<version>
  git tag -a v<version> -m "v<version>"
  git push origin master --follow-tags
  ```
