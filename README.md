# Minimal Expo Starter

A personal Expo SDK 58 starter for native iOS and Android apps.

## Demo

[▶ Watch the physical-device on-device AI demo](docs/media/on-device-ai-demo.mp4)

The recording shows the native Expo UI, generation parameters, framework
selection, and local model status on a real device.

## Included

- On-device chat with a bottom composer and streaming responses
- Native Settings sheet for model management and generation controls
- Navigation theme follows the system color scheme
- Universal `@expo/ui` components backed by SwiftUI and Jetpack Compose
- On-device text generation with React Native AI, Llama, and MLC
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

## On-device AI

The Expo UI-powered home screen integrates three
[`callstackincubator/ai`](https://github.com/callstackincubator/ai) providers
behind one AI SDK v6 streaming interface:

- **Apple** — Foundation Models, available immediately on supported iOS 26
  devices.
- **Llama (default)** — Qwen3.5-4B through `llama.rn` and llama.cpp. The
  Q4_K_M GGUF download is about 3.03 GB.
- **MLC** — compiled Qwen models through MLC Engine. The selected model
  starts around 600 MB; the bundled model list differs between iOS and Android.

Open Settings from the chat toolbar, choose a runtime, and use its model button
to download or load the model. Switching runtimes checks the local files and
unloads the previous model from memory. The conversation stays in memory and is
sent as context to the selected on-device model.

Use a physical device and a native development build (`bun run ios` or
`bun run android`). These providers are not available in Expo Go, and the
prebuilt MLC model libraries do not run in iOS Simulator.

## Quality checks

```bash
bun run lint
bun run typecheck
bun run check
```

The type check generates Expo Router types before running TypeScript. GitHub
Actions checks the locked dependencies and runs lint and type checking on pushes
and pull requests.

## Routes

```text
src/app/
├── _layout.tsx
├── index.tsx
└── settings.tsx
```

- `/` — Chat
- `/settings` — Settings sheet

## Create a new app

After copying this starter, update:

- `name` in `package.json`
- `name`, `slug`, and `scheme` in `app.json`
- `ios.bundleIdentifier` and `android.package` in `app.json`
- App icons and splash screen assets

Then remove or replace the example Home and Settings content.
