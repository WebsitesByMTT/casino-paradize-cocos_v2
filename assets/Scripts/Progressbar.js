cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.ProgressBar, // Drag your ProgressBar node here
        maxVolume: 1.0,              // Maximum volume level (100%)
        minVolume: 0.0,              // Minimum volume level (0%)
    },

    onLoad() {
        // Initial volume level setup
        this.currentVolume = this.progressBar.progress;

        // Enable touch events on the progress bar
        this.progressBar.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },

    onTouchMove(event) {
        // Get the touch position relative to the progress bar
        let touchPos = this.progressBar.node.convertToNodeSpaceAR(event.getLocation());
        let progressBarWidth = this.progressBar.node.width;

        // Calculate the new progress value based on touch position
        let newProgress = (touchPos.x / progressBarWidth) + 0.5; // Adding 0.5 to normalize from center

        // Clamp the value between 0 and 1
        newProgress = Math.max(0, Math.min(newProgress, 1));

        // Update the progress bar and the volume level
        this.progressBar.progress = newProgress;
        this.currentVolume = newProgress;
        
        // Optionally, update the actual volume in your audio settings here
        // if (cc.game.loginAudioID !== undefined) {
        //     cc.audioEngine.setVolume(cc.game.loginAudioID, volume);
        // }
    }
});
