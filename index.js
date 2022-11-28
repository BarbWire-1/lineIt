/*
 *   Copyright (c) 2022 BarbWire aka Barbara Kälin
 *   All rights reserved.
 *   MIT License 
 */
window.onload = function () {

    const canvas = document.getElementById("drawingBoard");
    const toolbar = document.getElementById("toolbar");



    // CANVAS----------------------------------------------------------------------------------
    const ctx = canvas.getContext("2d");

    canvas.width = 1000;
    canvas.height = 774;

    // adjust mousePos in relation to window
    function getMousePos(canvas, e) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    let strokeStyle = '#5273f4'
    let isPainting = false;
    let lineWidth = 5;
    // let startX, startY;
    // let randomFill = `#${(Math.floor(Math.random() * 16777215)).toString(16)}`

    // TOOLBAR-----------------------------------------------------------------------------------
    // all eventListeners on toolbar
    toolbar.addEventListener("click", e => {
        if (e.target.id === "clear") {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (e.target.id === "download") {
            // add canvas rect only here for download
            // otherwise bg is div bg to be able to switch color
            
            // draws following behind existing
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = canvas.style.backgroundColor;
            console.log(canvas.style.backgroundColor)
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'download.png';
            link.click();
            link.delete;
        }
    });

    // apply chosen settings
    toolbar.addEventListener("input", e => {
        if (e.target.id === "stroke") {
            strokeStyle = e.target.value;
        };
        if (e.target.id === "lineWidth") {
            lineWidth = e.target.value;

        };
        if (e.target.id === "pageColor") {
           // DIV bg - to be able to change without losing covering drawing
            canvas.style.backgroundColor = e.target.value
        };

        // check for max-size
        if (e.target.id === "pageWidth") {
            ctx.strokeStyle = ctx.strokeStyle;
            getImage(canvas);
            getMousePos(canvas, e);
            canvas.width = e.target.value;
            replaceImage();

        };
        if (e.target.id === "pageHeight") {
            getImage(canvas);
            getMousePos(canvas, e)
            canvas.height = e.target.value;
            replaceImage();

        };
    });

    function getImage(can) {
        
        imgData = ctx.getImageData(0, 0, can.width, can.height);
        return imgData;
    };
    function replaceImage() {
        ctx.putImageData(imgData, 0, 0);
    }

    // DRAWING-----------------------------------------------------------------------------------
    const draw = e => {
        if (!isPainting) return;

        //console.log(ctx.strokeStyle)
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.lineCap = "round";
        let pos = getMousePos(canvas, e)
        ctx.lineTo(pos.x, pos.y)// y as height 100% for now
        ctx.stroke()

    }
    // start drawing
    canvas.addEventListener("mousedown", e => {

        isPainting = true;
        //console.log(isPainting)
        startX = e.clientX;
        startY = e.clientY;
    });

    // end drawing
    canvas.addEventListener("mouseup", e => {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
    });

    // draw on mousemove
    canvas.addEventListener("mousemove", draw);

}


// TODO add shapes? hmmmm....
// change to draw connected circles instead line?.