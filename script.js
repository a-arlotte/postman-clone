import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');


const keyValueTemplate = document.querySelector('[data-key-value-template]');

document.querySelector('[data-add-query-params-btn]').addEventListener('click', () => {
    queryParamsContainer.append(createKeyValuePair());
});



queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());



function createKeyValuePair() {
    const elem = keyValueTemplate.content.cloneNode(true);
    elem.querySelector("[data-remove-btn]").addEventListener('click', (e) => {
        e.target.closest('[data-key-value-pair]').remove();
    });
    return elem;

}