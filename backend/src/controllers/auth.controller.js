const registerUser = (req, res) => {
    res.send('register');
};

const loginUser = (req, res) => {
    res.send('login');
}

const logoutUser = (req, res) => {
    res.send('logout');
}

export { registerUser, loginUser, logoutUser };