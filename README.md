# Roll20 Camera Follow Script

This is a custom Roll20 API script that automatically centers the view of a specific player (e.g., a "Camera Man" account used for streaming or spectator purposes) on the token whose turn it is in the Turn Order tracker.

## Features

- Automatically moves the camera view to the active token in initiative.
- Toggle camera follow on or off with chat commands.
- Optionally move **all** players’ views instead of just a specific account.

## Installation

1. Copy the contents of [`camera-follow.js`](./camera_follow.js) into the Roll20 API Scripts editor.
   1. From your Game Details Page, click "Settings" -> "Mod (API) Scripts".
   2. Click "New Script".
   3. Paste content and name the script.
3. Save and enable the script.
4. Ensure your camera account (e.g., "Camera Man") matches the name defined in the configuration.

## Configuration

Open the script and modify the following line to match your spectator or camera account's display name:

```js
const CAMERA_MAN_NAME = "Camera Man";
```
This must exactly match the display name of the account used.

## Usage

GM-only chat commands:

    !camera-follow on
    Enables automatic camera following.

    !camera-follow off
    Disables camera following.

    !camera-follow all
    Toggles whether the camera movement applies to all players (true) or only the camera account (false).

## License

This script is released for personal or game group use under the MIT License.
