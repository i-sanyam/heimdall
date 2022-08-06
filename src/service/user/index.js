const GITHUB_OAUTH_TYPE = "GITHUB";

const validateGithubUser = async (userData) => {
    // query if the user exists
    // if does not exist create the user
    // create a jwt and return it
};

const validateUser = async (oauthType, userData) => {
    if (oauthType === 'GITHUB') {
        await validateGithubUser(userData);
    }
    throw new Error('Oauth Method not available');
};

module.exports = {
    validateUser,
};