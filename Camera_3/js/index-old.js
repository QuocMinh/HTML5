// =====================================================================================================================================
// BACKUPS FUNCTION
// =====================================================================================================================================

var hdQuality = { mandatory: { minWidth: 1280, minHeight: 720 } };

function setTinh() {
    if (localStorage.getItem('jsonTinh')) { 
        var strTinh  = localStorage.getItem('jsonTinh');
            jsonTinh = JSON.parse(strTinh);

        setDataToSelect('tinh', jsonTinh);
        setHuyen();

        return Object.keys(jsonTinh).length;
    } else {
        console.log('get');
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
                    jsonTinh    = JSON.parse(xmlTinh[0].innerHTML),
                    strTinh     = JSON.stringify(jsonTinh);

                setDataToSelect('tinh', jsonTinh);
                setHuyen();

                // Save Tinh to local storage
                // localStorage.setItem('jsonTinh', strTinh);

                return Object.keys(jsonTinh).length;
            },
            error: (err) => { console.error(err); return 0; }
        });
    }
}

searchAction = (inputId) => {
    var selectId = '#' + inputId.replace('Input', '');

    setTimeout(async() => {
        // Lay du lieu tu input
        var value = $('#' + inputId).val();
        value = value.toUpperCase();
        // Tim kiem trong local storage
        var size = 0;
        await setTinh().then(val => size = val);

        // Hien thi len select
        $(selectId).addClass('on-suggest');
        $(selectId).attr('size', size > 10 ? 10 : size);

        // var x = 'BLU';
        // if (x.match(/U/g)) console.log("OK");
        // else console.log("FAILED");

        // searchDataToSelect(value, selectId);
    }, 300);

    $(selectId).click();
}

function searchDataToSelect(value, selectId) {
    var dataKey     = 'json' + firstToUpperCase(selectId.replace('#', ''));
    var jsonData    = JSON.parse(localStorage.getItem(dataKey));
    var regex       = new RegExp(value, 'g');
    var count       = 1;

    // Reset select Tinh
    $(selectId).html('');

    $(jsonData).each(function (index, element) {
        if (element.id.match(regex)) {
            if(count === 1) {
                $(selectId).append(`<option value="${element.id}" selected>${element.name}</option>`);
            } else {
                $(selectId).append(`<option value="${element.id}">${element.name}</option>`);
            }
            count++;
        }
    });

    // Set size for select
    $(selectId).attr('size', count > 10 ? 10 : count);
}

function onSuggestChange(selectID, inputID) {
    $('#' + inputID).val($("#" + selectID + " option:selected").text());
    $("#" + selectID).removeClass('on-suggest'); // Hide select
}

function firstToUpperCase(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function onFocusOut(inputId) {
    var selectId = '#' + inputId.replace('Input', '');
    setTimeout(() => {
        $(selectId).removeClass('on-suggest'); 
        $('#' + inputId).val($(selectId + " option:selected").text()); 
    }, 300);
}

$("#tinhInput1").autocomplete({
    source: [
        { label: "India", value: "IND" },
        { label: "Australia", value: "AUS" }
    ],
    focus: function (event, ui) {
        $("#tinhInput").val(ui.item.label);
        return false;
    },
    select: function (event, ui) {
        $("#tinhInput").val(ui.item.label);
        return false;
    }
});

document.getElementById('tinh').addEventListener('change', updateHuyen);
document.getElementById('huyen').addEventListener('change', updateXa);

var x = [
    { "label": "An Giang", "value": "AGI" },
    { "label": "Bạc Liêu", "value": "BLI" },
    { "label": "Bến Tre", "value": "BTR" },
    { "label": "Cà Mau", "value": "CMA" },
    { "label": "Đồng Tháp", "value": "DTH" },
    { "label": "Hậu Giang", "value": "HGI" },
    { "label": "Kiên Giang", "value": "KGI" },
    { "label": "Sóc Trăng", "value": "STR" }, 
    { "label": "TP Cần Thơ", "value": "CTH" }, 
    { "label": "Tiền Giang", "value": "TGI" }, 
    { "label": "Trà Vinh", "value": "TVI" }, 
    { "label": "Vĩnh Long", "value": "VLO" }, 
    { "label": "Hà Nội", "value": "HNO" }, 
    { "label": "TP Hồ Chí Minh", "value": "HCM" }, 
    { "label": "Bà Rịa - Vũng Tàu", "value": "BRV" }, 
    { "label": "Bắc Cạn", "value": "BKA" }, 
]