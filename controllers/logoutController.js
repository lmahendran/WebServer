// Modules
const path = require('path');
const fsPromises = require('fs').promises;

const usersDB = {
    users: require(path.join('..','model','users.json')),
    setUsers: function (data) { this.users = data}
}

const handleLogout = async (req,res) => {

    // On client also delete access token

    const cookies = req.cookies;

    // Ensure cookie exists and is valid
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    const refreshToken = cookies.jwt;

    // Check if refresh token in DB
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: 'True' });
        return res.sendStatus(204); // No content
    }
    
    // Erase refresh token from DB
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(usersDB.users)
    );
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: 'True' }); // Can add secure: true to only serve on https
    res.sendStatus(204); // No content
}

module.exports = { handleLogout };