# Minimal Expo Starter

A personal Expo SDK 58 starter for native iOS and Android apps.

<p align="center">
  <img src="docs/media/screenshot-tab-1.png" alt="Home tab" width="320" />
  <img src="docs/media/screenshot-tab-2.png" alt="Settings tab" width="320" />
</p>

## Included

- Expo Router with native tabs
- Independent stacks for Home and Settings
- Navigation theme follows the system color scheme
- Large navigation titles on iOS
- Universal `@expo/ui` components backed by SwiftUI and Jetpack Compose
- Strict TypeScript, typed routes, React Compiler, and ESLint

## Requirements

- Node.js 22.13+, 24.3+, or 26+ (odd-numbered releases are unsupported)
- Bun
- Xcode for iOS development
- Android Studio for Android development

## Get started

Install dependencies:

```bash
bun install
```

Start the Expo development server:

```bash
bun start
```

Build and run a native app:

```bash
bun run ios
bun run android
```

## Quality checks

```bash
bun run lint
bun run typecheck
bun run check
```

The type check regenerates Expo Router types first, so newly pulled routes are included without starting the development server.

GitHub Actions runs `bun install --frozen-lockfile` and `bun run check` on every push and pull request, using Node.js 24 and Bun 1.3.14.

## Routes

```text
src/app/
├── _layout.tsx
├── (home)/
│   ├── _layout.tsx
│   └── index.tsx
└── settings/
    ├── _layout.tsx
    └── index.tsx
```

- `/` — Home
- `/settings` — Settings

## Create a new app

After copying this starter, update:

- `name` in `package.json`
- `name`, `slug`, and `scheme` in `app.json`
- `ios.bundleIdentifier` and `android.package` in `app.json`
- App icons and splash screen assets

Then remove or replace the example Home and Settings content.

## iPhone Duo demo

The `iphone-duo-demo` branch contains the Features tab, ArrangementView split-layout demo for iOS 27.1 and later, platform fallback, and iPhone Duo screenshots.

To explore the demo:

```bash
git switch iphone-duo-demo
bun install --frozen-lockfile
bun run ios
```
