async function loadUserRequests() {
    let { data: requests } = await axios.get('/api/user/request', {});
    console.log(requests);
    for (const request of requests) {
        $("#content").append(
            $(`<div class="m-2 my-5">
            <article>
                <div id="header">
                    <h2>${request.id}</h2>
                    <h5 class="text-muted">by ${request.requested_by_employee_id}</h5>
                    <p>
                        ${request.status}
                    </p>
                </div>
            </article>
        </div>`)
        );
    }
}