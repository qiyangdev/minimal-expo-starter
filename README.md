# Minimal Expo Starter

A personal Expo SDK 57 starter for native iOS and Android apps.

## Demo

[▶ Watch the physical-device on-device AI demo](docs/media/on-device-ai-demo.mp4)

The recording shows the native Expo UI, generation parameters, framework
selection, and local model status on a real device.

## Included

- Expo Router with native tabs
- Independent stacks for Home and Settings
- Large navigation titles on iOS
- Universal `@expo/ui` components backed by SwiftUI and Jetpack Compose
- On-device text generation with React Native AI, Llama, and MLC
- Strict TypeScript, typed routes, React Compiler, and ESLint

## Requirements

- Node.js 22.13 or newer
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

## On-device AI

The Expo UI-powered home screen integrates three
[`callstackincubator/ai`](https://github.com/callstackincubator/ai) providers
behind one AI SDK v6 streaming interface:

- **Apple** — Foundation Models, available immediately on supported iOS 26
  devices.
- **Llama** — Llama 3.2 1B Instruct through `llama.rn` and llama.cpp. The
  selected Q4 GGUF download is about 808 MB.
- **MLC** — compiled Qwen models through MLC Engine. The selected model
  starts around 600 MB; the bundled model list differs between iOS and Android.

Llama and MLC download and load automatically when the user selects the
runtime in Settings. Existing files are reused, and switching runtime unloads
the previous model from memory. Prompts and generated text remain on-device.

Use a physical device and a native development build (`bun run ios` or
`bun run android`). These providers are not available in Expo Go, and the
prebuilt MLC model libraries do not run in iOS Simulator.

## Quality checks

```bash
bun run lint
bun run typecheck
bun run check
```

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
