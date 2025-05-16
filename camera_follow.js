// Toggle with !camera-follow on/off
// Toggle moving all players with !camera-follow all
//
// API Source
// https://wiki.roll20.net/API:Utility_Functions#Miscellaneous

let cameraFollowEnabled = false;
let followMoveEnabled = true;
let moveAll = false;
let cachedCameraPlayer = null;
let currentTokenId = null;

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
		    } else if (args[1] === "move") {
				followMoveEnabled = !followMoveEnabled;
				sendChat("CameraFollow", "/w gm follow token moves: " + followMoveEnabled);
		    } else {
                sendChat("CameraFollow", "/w gm Usage: !camera-follow [on|off|all|move]");
            }
        }
    }
});

on("change:graphic", function(obj, prev) {
    if (!cameraFollowEnabled || !followMoveEnabled) return;
    if (!currentTokenId || (currentTokenId !== obj.id)) return;

    moveCam(obj);
});

on("change:campaign:turnorder", function() {
    if (!cameraFollowEnabled) return;

    const turnOrderRaw = Campaign().get("turnorder");
    if (!turnOrderRaw) return;

    const turnOrder = JSON.parse(turnOrderRaw);
    if (!Array.isArray(turnOrder) || turnOrder.length === 0) return;

    const currentTurn = turnOrder[0];
    const token = getObj("graphic", currentTurn.id);
    if (!token || token.get("isdrawing")) return;

    currentTokenId = currentTurn.id;

    moveCam(token);
});

function getCameraPlayer() {
    if (cachedCameraPlayer) return cachedCameraPlayer;

    const cameraPlayer = findObjs({
		_type: "player",
		_displayname: CAMERA_MAN_NAME
    })[0];

    if (!cameraPlayer) {
		log("Camera man player not found. Check CAMERA_MAN_NAME.");
	}

    cachedCameraPlayer = cameraPlayer;
    return cameraPlayer;
}

function moveCam(token) {
    const cameraPlayer = getCameraPlayer();
    if (!cameraPlayer) return;

    const x = token.get("left");
    const y = token.get("top");
    const pageId = token.get("pageid");

    if (!moveAll) {
		sendPing(x, y, pageId, cameraPlayer.id, true, cameraPlayer.id);
    } else {
		sendPing(x, y, pageId, cameraPlayer.id, true);
    } 
}
