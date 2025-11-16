import { MessageFormat } from 'https://cdn.jsdelivr.net/npm/messageformat/+esm';
import { DraftFunctions } from 'https://cdn.jsdelivr.net/npm/messageformat@4.0.0-13/lib/functions/+esm';
const script = document.querySelector('script[data-t-script]');
delete script.dataset.tScript;
const root = script.closest('.view');

function transformDataset(dataset) {
    const params = {};
    for (const [key, value] of Object.entries(dataset)) {
        const match = key.match(/^t(.+)$/);
        if (match) {
            const rawKey = match[1];
            const newKey = rawKey.charAt(0).toLowerCase() + rawKey.slice(1);
            try {
                params[newKey] = JSON.parse(value)
            } catch {
                params[newKey] = value;
            }
        }
    }
    return params;
}

const locale = (() => {
    try {
        return root.querySelector('[data-t-data]').lang || 'en';
    } catch (e) {
        console.error('error getting locale', e);
        return 'en';
    }
})();

const strings = (() => {
    try {
        return JSON.parse(root.querySelector('[data-t-data]').dataset.tData);
    } catch (e) {
        console.error('error getting translations', e);
        return {};
    }
})();


export function applyPlaintext(functions = {}) {
    document.querySelectorAll('[data-t]').forEach((e) => {
        const id = e.dataset.t;
        const message = strings[id] || e.innerHTML;
        const mf = new MessageFormat(locale, message, { functions: {...DraftFunctions, ...functions} });
        e.innerText = mf.format(transformDataset(e.dataset));
    });
}
