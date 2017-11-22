const username = 'minh.chau.ctv';
const serialLength = 3; // 16

var mgd, folder;

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
        var camera = document.querySelector('#' + this.id.replace('btn', 'camera')),
            canvas = document.querySelector('#' + this.id.replace('btn', 'can')),
            ctx = canvas.getContext('2d'),
            w = camera.videoWidth,
            h = camera.videoHeight;

        canvas.width = w;
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

// =====================================================================================================================================
// LOAD DATA FROM WEBSERVICEs
// =====================================================================================================================================

async function getTinh() {
    var returnVal = {};

    if (localStorage.getItem('jsonTinh')) {
        var strTinh  = localStorage.getItem('jsonTinh');
            jsonTinh = JSON.parse(strTinh);

        // Chuan bi du lieu de tra ra
        returnVal = {
            size: Object.keys(jsonTinh).length,
            data: jsonTinh
        }

        return Promise.resolve(returnVal);
    } else {
        var response = await $.ajax({
            type: "POST",
            url: "http://10.151.120.69:6785/GDV.asmx",
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
            </soap:Envelope>`
        });

        var xmlTinh     = response.getElementsByTagName("jsonTinhResult"),
            jsonTinh    = JSON.parse(xmlTinh[0].innerHTML),
            strTinh     = JSON.stringify(jsonTinh);

        // Save Tinh to local storage
        localStorage.setItem('jsonTinh', strTinh);

        // Chuan bi du lieu de tra ra
        returnVal = {
            size: Object.keys(jsonTinh).length,
            data: jsonTinh
        }

        return Promise.resolve(returnVal);
    }
}

async function getHuyen(maTinh = 'AGI') {
    var returnVal = {};

    if (localStorage.getItem(maTinh)) {
        var strHuyen = localStorage.getItem(maTinh);
        var jsonHuyen = JSON.parse(strHuyen);

        returnVal = {
            size: Object.keys(jsonHuyen).length,
            data: jsonHuyen
        }

        return Promise.resolve(returnVal);
    } else {
        var response = await $.ajax({
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
                </soap:Envelope>`
        });

        var xmlHuyen    = response.getElementsByTagName("jsonHuyenResult"),
            jsonHuyen   = JSON.parse(xmlHuyen[0].innerHTML),
            strHuyen    = JSON.stringify(jsonHuyen);
        // Save Huyen to local storage with key = matinh
        localStorage.setItem(maTinh, strHuyen);
        // Chuan bi du lieu de tra ra
        returnVal = {
            size: Object.keys(jsonHuyen).length,
            data: jsonHuyen
        }

        return Promise.resolve(returnVal);
    }
}
async function getXa(maTinh='AGI', maHuyen="TTO") {
    var maHuyen = maHuyen === "" ? document.getElementById('huyen').value : maHuyen;
    var keyXa = maTinh + maHuyen;
    var returnVal = {};

    if (localStorage.getItem(keyXa)) {
        var strXa = localStorage.getItem(keyXa);
        var jsonXa = JSON.parse(strXa);

        returnVal = {
            size: Object.keys(jsonXa).length,
            data: jsonXa
        }

        return Promise.resolve(returnVal);
    } else {
        var response = await $.ajax({
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
                </soap:Envelope>`
        });
        var xmlXa = response.getElementsByTagName("jsonXaResult"),
            jsonXa = JSON.parse(xmlXa[0].innerHTML),
            strXa = JSON.stringify(jsonXa);
        // Save Xa to local storage with key = maTinh + maHuyen
        localStorage.setItem(keyXa, strXa);
        // Chuan bi du lieu de tra ra
        returnVal = {
            size: Object.keys(jsonXa).length,
            data: jsonXa
        }
        return Promise.resolve(returnVal);
    }
}
ISDNSubmit = (evt) => {
    // Ngan form reload lai page
    evt.preventDefault();

    var isdn = $('#isdn').val();
    var serial = $('#serial').val();

    // Kiem tra hop le cho isdn va serial
    if (checkISDNFormat(isdn)) {
        if (checkSerialFormat(serial)) {
            // Goi WS de kiem tra ISDN
            console.info("OK!");
            $.ajax({
                type: "POST",
                contentType: "text/xml; charset=utf-8",
                url: "http://10.151.120.69:6785/GDV.asmx?op=checkISDN",
                data:
                `<?xml version="1.0" encoding="utf-8"?>
                    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                        <soap:Body>
                            <checkISDN xmlns="WSGDV">
                                <lat>string</lat>
                                <lng>string</lng>
                                <username>${username}</username>
                                <isdn>${isdn}</isdn>
                                <serial>${serial}</serial>
                            </checkISDN>
                        </soap:Body>
                    </soap:Envelope>`,
                success: function (response) {
                    var responseJson = JSON.parse(response.getElementsByTagName('checkISDNResult')[0].innerHTML);

                    mgd = responseJson.code;
                    folder = responseJson.folder;

                    // Set Ma giao dich
                    $('#mgd').html(`<b>${mgd}</b>`);

                    // Show giao dien chuc nang
                    $('#custInfoContainer').css('display', '');
                    $('#cameraContainer').css('display', '');

                    // Khoi chay camera
                    startAllCam();
                },
                error: (err) => {
                    console.error(err);
                    alert('LỖI!');
                }
            });
        } else {
            alert('Số Serial chưa đúng!');
        }
    } else {
        alert('Số điện thoại chưa đúng!');
    }
}
uploadPicture = (fileName, base64Data) => {
    $.ajax({
        type: "POST",
        contentType: "text/xml; charset=utf-8",
        url: "http://10.151.120.69:6785/GDV.asmx?op=uploadFile",
        data:
        `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <uploadFile xmlns="WSGDV">
                        <lat>string</lat>
                        <lng>string</lng>
                        <username>${username}</username>
                        <folder>${folder}</folder>
                        <filename>${fileName + '.jpg'}</filename>
                        <base64data>${base64Data}</base64data>
                    </uploadFile>
                </soap:Body>
            </soap:Envelope>`,
        success: (response) => {
            console.log(response);
        },
        error: (err) => console.log(err)
    });
}
setDoiTuong = () => {
    // doituong
    if (localStorage.doituong) {
        var doiTuongJson = JSON.parse(localStorage.doituong);
        setDataToSelect('doituong', doiTuongJson);
    } else {
        $.ajax({
            type: "POST",
            contentType: "text/xml; charset=utf-8",
            url: "http://10.151.120.69:6785/GDV.asmx?op=jsonDoiTuong",
            data:
            `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <jsonDoiTuong xmlns="WSGDV">
                        <lat>string</lat>
                        <lng>string</lng>
                        <username>${username}</username>
                    </jsonDoiTuong>
                </soap:Body>
            </soap:Envelope>`,
            success: function (response) {
                var responseJson = JSON.parse(response.getElementsByTagName('jsonDoiTuongResult')[0].innerHTML);
                setDataToSelect('doituong', responseJson);

                // Save doi tuong to local storage
                localStorage.setItem('doituong', JSON.stringify(responseJson));
            }
        });
    }
}

// =====================================================================================================================================
// UTILS
// =====================================================================================================================================

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
checkNull = (inputId) => {
    var x = $('#' + inputId).val();
    return x === '' || x == 'undefined' || x == null;
}
startAllCam = () => {
    // Start camera
    startCam('sel_cmnd_1');
    startCam('sel_cmnd_2');
    startCam('sel_avatar');
}
checkISDNFormat = (isdn) => {
    var flag = false;
    var phone = isdn.trim();
    phone = phone.replace('(+84)', '0');
    phone = phone.replace('+84', '0');
    phone = phone.replace('0084', '0');
    phone = phone.replace(/ /g, '');

    if (phone != '') {
        var firstNumber = phone.substring(0, 2);
        if ((firstNumber == '09' || firstNumber == '08') && phone.length == 10) {
            if (phone.match(/^\d{10}/)) {
                flag = true;
            }
        } else if (firstNumber == '01' && phone.length == 11) {
            if (phone.match(/^\d{11}/)) {
                flag = true;
            }
        }
    }

    return flag;
}

checkSerialFormat = (serial) => { return serial.length === serialLength; }

async function setAutoComplete(inputId) {
    var data = [];
    
    switch (inputId) {
        case 'tinhInput':
            await getTinh().then(val => data = prepareData(val.data) ).catch(err => console.error(err));
            break;
        case 'huyenInput':
            var maTinh = $('#tinh').val();
            console.log('maTinh: ', maTinh);
            await getHuyen(maTinh).then(val => data = prepareData(val.data)).catch(err => console.error(err));
            break;
        case 'xaInput':
            var maTinh = $('#tinh').val();
            var maHuyen = $('#huyen').val();
            console.log('maTinh: ', maTinh);
            console.log('maHuyen: ', maHuyen);
            await getXa(maTinh, maHuyen).then(val => data = prepareData(val.data)).catch(err => console.error(err));
            break;
    }

    $("#" + inputId).autocomplete({
        source: data,
        focus: function (event, ui) {
            $("#" + inputId).val(ui.item.value);
            return false;
        },
        select: function (event, ui) {
            $("#" + inputId).val(ui.item.value);
            // Set du lieu cho input hidden:
            $('#' + inputId.replace('Input', '')).val(ui.item.label);
            return false;
        }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        $(ul).addClass('custom-ui-item');
        return $("<li>").append("<a style='display: block'>" + item.value + "</a>").appendTo(ul);
    }
}

function prepareData(jsonData) {
    var strData = JSON.stringify(jsonData);

    strData     = strData.replace(/"id":/g, '"label":').replace(/"name":/g, '"value":');
    jsonData    = JSON.parse(strData);

    return jsonData;
}

// =====================================================================================================================================
// EXECUTE FUNCTION WHEN LOAD PAGE
// =====================================================================================================================================

setSelectDeviceOptions("sel_cmnd_1");
setSelectDeviceOptions("sel_cmnd_2");
setSelectDeviceOptions("sel_avatar");

// Trigger photo take
document.getElementById("btn_cmnd_1").addEventListener("click", takeSnapshot);
document.getElementById("btn_cmnd_2").addEventListener("click", takeSnapshot);
document.getElementById("btn_avatar").addEventListener("click", takeSnapshot);
document.getElementById("sel_cmnd_1").addEventListener("change", updateCameraSelectedVal);
document.getElementById("sel_cmnd_2").addEventListener("change", updateCameraSelectedVal);
document.getElementById("sel_avatar").addEventListener("change", updateCameraSelectedVal);
document.getElementById("btn_cmnd_1_resnap").addEventListener("click", reSnapShot);
document.getElementById("btn_cmnd_2_resnap").addEventListener("click", reSnapShot);
document.getElementById("btn_avatar_resnap").addEventListener("click", reSnapShot);

// JQUERY EVENT LISTNER
$('#isdnForm').submit((e) => ISDNSubmit(e));
$('#tinhInput').focus(() => setAutoComplete('tinhInput'));
$('#huyenInput').focus(() => setAutoComplete('huyenInput'));
$('#xaInput').focus(() => setAutoComplete('xaInput'));

// =====================================================================================================================================
// EXECUTE FUNCTION AFTER LOAD PAGE
// =====================================================================================================================================

window.onload = () => {
    // Load select
    setDoiTuong();
}