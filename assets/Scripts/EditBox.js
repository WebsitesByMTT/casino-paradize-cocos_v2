cc.Class({
    extends: cc.Component,

    properties: {
        editBox: cc.EditBox
    },

    onLoad() {
        if (this.isMobile()) {
            this.editBox.node.on('editing-did-began', this.onEditBoxFocus, this);
            this.editBox.node.on('touchstart', this.onEditBoxFocus, this);
        }
    },

    isMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    },

    onEditBoxFocus(event) {
        // Prevent the default action (showing the virtual keyboard)
        event.preventDefault();
        // Blur the edit box to hide the virtual keyboard
        this.editBox.blur();
    }
});
