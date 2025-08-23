async function sendContactRequest(payload){
    await fetch('http://app.budgetmate.com/api/v1/contact', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    })
}

function setContactRequestListener(){
    document.getElementById('contactRequestSubmitButton').addEventListener('click', async (event) => {
        event.preventDefault()

        const firstname = document.getElementById('firstname')
        const lastname = document.getElementById('lastname')
        const email = document.getElementById('email')
        const message = document.getElementById('message')

        const payload = { firstname:firstname.value, lastname:lastname.value, email:email.value, message:message.value }
        await sendContactRequest(payload)

        firstname.value = ''
        lastname.value = ''
        email.value = ''
        message.value = ''
    })
}

document.addEventListener('DOMContentLoaded', () => {
    setContactRequestListener()
})