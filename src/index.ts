import { App } from './app';
import { InvoicePayload } from './declarations/invoice-payload.interface';
import { validateInvoicePayload } from './validators/invoice-payload.validator';
import { Events } from './constants';
export { Events };

let __registerInvoice: (invoicePayload: InvoicePayload) => void;

async function init({
    token,
    appName,
    wasmUrl,
    events,
    env = 'PROD',
}: {
    token: string;
    appName: string;
    wasmUrl: string;
    events: Events[];
    env?: 'STG' | 'PROD';
}) {
    const app = new App(token, appName, env, wasmUrl, events);

    __registerInvoice = (invoicePayload: InvoicePayload) => {
        validateInvoicePayload(invoicePayload);
        app.registerInvoice(invoicePayload);
    };

    await app.init();
}

export default {
    init,
    registerInvoice: (invoicePayload: InvoicePayload) => __registerInvoice(invoicePayload),
};
