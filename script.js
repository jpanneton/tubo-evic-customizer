var vapeColors =
[
    "Gold",
    "Cyan",
    "Grey",
    "White",
    "Black",
    "Red",
    "Orange",
    "Blue",
    "Burgundy"
];

var woodColors =
[
    "None",
    "Sun Yellow",
    "Azo Orange",
    "Primary Cyan",
    "Permanent Red Violet",
    "Permanent Blue Violet",
    "Permanent Green",
    "Marine Blue",
    "Sap Green",
    "Oxide Black"
];

var maxImageResolution = 1048;
var vapeColorImages = new Array();
var woodColorImages = new Array();

var totalImageCount = 22;
var loadedImageCount = 0;
var readyToDraw = false;

function generateResult() {
    if (readyToDraw) {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(currentVapeImage, 0, 0, canvas.width, canvas.height);
        context.drawImage(currentWoodImage, 0, 0, canvas.width, canvas.height);
        context.drawImage(currentStemImage, 0, 0, canvas.width, canvas.height);
    }
}

function fillImageArray(imageArray) {
    for (var i = 0; i < imageArray.length; i++) {
        imageArray[i] = new Image();
    }
}

function initImage(image, path) {
    image.onload = function() {
        loadedImageCount++;
        if (loadedImageCount == totalImageCount) {
            readyToDraw = true;
            generateResult();
        }
    };
    image.src = path;
}

function loadResources() {
    woodTypeImages = new Array(2);
    stemTypeImages = new Array(2);
    vapeColorImages = new Array(9);
    woodColorImages = new Array(10);

    fillImageArray(woodTypeImages);
    fillImageArray(stemTypeImages);
    fillImageArray(vapeColorImages);
    fillImageArray(woodColorImages);

    initImage(woodTypeImages[0], 'Images/Beech.png');
    initImage(woodTypeImages[1], 'Images/Poplar.png');

    initImage(stemTypeImages[0], 'Images/Stem/Short.png');
    initImage(stemTypeImages[1], 'Images/Stem/LongCurved.png');

    initImage(vapeColorImages[0], 'Images/Vape/Gold.png');
    initImage(vapeColorImages[1], 'Images/Vape/Cyan.png');
    initImage(vapeColorImages[2], 'Images/Vape/Grey.png');
    initImage(vapeColorImages[3], 'Images/Vape/White.png');
    initImage(vapeColorImages[4], 'Images/Vape/Black.png');
    initImage(vapeColorImages[5], 'Images/Vape/Red.png');
    initImage(vapeColorImages[6], 'Images/Vape/Orange.png');
    initImage(vapeColorImages[7], 'Images/Vape/Blue.png');
    initImage(vapeColorImages[8], 'Images/Vape/Burgundy.png');

    woodColorImages[0] = woodTypeImages[0];
    initImage(woodColorImages[1], 'Images/Wood/SunYellow.png');
    initImage(woodColorImages[2], 'Images/Wood/AzoOrange.png');
    initImage(woodColorImages[3], 'Images/Wood/PrimaryCyan.png');
    initImage(woodColorImages[4], 'Images/Wood/PermanentRedViolet.png');
    initImage(woodColorImages[5], 'Images/Wood/PermanentBlueViolet.png');
    initImage(woodColorImages[6], 'Images/Wood/PermanentGreen.png');
    initImage(woodColorImages[7], 'Images/Wood/MarineBlue.png');
    initImage(woodColorImages[8], 'Images/Wood/SapGreen.png');
    initImage(woodColorImages[9], 'Images/Wood/OxideBlack.png');

    currentStemImage = stemTypeImages[0];
    currentVapeImage = vapeColorImages[0];
    currentWoodImage = woodColorImages[0];
}

function updateStem(index) {
    currentStemImage = stemTypeImages[index];
    generateResult();
}

function updateWood(index) {
    if (currentWoodImage === woodColorImages[0]) {
        currentWoodImage = woodTypeImages[index];
    }
    
    woodColorImages[0] = woodTypeImages[index];
    generateResult();
}

function resizeCanvas() {
    var canvas = document.getElementById('canvas');
    canvas.width  = Math.min(window.innerHeight / 2, maxImageResolution);
    canvas.height = Math.min(window.innerHeight / 2, maxImageResolution);
    generateResult();
}

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

function checkRange(value, min, max) {
    if (!isInt(value) || value < min || value > max) {
        value = 0;
    }
    return value;
}

$(document).ready(function() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    loadResources();

    // Initialize text value from slider position
    $('#vapeColorLabel').text(vapeColors[$('#vapeColorSlider').val()]);
    $('#woodColorLabel').text(woodColors[$('#woodColorSlider').val()]);

    // Add event handler to set text value when the sliders are dragged
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

    // Set value of controls from URL parameters (if any)
    var urlParams = new URLSearchParams(window.location.search);
    var woodType = checkRange(urlParams.get('wood'), 0, 1);
    var stemType = checkRange(urlParams.get('stem'), 0, 1);
    var vapeColor = checkRange(urlParams.get('vcolor'), 0, 8);
    var woodColor = checkRange(urlParams.get('wcolor'), 0, 9);

    $('#woodTypes').children().eq(woodType).prop('checked', true);
    $('#stemTypes').children().eq(stemType).prop('checked', true);
    $('#vapeColorSlider').val(vapeColor);
    $('#woodColorSlider').val(woodColor);

    // Trigger changes
    $('#woodTypes').change();
    $('#stemTypes').change();
    $('#vapeColorSlider').change();
    $('#woodColorSlider').change();
});

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
    var woodTypeIndex = woodTypeImages.indexOf(woodColorImages[0]);
    var stemTypeIndex = stemTypeImages.indexOf(currentStemImage);
    var vapeColorIndex = vapeColorImages.indexOf(currentVapeImage);
    var woodColorIndex = woodColorImages.indexOf(currentWoodImage);
    var baseURL = "tubo-evic-customizer.netlify.com/";
    var parameters = "?wood=" + woodTypeIndex + "&stem=" + stemTypeIndex + "&vcolor=" + vapeColorIndex + "&wcolor=" + woodColorIndex;
    copyToClipboard(baseURL + parameters);
}

function downloadResult() {
    var canvas = document.getElementById('canvas');
    var img = canvas.toDataURL('image/png');
    var tab = window.open('about:blank');
    tab.document.write('<img src="' + img + '"/>');
}