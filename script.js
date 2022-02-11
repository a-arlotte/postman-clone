import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const queryParamsContainer = document.querySelector('[data-query-parmams]')
const requestHeadersContainer = document.querySelector('[data-request-headers]')


const keyValueTemplate = document.querySelector('[data-key-value-templates]')


queryParamsContainer.appendChild(createKeyValuePair());
requestHeadersContainer.appendChild(createKeyValuePair());



function createKeyValuePair() {
    const elem = keyValueTemplate.textContent.cloneNode(true);
}