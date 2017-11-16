// Camera Quality
var defRes      = { video: true };
var customRes   = { video: { mandatory: { minWidth: 1024, minHeight: 576 } } };

var snpShotCMND1 = false;
var snpShotCMND2 = false;
var snpShotAvatr = false;

window.onload = () => {
    startCam('sel_cmnd_1');
    startCam('sel_cmnd_2');
    startCam('sel_avatar');
}

function setSelectOptions(select_id) {
    // Get user's selected camera
    var selected = localStorage.getItem(select_id);

    navigator.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device) => {
            if (device.kind === 'videoinput') {
                var option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || 'camera ' + (i + 1);
                if (device.deviceId === selected) option.selected = "selected";

                document.querySelector('#' + select_id).appendChild(option);
            }
        });
    });
}


function startCam(select_id) {
    // Get user's selected camera
    var selected = localStorage.getItem(select_id);

    if(window.stream) {
        window.stream.getTracks().forEach((track) => track.stop());
    }

    var video       = document.querySelector('#' + select_id.replace('sel', 'camera'))
    var videoSource = selected ? selected : document.querySelector('#' + select_id).value;
    var constraints = { video: { deviceId: videoSource ? { exact: videoSource } : undefined} };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {

            if ("srcObject" in video) video.srcObject = stream;
            else 
                video.src = window.URL.createObjectURL(stream);

            video.onloadedmetadata = function (e) {
                video.play();
            };
            
        }).catch((err) => { console.error("startCam", err) });
}

function videoError(e) {
    console.log(e);
}

function takeSnapshot() {
    var camera  = document.querySelector('#' + this.id.replace('btn', 'camera')),
        canvas  = document.querySelector('#' + this.id.replace('btn', 'can')),
        ctx     = canvas.getContext('2d'),
        w       = camera.videoWidth,
        h       = camera.videoHeight;

    console.log("Camera", camera);
    console.log("canvas", canvas);
    console.log("Width", w);
    console.log("Height", h);

    canvas.width  = w;
    canvas.height = h;

    ctx.drawImage(camera, 0, 0, w, h);

    camera.style.display = "none";
    canvas.style.display = "";

    this.setAttribute('disabled', 'disabled');
    document.querySelector("#" + this.id + "_resnap").removeAttribute('disabled');
}

function reSnapShot() {
    console.log(this.id);

    var camera = document.querySelector('#' + this.id.replace('btn', 'camera').replace('_resnap', '')),
        canvas = document.querySelector('#' + this.id.replace('btn', 'can').replace('_resnap', ''));

    camera.style.display = "";
    canvas.style.display = "none";

    this.setAttribute('disabled', 'disabled');
    document.querySelector("#" + this.id.replace('_resnap', '')).removeAttribute('disabled');
}

function updateSelectedVal() {
    localStorage.setItem(this.id, this.value);

    startCam(this.id);
}

// Execute function
setSelectOptions("sel_cmnd_1");
setSelectOptions("sel_cmnd_2");
setSelectOptions("sel_avatar");

// Trigger photo take
document.getElementById("btn_cmnd_1").addEventListener("click", takeSnapshot);
document.getElementById("btn_cmnd_2").addEventListener("click", takeSnapshot);
document.getElementById("btn_avatar").addEventListener("click", takeSnapshot);
document.getElementById("sel_cmnd_1").addEventListener("change", updateSelectedVal);
document.getElementById("sel_cmnd_2").addEventListener("change", updateSelectedVal);
document.getElementById("sel_avatar").addEventListener("change", updateSelectedVal);
document.getElementById("btn_cmnd_1_resnap").addEventListener("click", reSnapShot);
document.getElementById("btn_cmnd_2_resnap").addEventListener("click", reSnapShot);
document.getElementById("btn_avatar_resnap").addEventListener("click", reSnapShot);

