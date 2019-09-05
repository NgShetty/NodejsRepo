function uploadClick(event) {
    alert();
    event = event || window.event;
    if (event.target.id != 'file-input') {
        document.getElementById('file-input').click();
    }
}

function call(event) {
    if (event.target.tagName == 'IMG') {
        document.getElementById('file-input').click();
    }
}

function changeEditImageonHover(control) {
    control.hidden = true;
    control.parentNode.childNodes[1].hidden = false;
}
function changeEditImageonMouseOut(control) {
    control.hidden = true;
    control.parentNode.childNodes[0].hidden = false;
}

function changeViewImageonHover(control) {
    control.hidden = true;
    control.parentNode.childNodes[4].hidden = false;
}
function changeViewImageonMouseOut(control) {
    control.hidden = true;
    control.parentNode.childNodes[3].hidden = false;
}

function changeDeleteImageonHover(control) {
    control.hidden = true;
    control.parentNode.childNodes[6].hidden = false;
}
function changeDeleteImageonMouseOut(control) {
    control.hidden = true;
    control.parentNode.childNodes[5].hidden = false;
}

function changeToolTipImageonHover(control) {
    control.hidden = true;
    control.parentNode.childNodes[1].hidden = false;
}
function changeToolTipImageonMouseOut(control) {
    control.hidden = true;
    control.parentNode.childNodes[0].hidden = false;
}

function allowFewCharacters(e, t) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else { return true; }

        if (charCode == 95 || charCode == 46 || charCode == 32 || (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
            return true;
        else
            return false;
    }

    catch (err) {
        alert(err.Description);
    }
}

function allowAlphabetsWithHyphenAndUnderscore(e, t) {
    try {

        if (window.event) {

            var charCode = window.event.keyCode;

        }

        else if (e) {

            var charCode = e.which;

        }

        else { return true; }

        if (charCode == 95  || charCode == 45 || charCode == 32 ||(charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)|| (charCode > 47 && charCode < 58))

            return true;

        else

            return false;

    }
    catch (err) {

        alert(err.Description);

    }
}

function allowAlphabets(e, t) {
    try {

        if (window.event) {

            var charCode = window.event.keyCode;

        }

        else if (e) {

            var charCode = e.which;

        }

        else { return true; }

        if (charCode == 32 || (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))

            return true;

        else

            return false;

    }

    catch (err) {

        alert(err.Description);

    }

}

function allowAlphaNumerics(e, t) {
    try {
        if (window.event) {
            var charCode = window.event.keyCode;
        }
        else if (e) {
            var charCode = e.which;
        }
        else { return true; }

        if (charCode == 32 || (charCode > 47 && charCode < 58) ||
            (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
            return true;
        else
            return false;
    }
    catch (err) {
        alert(err.Description);
    }
}

function allowOnlyNumeric(e, t) {
    try {

        if (window.event) {

            var charCode = window.event.keyCode;

        }

        else if (e) {

            var charCode = e.which;

        }

        else { return true; }

        if (charCode > 47 && charCode < 58)

            return true;

        else

            return false;

    }

    catch (err) {

        alert(err.Description);

    }

}

function updateAvailableSpace(event, control) {

    if (allowOnlyNumeric(event, control)) {
        console.log(control);
        return true;
    }
    else
        return false;
}