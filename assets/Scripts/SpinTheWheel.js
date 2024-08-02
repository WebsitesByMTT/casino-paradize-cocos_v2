cc.Class({
    extends: cc.Component,

    properties: {
        spinButton: cc.Button, // Reference to the spin button
        spinDuration: 10, // Duration of the spin in seconds
        minRounds: 10, // Minimum number of rounds to spin
        spinWheelAnim:{
            default: null,
            type: cc.Node
        },
        segments: { // Array of segments
            default: [],
            type: cc.Node,
        },
        arrowNode: cc.Node, 
        spinWheelParent:{
            default: null,
            type: cc.Node
        }
    },

    onLoad() {
        // Add a click event listener to the spin button
        this.spinButton.node.on('click', this.onSpinButtonClicked, this);
    },

    onSpinButtonClicked() {
        // Disable the button to prevent multiple spins
        this.spinButton.interactable = false;

        // Calculate a random angle for the spin
        let randomAngle = Math.random() * 360;
        
        // Calculate the total angle to rotate
        let totalAngle = 360 * this.minRounds + randomAngle;

        // Add a flag to prevent multiple executions
        this.isSpinning = true;

        // Run the spin animation using cc.tween
        this.currentTween = cc.tween(this.spinWheelAnim)
        .by(this.spinDuration, { angle: totalAngle }, { easing: 'cubicInOut' })
        .call(() => {
            if (this.isSpinning) {
                this.isSpinning = false;
                // Enable the button after the spin is complete
                this.spinButton.interactable = true;
                this.onSpinComplete(this.spinWheelAnim.angle);
            }
        })
        .start();
    },
    onSpinComplete(finalAngle) {
        // Normalize the final angle to be between 0 and 360
        finalAngle = finalAngle % 360;
        if (finalAngle < 0) {
            finalAngle += 360;
        }
        // Calculate the angle where the arrow node points
        let arrowWorldPos = this.arrowNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let wheelWorldPos = this.spinWheelAnim.convertToWorldSpaceAR(cc.v2(0, 0));
        let arrowAngle = Math.atan2(arrowWorldPos.y - wheelWorldPos.y, arrowWorldPos.x - wheelWorldPos.x) * 180 / Math.PI;

        // Adjust the arrow angle to be between 0 and 360
        if (arrowAngle < 0) {
            arrowAngle += 360;
        }

        // Calculate the angle of the wheel relative to the arrow
        let relativeAngle = (finalAngle - arrowAngle + 360) % 360;

        // Calculate the winning segment based on the relative angle
        let winningSegment = this.getSegmentByAngle(relativeAngle);

        // Handle the logic after the spin is complete
        console.log('Spin complete! Final angle:', finalAngle);
        console.log('Arrow angle:', arrowAngle);
        console.log('Relative angle:', relativeAngle);
        console.log('Winning segment:', winningSegment);

        // Add your logic to display the prize or perform any other actions
    },

    getSegmentByAngle(angle) {
        // Calculate the angle per segment
        let segmentAngle = 360 / this.segments.length;

        // Determine the index of the winning segment
        let segmentIndex = Math.floor(angle / segmentAngle);

        // Return the corresponding segment
        console.log(this.segments[segmentIndex]._name, "this.segments[segmentIndex]");
        return this.segments[segmentIndex]._name;
    },

    closeSpinNode: function () {
        console.log("spinWheelAnimspinWheelAnimspinWheelAnim", this.currentTween);
        if(this.currentTween){
            this.currentTween.stop();
            let currentAngle = this.spinWheelAnim.angle;
            this.spinWheelAnim.angle = currentAngle; // Ensure the wheel stays at its current angle
        }
        this.spinButton.interactable = true;
        // Reset the spinning state
        this.isSpinning = false;
        if (this.spinWheelParent.active) {
          this.spinWheelParent.active = false;
        }
    }
});
