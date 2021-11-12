export const getStudents = async () => {
    await fetch('https://crudcrud.com/api/3fb24138b2594bc3a981459848e72397/students', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'GET',
      })
      .then(response => response.json())
      .then(response =>  {
        return response
      })
      .catch(err => {
          return err.json()
      })
}
