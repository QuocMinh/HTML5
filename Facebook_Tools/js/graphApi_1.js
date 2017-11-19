const url = 'https://graph.facebook.com/v2.11/';
const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : "";

//==================================================================================================================
// FACEBOOK GRAPH API CALL
//==================================================================================================================
var postId = '';

getCmtPost = (postid) => {
    postId = postid;

    if(localStorage.getItem(postId)) {        
        var strCmnts = localStorage.getItem(postId);
        var cmnts = JSON.parse(strCmnts);

        setCmntsToTable(cmnts, 'tblCmts');
    } else {
        var urlExec = url
            + postId + '/comments?fields=from,message,attachment'
            + '&access_token=' + accessToken
            + '&limit=500';

        $.ajax({
            type: "GET",
            url: urlExec,
            dataType: "json",
            success: function (response) {
                var cmnts = response.data;
                setCmntsToTable(cmnts, 'tblCmts');

                // Luu comment vao local storage de lan sau su dung
                var strCmnts = JSON.stringify(cmnts);
                localStorage.setItem(postId, strCmnts);
            },
            error: (err) => console.error(err)
        });
    }
}
updateCmtPost = () => {
    localStorage.removeItem(postId);  
    document.getElementById('tblCmts').removeChild('tbody');
    getCmtPost(postId);
}

//==================================================================================================================
// UTILS
//==================================================================================================================

rmEnterChar = (str) => { return str.replace(/\\n/g, ' - '); }
setCmntsToTable = (cmnts, tableId) => {
    console.log(tableId);

    var table = document.getElementById(tableId);
    var tbody = document.createElement('tbody');
    var i = 1;
    cmnts.forEach(function (cmt) {
        var tr = document.createElement('tr');
        var _n = document.createElement('td');
        var fb = document.createElement('td');
        var cm = document.createElement('td');
        var pt = document.createElement('td');
        var at = document.createElement('td');

        _n.appendChild(document.createTextNode(i++));

        var aFb = document.createElement('a');
        aFb.href = `https://www.facebook.com/${cmt.from.id}`;
        aFb.target = '_blank';
        aFb.appendChild(document.createTextNode(cmt.from.name));
        fb.appendChild(aFb);

        cm.appendChild(document.createTextNode(cmt.message));

        if (cmt.attachment) {
            var iPt = document.createElement('img');
            iPt.src = cmt.attachment.media.image.src;
            iPt.style.height = '30px';
            iPt.style.width = '30px';
            pt.appendChild(iPt);
        }
        
        tr.appendChild(_n); tr.appendChild(fb); tr.appendChild(cm); tr.appendChild(pt); tr.appendChild(at);
        tbody.appendChild(tr);
    }, this);
    table.appendChild(tbody);
}
saveToken = () => {
    if ($('#accessToken').val() === '' || $('#accessToken').val() === null) return;
    localStorage.setItem('accessToken', $('#accessToken').val()); location.reload(); $('#accessToken').val("");
};
getIdPost = () => {}

//==================================================================================================================
// Add event listener
//==================================================================================================================

document.querySelector('#btnTKSave').addEventListener('click', saveToken);
document.querySelector('#btnRefreshPost').addEventListener('click', updateCmtPost);
document.querySelector('#btnLinkPost').addEventListener('click', getIdPost);

//==================================================================================================================
// EXECUTE FUNCTION AFTER LOAD PAGE
//==================================================================================================================

window.onload = () => {
    getCmtPost('1533328670043676');
}
