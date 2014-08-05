function touchKeyboardCallback(event) {
    event.touches.forEach(function (touch) {
        var id = touch.state.toString();
        if (id) {
            console.log("Event: ", id);
            document.getElementById(id).innerHTML = id + ": pass";
        }
        document.getElementById('x-coordinate').innerHTML = "X: " + touch.keyboardX;
        document.getElementById('y-coordinate').innerHTML = "Y: " + touch.keyboardY;
    });
}

function addListenerToTouchKB () {
    document.addEventListener("touchenabledkeyboard", touchKeyboardCallback);
}
