var vapeColors =
{
    "1": "Gold",
    "2": "Cyan",
    "3": "Grey",
    "4": "White",
    "5": "Black",
    "6": "Red",
    "7": "Orange",
    "8": "Blue",
    "9": "Burgundy"
};

var woodColors =
{
    "1": "None",
    "2": "Sun Yellow",
    "3": "Azo Orange",
    "4": "Permanent Cyan",
    "5": "Permanent Violet Blue",
    "6": "Permanent Green",
    "7": "Marine Blue",
    "8": "Sap Green",
    "9": "Oxide Black"
};

var maxImageResolution = 2048;
var vapeColorImages = new Array();
var woodColorImages = new Array();

function loadResources() {
    vapeColorImages[1] = new Image(); vapeColorImages[1].src = 'Images/Vape/Gold.png';
    vapeColorImages[2] = new Image(); vapeColorImages[2].src = 'Images/Vape/Cyan.png';
    vapeColorImages[3] = new Image(); vapeColorImages[3].src = 'Images/Vape/Grey.png';
    vapeColorImages[4] = new Image(); vapeColorImages[4].src = 'Images/Vape/White.png';
    vapeColorImages[5] = new Image(); vapeColorImages[5].src = 'Images/Vape/Black.png';
    vapeColorImages[6] = new Image(); vapeColorImages[6].src = 'Images/Vape/Red.png';
    vapeColorImages[7] = new Image(); vapeColorImages[7].src = 'Images/Vape/Orange.png';
    vapeColorImages[8] = new Image(); vapeColorImages[8].src = 'Images/Vape/Blue.png';
    vapeColorImages[9] = new Image(); vapeColorImages[9].src = 'Images/Vape/Burgundy.png';

    woodBeech = new Image(); woodBeech.src = 'Images/Beech.png';
    woodPoplar = new Image(); woodPoplar.src = 'Images/Poplar.png';

    woodColorImages[1] = woodBeech;
    woodColorImages[2] = new Image(); woodColorImages[2].src = 'Images/Wood/SunYellow.png';
    woodColorImages[3] = new Image(); woodColorImages[3].src = 'Images/Wood/AzoOrange.png';
    woodColorImages[4] = new Image(); woodColorImages[4].src = 'Images/Wood/PermanentCyan.png';
    woodColorImages[5] = new Image(); woodColorImages[5].src = 'Images/Wood/PermanentVioletBlue.png';
    woodColorImages[6] = new Image(); woodColorImages[6].src = 'Images/Wood/PermanentGreen.png';
    woodColorImages[7] = new Image(); woodColorImages[7].src = 'Images/Wood/MarineBlue.png';
    woodColorImages[8] = new Image(); woodColorImages[8].src = 'Images/Wood/SapGreen.png';
    woodColorImages[9] = new Image(); woodColorImages[9].src = 'Images/Wood/OxideBlack.png';

    stemShort = new Image(); stemShort.src = 'Images/Stem/Short.png';
    stemLongCurved = new Image(); stemLongCurved.src = 'Images/Stem/LongCurved.png';
    buttons = new Image(); buttons.src = 'Images/Buttons.png';
    interior = new Image(); interior.src = 'Images/Interior.png';

    currentStemImage = stemShort;
    currentVapeImage = vapeColorImages[1];
    currentWoodImage = woodColorImages[1];
}

function copyToClipboard(text) {
    var input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input)
    return result;
 }

function generateURL() {
    var woodTypeIndex = (woodColorImages[1] == woodBeech) ? 1 : 2;
    var stemTypeIndex = (currentStemImage == stemShort) ? 1 : 2;
    var vapeColorIndex = vapeColorImages.indexOf(currentVapeImage);
    var woodColorIndex = woodColorImages.indexOf(currentWoodImage);
    var baseURL = "file:///E:/Documents/Websites/Tubo%20Evic/index.html";
    var parameters = "?wood=" + woodTypeIndex + "&stem=" + stemTypeIndex + "&vcolor=" + vapeColorIndex + "&wcolor=" + woodColorIndex;
    copyToClipboard(baseURL + parameters);
}

function generateResult() {
    var canvas = document.getElementById('result');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(interior, 0, 0, canvas.width, canvas.height);
    context.drawImage(currentWoodImage, 0, 0, canvas.width, canvas.height);
    context.drawImage(currentVapeImage, 0, 0, canvas.width, canvas.height);
    context.drawImage(currentStemImage, 0, 0, canvas.width, canvas.height);
    context.drawImage(buttons, 0, 0, canvas.width, canvas.height);
}

function updateStem(stemType) {
    currentStemImage = eval(stemType);
    generateResult();
}

function updateWood(woodType) {
    if (currentWoodImage === woodColorImages[1]) {
        woodColorImages[1] = eval(woodType);
        currentWoodImage = woodColorImages[1];
    } else {
        woodColorImages[1] = eval(woodType);
    }

    generateResult();
}

function resizeCanvas() {
    var canvas = document.getElementById('result');
    canvas.width  = Math.min(window.innerHeight / 2, maxImageResolution);
    canvas.height = Math.min(window.innerHeight / 2, maxImageResolution);
    generateResult();
}

function init(woodType, stemType, vapeColor, woodColor) {
    $('#woodTypes').children().eq(woodType - 1).prop("checked", true);
    $('#stemTypes').children().eq(stemType - 1).prop("checked", true);
    $('#vapeColorSlider').val(vapeColor);
    $('#woodColorSlider').val(woodColor);

    $('#woodTypes').trigger('change');
    $('#stemTypes').trigger('change');
    $("#vapeColorSlider").trigger('change');
    $("#woodColorSlider").trigger('change');
}

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

$(document).ready(function() {
    var canvas = document.getElementById('result');
    canvas.width  = Math.min(window.innerHeight / 2, maxImageResolution);
    canvas.height = Math.min(window.innerHeight / 2, maxImageResolution);

    loadResources();

    // on page load, set the text of the label based the value of the range
    $('#vapeColorLabel').text(vapeColors[$('#vapeColorSlider').val()]);
    $('#woodColorLabel').text(woodColors[$('#woodColorSlider').val()]);

    // setup an event handler to set the text when the range value is dragged (see event for input) or changed (see event for change)
    $('#vapeColorSlider').on('input change', function () {
        $('#vapeColorLabel').text(vapeColors[$(this).val()]);
        currentVapeImage = vapeColorImages[$(this).val()];
        generateResult();
    });
    $('#woodColorSlider').on('input change', function () {
        $('#woodColorLabel').text(woodColors[$(this).val()]);
        currentWoodImage = woodColorImages[$(this).val()];
        generateResult();
    });

    window.addEventListener('resize', resizeCanvas);
});

function checkRange(value, min, max) {
    if (!isInt(value) || value < min || value > max) {
        value = 1;
    }
    return value;
}

$(window).on("load", function() {
    var urlParams = new URLSearchParams(window.location.search);
    var woodType = checkRange(urlParams.get('wood'), 1, 2);
    var stemType = checkRange(urlParams.get('stem'), 1, 2);
    var vapeColor = checkRange(urlParams.get('vcolor'), 1, 9);
    var woodColor = checkRange(urlParams.get('wcolor'), 1, 9);

    init(woodType, stemType, vapeColor, woodColor);
});

function downloadResult() {
    var canvas = document.getElementById('result');
    var img = canvas.toDataURL('image/png');
    document.write('<img src="' + img + '"/>');
}