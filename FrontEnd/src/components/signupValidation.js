function Validation(values) {
    let error = {};
    const email_pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#%]{8,}$/;

    if (values.name.trim() === "") {
        error.name = "Name should not be empty";
    }

    if (values.email.trim() === "") {
        error.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        error.email = "Email didn't match";
    }

    if (values.password.trim() === "") {
        error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password didn't match";
    }

    return error;
}

export default Validation;
