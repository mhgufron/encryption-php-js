async function testCrypto(action) {
    const text = document.getElementById('text-php').value;
    const password = document.getElementById('password-php').value;
    const resultElement = document.getElementById('result-php');

    try {
        const response = await fetch(`/api.php?action=${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                password
            })
        });

        const data = await response.json();
        if (data.success) {
            resultElement.value = data.result;
        } else {
            resultElement.value = 'Error: ' + data.error;
        }
    } catch (error) {
        resultElement.value = 'Error: ' + error.message;
    }
}

