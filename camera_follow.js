// ==Camera Follow Script==
// Automatically centers the view of a specific player on the token whose turn it is in the Turn Order tracker of Roll20
// Toggle with !camera-follow on/off
// Toggle moving all players with !camera-follow all
//
// API Source
// https://wiki.roll20.net/API:Utility_Functions#Miscellaneous

let cameraFollowEnabled = false;
let moveAll = false;

// === CONFIGURATION ===
const CAMERA_MAN_NAME = "Camera Man"; // <-- Set this to match the display name of the camera account
// =====================

on("chat:message", (msg) => {
    if (msg.type === "api" && playerIsGM(msg.playerid)) {
        const args = msg.content.split(" ");
        if (args[0] === "!camera-follow") {
            if (args[1] === "on") {
                cameraFollowEnabled = true;
                sendChat("CameraFollow", "/w gm Camera follow enabled.");
            } else if (args[1] === "off") {
                cameraFollowEnabled = false;
                sendChat("CameraFollow", "/w gm Camera follow disabled.");
            } else if (args[1] === "all") {
		moveAll = !moveAll;
		sendChat("CameraFollow", "/w gm move all players: " + moveAll);
	    }else {
                sendChat("CameraFollow", "/w gm Usage: !camera-follow [on|off]");
            }
        }
    }
});

on("change:campaign:turnorder", function() {
    if (!cameraFollowEnabled) return;

    const turnOrderRaw = Campaign().get("turnorder");
    if (!turnOrderRaw) return;

    const turnOrder = JSON.parse(turnOrderRaw);
    if (!Array.isArray(turnOrder) || turnOrder.length === 0) return;

    const currentTurn = turnOrder[0];
    const token = getObj("graphic", currentTurn.id);
    if (!token) return;

    const cameraPlayer = findObjs({
        _type: "player",
        _displayname: CAMERA_MAN_NAME
    })[0];

    if (!cameraPlayer) {
        log("Camera man player not found. Check CAMERA_MAN_NAME.");
        return;
    }

    const x = token.get("left");
    const y = token.get("top");
    const pageId = token.get("pageid");

    if (!moveAll) {
	sendPing(x, y, pageId, cameraPlayer.id, true, cameraPlayer.id);
    } else {
	sendPing(x, y, pageId, cameraPlayer.id, true);
    }
});

