// =====================================================================================================================================
// ADD EVENT LISTENER
// =====================================================================================================================================

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