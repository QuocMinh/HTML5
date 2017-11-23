// =====================================================================================================================================
// CAMERA
// =====================================================================================================================================

function setSelectDeviceOptions(select_id) {
    // Get user's selected camera
    var selected = localStorage.getItem(select_id);

    navigator.mediaDevices.enumerateDevices().then((devices) => {
        var i = 1;
        devices.forEach((device) => {
            if (device.kind === 'videoinput') {
                var option = document.createElement('option');
                option.value = device.deviceId;
                option.text = getDeviceName(device.label, i) || 'Camera ' + i;
                i++;
                if (device.deviceId === selected) option.selected = "selected";

                document.querySelector('#' + select_id).appendChild(option);
            }
        });
    });
}

function getDeviceName(label = '', i) {
    if (label !== '') {
        var i = label.indexOf(' ');
        label = i > 0 ? label.substr(0, i) : label;

        return label;
    }

    return 'Camera ' + i;
}

function startCam(select_id) {
    // Get user's selected camera
    var selected = localStorage.getItem(select_id);

    if (window.stream) {
        window.stream.getTracks().forEach((track) => track.stop());
    }

    var video = document.querySelector('#' + select_id.replace('sel', 'camera'))
    var videoSource = selected ? selected : document.querySelector('#' + select_id).value;
    var constraints = { video: { deviceId: videoSource ? { exact: videoSource } : undefined } };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {

            if ("srcObject" in video) video.srcObject = stream;
            else
                video.src = window.URL.createObjectURL(stream);

            video.onloadedmetadata = function (e) {
                video.play();
            };

        }).catch((err) => { console.error("startCam", err); });
}

function videoError(e) { console.log(e); }

function takeSnapshot() {
    if (mgd !== undefined) {
        var camera  = document.querySelector('#' + this.id.replace('btn', 'camera')),
            canvas  = document.querySelector('#' + this.id.replace('btn', 'can')),
            ctx     = canvas.getContext('2d'),
            w = camera.videoWidth,
            h = camera.videoHeight;

        canvas.width  = w;
        canvas.height = h;

        ctx.drawImage(camera, 0, 0, w, h);

        camera.style.display = "none";
        $('#' + this.id.replace('btn_', 'div_can_')).css('display', '');

        this.style.display = "none";
        document.querySelector("#" + this.id + "_resnap").style.display = "";

        // Dat ten cho anh
        var pictureName = $('#isdn').val() + btnIdToName(this.id);

        // Save picture
        canvas.toBlob(function (blob) {
            saveAs(blob, pictureName);
        }); 

        // Upload picture
        var base64Data = canvas.toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '');
        uploadPicture(pictureName, base64Data);
    } else {
        alert("Chưa kiểm tra thuê bao!");
    }
}

btnIdToName = (btnId) => {
    var x = btnId.replace('btn_', '');
    switch (x) {
        case 'avatar': return '_khachhang';
        case 'cmnd_1': return '_mattruoc';
        case 'cmnd_2': return '_matsau';
    }
}

function reSnapShot() {
    var camera = document.querySelector('#' + this.id.replace('btn', 'camera').replace('_resnap', '')),
        canvas = document.querySelector('#' + this.id.replace('btn', 'can').replace('_resnap', ''));

    camera.style.display = "";
    $('#' + this.id.replace('btn_', 'div_can_').replace('_resnap', '')).css('display', 'none');

    this.style.display = "none";
    document.querySelector("#" + this.id.replace('_resnap', '')).style.display = "";
}

function updateCameraSelectedVal() {
    localStorage.setItem(this.id, this.value);

    startCam(this.id);
}


uploadPicture = (fileName, base64Data) => {
    console.log(folder);
    $.ajax({
        type: "POST",
        contentType: "text/xml; charset=utf-8",
        url: uploadFileUrl,
        data: uploadFileData(username, folder, fileName, base64Data),
        success: (response) => console.log(response),
        error: (err) => console.log(err)
    });
}

setSelectDeviceOptions("sel_cmnd_1");
setSelectDeviceOptions("sel_cmnd_2");
setSelectDeviceOptions("sel_avatar");
