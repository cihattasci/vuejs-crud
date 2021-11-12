export const getStudents = async () => {
    const response = await fetch('https://crudcrud.com/', {
        method: 'GET',
    }).then(response => {
        return response.json()
    }).catch(error => {
        return error
    })

    return response.json()
}
