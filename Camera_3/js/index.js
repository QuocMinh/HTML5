// Camera Quality
var defRes      = { video: true };
var customRes   = { video: { mandatory: { minWidth: 1024, minHeight: 576 } } };

var snpShotCMND1 = false;
var snpShotCMND2 = false;
var snpShotAvatr = false;

function setSelectOptions(select_id) {
    // Get user's selected camera
    var selected = localStorage.getItem(select_id);

    navigator.mediaDevices.enumerateDevices().then((devices) => {
        var i = 1;
        devices.forEach((device) => {
            if (device.kind === 'videoinput') {
                var option = document.createElement('option');
                option.value = device.deviceId;
                option.text = getDeviceName(device.label, i) || 'Camera ' + i++;
                if (device.deviceId === selected) option.selected = "selected";

                document.querySelector('#' + select_id).appendChild(option);
            }
        });
    });
}

function getDeviceName(label = '', i) {
    if(label !== '') {
        var i = label.indexOf(' ');
        label = i > 0 ? label.substr(0, i) : label;

        return label;
    }

    return 'Camera ' + i;
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

function videoError(e) { console.log(e); }

function takeSnapshot() {
    var camera  = document.querySelector('#' + this.id.replace('btn', 'camera')),
        canvas  = document.querySelector('#' + this.id.replace('btn', 'can')),
        ctx     = canvas.getContext('2d'),
        w       = camera.videoWidth,
        h       = camera.videoHeight;

    canvas.width  = w;
    canvas.height = h;

    ctx.drawImage(camera, 0, 0, w, h);

    camera.style.display = "none";
    canvas.style.display = "";

    this.style.display = "none";
    document.querySelector("#" + this.id + "_resnap").style.display = "";
    // this.setAttribute('disabled', 'disabled');
    // document.querySelector("#" + this.id + "_resnap").removeAttribute('disabled');
}

function reSnapShot() {
    var camera = document.querySelector('#' + this.id.replace('btn', 'camera').replace('_resnap', '')),
        canvas = document.querySelector('#' + this.id.replace('btn', 'can').replace('_resnap', ''));

    camera.style.display = "";
    canvas.style.display = "none";

    this.style.display = "none";
    document.querySelector("#" + this.id.replace('_resnap', '')).style.display = "";
}

function updateSelectedVal() {
    localStorage.setItem(this.id, this.value);

    startCam(this.id);
}

// =====================================================================================================================================
// LOAD DATA FROM WEBSERVICEs
// =====================================================================================================================================

function setTinh() {
    if (localStorage.getItem('jsonTinh')) { 
        var strTinh  = localStorage.getItem('jsonTinh');
            jsonTinh = JSON.parse(strTinh);
        
        setDataToSelect('thanhpho', jsonTinh);
        setHuyen();
    } else {
        $.ajax({
            type: "POST",
            url: "http://10.151.120.69:6785/GDV.asmx?op=jsonTinh",
            headers: { 'Content-Type': 'text/xml; charset=utf-8' },
            data:
            `<?xml version="1.0" encoding="utf-8"?>
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <jsonTinh xmlns="WSGDV">
                        <lat>string</lat>
                        <lng>string</lng>
                        <ez>string</ez>
                    </jsonTinh>
                </soap:Body>
            </soap:Envelope>`,
            success: function (response) {
                var xmlTinh     = response.getElementsByTagName("jsonTinhResult"),
                    jsonTinh    = JSON.parse(xmlTinh[0].innerHTML)
                    strTinh     = JSON.stringify(jsonTinh);

                setDataToSelect('thanhpho', jsonTinh);
                setHuyen();

                // Save Tinh to local storage
                localStorage.setItem('jsonTinh', strTinh);
            },
            error: (err) => { console.error(err); }
        });
    }
}

function setHuyen(maTinh = 'AGI') {
    if (localStorage.getItem(maTinh)) {
        var strHuyen  = localStorage.getItem(maTinh);
        var jsonHuyen = JSON.parse(strHuyen);

        setDataToSelect('quanhuyen', jsonHuyen);
        setXa(maTinh);
    } else {
        $.ajax({
            type: "POST",
            url: "http://10.151.120.69:6785/GDV.asmx?op=jsonHuyen",
            headers: { 'Content-Type': 'text/xml; charset=utf-8' },
            data:
                `<?xml version="1.0" encoding="utf-8"?>
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
                    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                        <jsonHuyen xmlns="WSGDV">
                            <lat>string</lat>
                            <lng>string</lng>
                            <ez>string</ez>
                            <matinh>${maTinh}</matinh>
                        </jsonHuyen>
                    </soap:Body>
                </soap:Envelope>`,
            success: function (response) {
                var xmlHuyen    = response.getElementsByTagName("jsonHuyenResult"),
                    jsonHuyen   = JSON.parse(xmlHuyen[0].innerHTML),
                    strHuyen    = JSON.stringify(jsonHuyen);
                
                setDataToSelect('quanhuyen', jsonHuyen);
                setXa(maTinh);

                // Save Huyen to local storage with key = matinh
                localStorage.setItem(maTinh, strHuyen);
            },
            error: (err) => { console.error(err); }
        });
    }
}

function setXa(maTinh, maHuyen = "") {
    var maHuyen = maHuyen === "" ? document.getElementById('quanhuyen').value : maHuyen;
    var keyXa = maTinh + maHuyen;

    if (localStorage.getItem(keyXa)) {
        var strXa = localStorage.getItem(keyXa);
        var jsonXa = JSON.parse(strXa);

        setDataToSelect('phuongxa', jsonXa);
    } else {
        $.ajax({
            type: "POST",
            url: "http://10.151.120.69:6785/GDV.asmx?op=jsonXa",
            headers: { 'Content-Type': 'text/xml; charset=utf-8' },
            data:
            `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <jsonXa xmlns="WSGDV">
                        <lat>string</lat>
                        <lng>string</lng>
                        <ez>string</ez>
                        <matinh>${maTinh}</matinh>
                        <mahuyen>${maHuyen}</mahuyen>
                    </jsonXa>
                </soap:Body>
            </soap:Envelope>`,
            success: function (response) {
                var xmlXa  = response.getElementsByTagName("jsonXaResult"),
                    jsonXa = JSON.parse(xmlXa[0].innerHTML),
                    strXa  = JSON.stringify(jsonXa);

                setDataToSelect('phuongxa', jsonXa);

                // Save Xa to local storage with key = maTinh + maHuyen
                localStorage.setItem(keyXa, strXa);
            },
            error: (err) => { console.error(err); }
        });
    }
}

function updateHuyen() { setHuyen(this.value) }
function updateXa() {
    var maTinh = document.getElementById('thanhpho').value;
    var maHuyen = this.value;

    setXa(maTinh, maHuyen);
}

function setDataToSelect(selectID, jsonData) {
    var select = document.querySelector('#' + selectID);
    select.innerHTML = ""; // remove all child 

    jsonData.forEach((data) => {
        var option = document.createElement('option');

        option.value = data.id;
        option.label = data.name;

        select.appendChild(option);
    });
}

// =====================================================================================================================================
// EXECUTE FUNCTION WHEN LOAD PAGE
// =====================================================================================================================================

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
document.getElementById('thanhpho').addEventListener('change', updateHuyen);
document.getElementById('quanhuyen').addEventListener('change', updateXa);

// =====================================================================================================================================
// EXECUTE FUNCTION AFTER LOAD PAGE
// =====================================================================================================================================

window.onload = () => {
    // Start camera
    startCam('sel_cmnd_1');
    startCam('sel_cmnd_2');
    startCam('sel_avatar');

    // Load select
    setTinh();
}