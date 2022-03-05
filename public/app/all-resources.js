async function loadAllResources() {
    let { data: requests } = await axios.get('/api/resource', {});
    console.log(requests);
    let idx = 1;
    for (const request of requests) {
        const requestTypeAction = request.status.action === 'put';
        $("#resource-content").append(
        `<tr>
            <th scope="row">${idx}</th>
            <td>${request.resource_type_name}</td>
            <td>${request.name}</td>
            <td><button type="button" ${ requestTypeAction ? `onClick="addRequest('${request.resource_id}')"`: ''} class="btn btn-${request.status.color}">${request.status.name}</button></td>
        </tr>`);
        idx++;
    }
}

function addRequest(resourceID) {
    axios.post('/api/user/request', { resourceID }).then(d => {
        // d = d.data;
        // console.log(d);
        window.open('/', '_self');
    }).catch(d => {
        d = d.data;
        console.log(d);
        window.alert('System Error! Try Again.');
    });
    return;
 
};