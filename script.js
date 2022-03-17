import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import prettyBytes from 'pretty-bytes';
import setupEditor from './setupEditor';


const form = document.querySelector("[data-form]");

const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');


const keyValueTemplate = document.querySelector('[data-key-value-template]');


const responseHeadersContainer = document.querySelector("[data-response-headers]");

document.querySelector('[data-add-query-params-btn]').addEventListener('click', () => {
    queryParamsContainer.append(createKeyValuePair());
});




queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());


axios.interceptors.request.use(request => {
    request.customData = request.customData || {};
    request.customData.startTime = new Date().getTime();
    return request;
});

axios.interceptors.response.use(updateEndTime, e => {
    return Promise.reject(updateEndTime(e.response));
});

function updateEndTime(response) {
    response.customData = response.customData || {};
    response.customData.time = new Date().getTime() - response.config.customData.startTime;
    return response;
}


const {
    requestEditor,
    updateResponseEditor
} = setupEditor();


form.addEventListener('submit', e => {
    e.preventDefault();

    let data;
    try {
        data = JSON.parse(requestEditor.state.doc.toString() || null);
    } catch (e) {

        clearTimeout("JSON data is malformed");
        return;
    }


    axios({
        url: document.querySelector("[data-url]").value,
        method: document.querySelector("[data-method]").value,
        params: kvpToObj(queryParamsContainer),
        headers: kvpToObj(requestHeadersContainer),
        data,
    }).catch(e => e).then(response => {
        document.querySelector("[data-response-section]").classList.remove("d-none");
        updateResponseDetails(response);
        updateResponseEditor(response.data);
        updateResponseHeaders(response.headers);
        console.log(response);
    });
})




function createKeyValuePair() {
    const elem = keyValueTemplate.content.cloneNode(true);
    elem.querySelector("[data-remove-btn]").addEventListener('click', (e) => {
        e.target.closest('[data-key-value-pair]').remove();
    });
    return elem;

}

function kvpToObj(container) {
    const pairs = container.querySelectorAll("[data-key-value-pair]");
    return [...pairs].reduce((data, pair) => {
        const key = pair.querySelector("[data-key]").value;
        const value = pair.querySelector("[data-value]").value;

        if (key === '') return data;

        return {
            ...data,
            [key]: value
        }
    }, {});
}


function updateResponseHeaders(headers) {
    responseHeadersContainer.innerHtml = "";
    Object.entries(headers).forEach(([key, value]) => {
        updateContainer(key);
        updateContainer(value);
    });
}

function updateResponseDetails(response) {
    document.querySelector("[data-status]").textContent = response.status;
    document.querySelector("[data-time]").textContent = response.customData.time;
    document.querySelector("[data-size]").textContent = prettyBytes(JSON.stringify(response.data).length + JSON.stringify(response.headers).length);
}

function updateContainer(value) {
    const elem = document.createElement("div");
    elem.textContent = value;
    responseHeadersContainer.append(elem);
}