async function getUserByEmail()  {
    const response = await fetch(`http://localhost:5000/api/users?email=${localStorage.email}`, {
        method: 'GET', 
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.jwt
        }), 
    });
    console.log("User data response: ", response);

    if (response.status == 200) {
        const data = await response.json();
        console.log("User data: ", data);

        return data[0];
    }

    return false;
}