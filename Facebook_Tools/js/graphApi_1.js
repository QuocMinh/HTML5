const url = 'https://graph.facebook.com/v2.11/';
const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : "";

//==================================================================================================================
// GRAPH API CALL
//==================================================================================================================

getCmtPost = (postid) => {
    var urlExec = url 
        + postid + '/comments?fields=from,message,attachment'
        + '&access_token=' + accessToken
        + '&limit=500';
    // var tbody = document.querySelector('#tbodyCmts');    
    // var tbody = document.getElementById('tbodyCmts');

    $.ajax({
        type: "GET",
        url: urlExec,
        dataType: "json",
        success: function (response) {
            var cmnts = response.data;
            setCmntsToTable(cmnts, 'tblCmts');
        },
        error: (err) => console.error(err)
    });
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
saveToken = () => { localStorage.setItem('accessToken', $('#accessToken').val()); location.reload(); $('#accessToken').val("") };

//==================================================================================================================
// Add event listener
//==================================================================================================================

document.querySelector('#btnTKSave').addEventListener('click', saveToken);

//==================================================================================================================
// EXECUTE FUNCTION AFTER LOAD PAGE
//==================================================================================================================

window.onload = () => {
    getCmtPost('1533328670043676');
}
