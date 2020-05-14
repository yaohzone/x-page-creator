import VStorage from './vStorage'

let [vLocalStorage, vSessionStorage] = [new VStorage(window.localStorage), new VStorage(window.sessionStorage)];

export const session = vSessionStorage;

export const localStore = vLocalStorage;

export default function(Vue, opts = {}) {
    let [namels, namess] = [opts.localStorage.name || 'localStorage', opts.sessionStorage.name || 'sessionStorage'];

    Object.defineProperties(Vue.prototype, {
        [`$${namels}`]: {
            get() {
                return vLocalStorage
            }
        },
        [`$${namess}`]: {
            get() {
                return vSessionStorage
            }
        }
    });
}
