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
    } else {
        var response = await $.ajax({
            type: "POST",
            url: jsonTinhUrl,
            headers: { 'Content-Type': 'text/xml; charset=utf-8' },
            data: jsonTinhData()
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
    }
    return Promise.resolve(returnVal);
}

async function getHuyen(maTinh = 'AGI') {
    var returnVal = {};

    if (localStorage.getItem(maTinh)) {
        var strHuyen  = localStorage.getItem(maTinh);
        var jsonHuyen = JSON.parse(strHuyen);

        returnVal = {
            size: Object.keys(jsonHuyen).length,
            data: jsonHuyen
        }
    } else {
        var response = await $.ajax({
            type: "POST",
            url: jsonHuyenUrl,
            headers: { 'Content-Type': 'text/xml; charset=utf-8' },
            data: jsonHuyenData(maTinh)
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
    }
    return Promise.resolve(returnVal);
}
async function getXa(maTinh='AGI', maHuyen="TTO") {
    var maHuyen     = maHuyen === "" ? document.getElementById('huyen').value : maHuyen;
    var keyXa       = maTinh + maHuyen;
    var returnVal   = {};

    if (localStorage.getItem(keyXa)) {
        var strXa  = localStorage.getItem(keyXa);
        var jsonXa = JSON.parse(strXa);

        returnVal = {
            size: Object.keys(jsonXa).length,
            data: jsonXa
        }
    } else {
        var response = await $.ajax({
            type: "POST",
            url: jsonXaUrl,
            headers: { 'Content-Type': 'text/xml; charset=utf-8' },
            data: jsonXaData(maTinh, maHuyen)
        });
        var xmlXa   = response.getElementsByTagName("jsonXaResult"),
            jsonXa  = JSON.parse(xmlXa[0].innerHTML),
            strXa   = JSON.stringify(jsonXa);
        // Save Xa to local storage with key = maTinh + maHuyen
        localStorage.setItem(keyXa, strXa);
        // Chuan bi du lieu de tra ra
        returnVal = {
            size: Object.keys(jsonXa).length,
            data: jsonXa
        }
    }
    return Promise.resolve(returnVal);
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
                url: checkISDNUrl,
                data: checkISDNData(username, isdn, serial),
                success: function (response) {
                    var responseJson = JSON.parse(response.getElementsByTagName('checkISDNResult')[0].innerHTML);

                    mgd     = responseJson.code;
                    folder  = responseJson.folder;

                    // Set Ma giao dich
                    $('#mgd').html(`<b>${mgd}</b>`);

                    // Show giao dien chuc nang
                    $('#custInfoContainer').css('display', '');
                    $('#cameraContainer').css('display', '');

                    // Khoi chay camera
                    startAllCam();
                },
                error: (err) => { console.error(err); }
            });
        } else { alert('Số Serial chưa đúng!'); }
    } else { alert('Số điện thoại chưa đúng!'); }
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
            url: jsonDoiTuongUrl,
            data: jsonDoiTuongData(username),
            success: function (response) {
                var responseJson = JSON.parse(response.getElementsByTagName('jsonDoiTuongResult')[0].innerHTML);
                setDataToSelect('doituong', responseJson);

                // Save doi tuong to local storage
                localStorage.setItem('doituong', JSON.stringify(responseJson));
            }
        });
    }
}

function customerSubmit(evt) {
    evt.preventDefault();

    var formData = {
        isdn                : $('#isdn').val(),
        serial              : $('#serial').val(),
        doituong            : $('#doituong').val(),
        hoten               : $('#hoten').val(),
        gioitinh            : $('#gioitinh').val(),
        ngaysinh            : $('#ngaysinh').val(),
        quoctich            : $('#quoctich').val(),
        tinh                : $('#tinh').val(),
        huyen               : $('#huyen').val(),
        xa                  : $('#xa').val(),
        sonha               : $('#sonha').val(),
        duong               : $('#duong').val(),
        toap                : $('#toap').val(),
        email               : $('#email').val(),
        dienthoai_lienhe    : $('#dienthoai_lienhe').val(),
        cmnd_id             : $('#cmnd_id').val(),
        cmnd_ngaycap        : $('#cmnd_ngaycap').val(),
        cmnd_noicap         : $('#cmnd_noicap').val(),
    }

    console.log('FormData', formData);
}

// =====================================================================================================================================
// UTILS
// =====================================================================================================================================

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
            if (phone.match(/^\d{10}/)) { flag = true; }
        } else if (firstNumber == '01' && phone.length == 11) {
            if (phone.match(/^\d{11}/)) { flag = true; }
        }
    }

    return flag;
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
        case 'cmnd_noicapInput':
            await getTinh().then(val => data = prepareData(val.data)).catch(err => console.error(err));
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
// EXECUTE FUNCTION AFTER LOAD PAGE
// =====================================================================================================================================

window.onload = () => {
    // Load select
    setDoiTuong();
}