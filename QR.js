
// Adapted from this recipe: https://usetrmnl.com/recipes/14428/install

[...document.querySelectorAll('[data-qr]')].forEach(element => {
    const $ = t => element.dataset[t];
    let mode = $('mode')
    if (!mode) {
        if ($('emailAddress')) mode = 'email';
        if ($('telephone')) mode = 'tel';
        if ($('smsNumber')) mode = 'sms';
        if ($('wifiSsid')) mode = 'wifi';
        if ($('appleShortcut')) mode = 'apple-shortcut';
    }

    let text;
    switch (mode) {
        case 'email':
            text = `mailto:${$('emailAddress')}`;
            break;
        case 'tel':
            text = `tel:${$('telephone')}`;
            break;
        case 'sms':
            let sM = $('smsMessage');
            text = `sms:${$('smsNumber')}${sM ? ('?body=' + encodeURI(sM)) : ''}`
            break;
        case 'wifi':
            text = `WIFI:S:${$('wifiSsid')};`
                + `T:${$('wifiEncryption') || 'WPA'};`
                + `P:${$('wifiPassword')};`
                + ($('wifiHidden') ? 'H:true;' : '')
                + `;`
            break;
        case 'apple-shortcut':
            text = `shortcuts://run-shortcut?name=${$('appleShortcut')}`;
            break;
        // TODO: `geo`
        default:
            text = element.innerText;
            break;
    }
    element.innerText = "";

    const qrErrCorr = { L: 1, M: 0, Q: 3, H: 2 };
    // Assume the display can be scanned clearly, so needs no correction
    let correctLevel = qrErrCorr[$('correction')] || qrErrCorr.L;


    let qr;
    if (text) {
        qr = new QRCode(element, {
            text,
            correctLevel,
            colorDark: $('colorDark') || '#000000',
            colorLight: $('colorLight') || '#ffffff',
        });
    }

    const pixels_per_cell = $('scale') ? parseInt($('scale')) : 4;
    const modules = qr._oQRCode.getModuleCount();
    let size = modules * pixels_per_cell;
    element.innerText = "";
    qr = new QRCode(element, {
      text,
      correctLevel,
      width: size * 24,
      height: size * 24,
      colorDark: $('colorDark') || '#000000',
      colorLight: $('colorLight') || '#ffffff',
    });

    let img = element.querySelector('img');
    img.style.width = `${size}px`;
    img.style.imageRendering = 'pixelated';
});