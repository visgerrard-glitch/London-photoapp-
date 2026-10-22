# London Photo Challenge – native iPhone app

47 original photo tasks from the supplied webapp. React Native / Expo project (NOT an already signed IPA). Includes location monitoring in the background and local notifications at approximately 250 m, search, category filter, nearest-first sorting, navigation, saved ticks and reset. All data stays on device.

## Important iPhone limitations
- Require iOS Location = Always, Precise Location on, and Notifications allowed. Do not force-quit the app. iOS decides delivery timing; neither instantaneous delivery nor continuous operation is guaranteed.
- Expo Go does not support this background location feature. Test using a signed development, internal distribution or TestFlight build.
- Background tracking uses battery. Stop location when the trip is over.
- Old webapp ticks are in Safari's localStorage and will not be imported automatically.

## Build without owning a Mac
You'll still need access to a computer/browser environment capable of executing npm commands (e.g. GitHub Codespaces via your phone), an Expo account, and usually paid Apple Developer membership for signing and distributing a standalone iPhone build. No Apple signing credentials are in this ZIP. Exact enrollment, eligibility and install steps depend on Apple account and distribution choice.

1. Upload ZIP contents (not the outer folder) to a private GitHub repository, open GitHub Codespaces for that repo in your iPhone browser.
2. In its terminal run `npm install`, then `npx expo install --fix` to align native package versions, then `npx expo-doctor`.
3. Run `npx eas-cli login` and `npx eas-cli init`. This links the project and adds `extra.eas.projectId` to `app.json`. Ensure iOS bundle ID is unique to your Apple account.
4. Run `npx eas-cli build --platform ios --profile preview` for an internal build, and follow the Apple signing/device registration instructions. For TestFlight, use production build and App Store Connect submission instead.
5. Open the EAS installation link on the registered iPhone and follow Apple installation/trust prompts, or install via TestFlight as applicable.
6. Start app, enable Notifications and Location Always + Precise, then press Start locatie. Test it outdoors. Be aware permissions and phone settings may affect delivery.

Technical: src/background.js defines a top-level Expo TaskManager task; all 47 challenges are checked whenever OS supplies an update (rather than registering >20 simultaneous iOS geofences). Notification IDs are persistently deduplicated. Foreground watcher assists when app is visible. This is a project source package; compilation, code signing and on-device QA remain to be performed.

Docs: https://docs.expo.dev/versions/latest/sdk/location/ and https://docs.expo.dev/build/introduction/
