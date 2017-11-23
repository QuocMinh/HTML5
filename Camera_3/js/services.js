const uploadFileUrl     = 'http://10.151.120.69:6785/GDV.asmx?op=uploadFile';
const jsonHuyenUrl      = 'http://10.151.120.69:6785/GDV.asmx?op=jsonHuyen';
const jsonTinhUrl       = 'http://10.151.120.69:6785/GDV.asmx?op=jsonTinh';
const jsonXaUrl         = 'http://10.151.120.69:6785/GDV.asmx?op=jsonXa';
const jsonDoiTuongUrl   = 'http://10.151.120.69:6785/GDV.asmx?op=jsonDoiTuong';
const checkISDNUrl      = 'http://10.151.120.69:6785/GDV.asmx?op=checkISDN';

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
