const uploadFileUrl     = 'http://10.151.120.69:6785/GDV.asmx?op=uploadFile';
const jsonHuyenUrl      = 'http://10.151.120.69:6785/GDV.asmx?op=jsonHuyen';
const jsonTinhUrl       = 'http://10.151.120.69:6785/GDV.asmx?op=jsonTinh';
const jsonXaUrl         = 'http://10.151.120.69:6785/GDV.asmx?op=jsonXa';
const jsonDoiTuongUrl   = 'http://10.151.120.69:6785/GDV.asmx?op=jsonDoiTuong';
const checkISDNUrl      = 'http://10.151.120.69:6785/GDV.asmx?op=checkISDN';
const dauNoiGDVUrl      = 'http://10.151.120.69:6785/GDV.asmx?op=dauNoiGDV';

function uploadFileData(username, folder, fileName, base64Data) {
    return `<?xml version="1.0" encoding="utf-8"?>
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
            </soap:Envelope>`;
}
function jsonHuyenData(maTinh) {
    return `<?xml version="1.0" encoding="utf-8"?>
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
            </soap:Envelope>`;
}
function jsonTinhData() {
    return `<?xml version="1.0" encoding="utf-8"?>
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
            </soap:Envelope>`;
}
function jsonXaData(maTinh, maHuyen) {
    return `<?xml version="1.0" encoding="utf-8"?>
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
            </soap:Envelope>`;
}
function checkISDNData(username, isdn, serial) {
    return `<?xml version="1.0" encoding="utf-8"?>
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
            </soap:Envelope>`;
}
function jsonDoiTuongData(username) {
    return `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <jsonDoiTuong xmlns="WSGDV">
                        <lat>string</lat>
                        <lng>string</lng>
                        <username>${username}</username>
                    </jsonDoiTuong>
                </soap:Body>
            </soap:Envelope>`;
}
function dauNoiGDVData(ldap, imei, phanLoai, employee, formData) {
    return `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <dauNoiGDV xmlns="WSGDV">
                    <lat>string</lat>
                    <lng>string</lng>

                    <ldap>${ldap}</ldap>
                    <imei>${imei}</imei>
                    <phanLoai>${phanLoai}</phanLoai>
                    <employee>${employee}</employee>
                    
                    <isdn>${formData.isdn}</isdn>
                    <serial>${formData.serial}</serial>
                    <hoten>${formData.hoten}</hoten>
                    <quoctich>${formData.quoctich}</quoctich>
                    <ngaysinh>${formData.ngaysinh}</ngaysinh>
                    <gioitinh>${formData.gioitinh}</gioitinh>
                    <cmnd_id>${formData.cmnd_id}</cmnd_id>
                    <cmnd_noicap>${formData.cmnd_noicap}</cmnd_noicap>
                    <cmnd_ngaycap>${formData.cmnd_ngaycap}</cmnd_ngaycap>
                    <tinh>${formData.tinh}</tinh>
                    <huyen>${formData.huyen}</huyen>
                    <xa>${formData.xa}</xa>
                    <toap>${formData.toap}</toap>
                    <duong>${formData.duong}</duong>
                    <sonha>${formData.sonha}</sonha>
                    <dienthoai_lienhe>${formData.dienthoai_lienhe}</dienthoai_lienhe>
                    <email>${formData.email}</email>
                    <doituong>${formData.doituong}</doituong>
                    <file_cmnd1>${formData.file_cmnd1}</file_cmnd1>
                    <file_cmnd2>${formData.file_cmnd2}</file_cmnd2>
                    <file_hoso>${formData.file_hoso}</file_hoso>
                    <file_hinh>${formData.file_hinh}</file_hinh>
                    <file_chuky>${formData.file_chuky}</file_chuky>
                    <lydo_tacdong>${formData.lydo_tacdong}</lydo_tacdong>
                    <base64_cmnd1>${formData.base64_cmnd1}</base64_cmnd1>
                    <base64_cmnd2>${formData.base64_cmnd2}</base64_cmnd2>
                    <base64_hoso>${formData.base64_hoso}</base64_hoso>
                    <base64_hinh>${formData.base64_hinh}</base64_hinh>
                    <base64_chuky>${formData.base64_chuky}</base64_chuky>

                </dauNoiGDV>
            </soap:Body>
            </soap:Envelope>`;
}
