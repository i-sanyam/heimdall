const axios = require('axios');
const common = require('../utils/constants');
const BASE_URL = 'https://api.github.com';
const USERNAME = 'pankaj-yadav-shipsy';

const actions = {
    // collaborator: {
        prerequisite: async (username) => {
            const { data } = await axios({
                method: 'GET',
                url: `${BASE_URL}/users/${username}`
            });
            if (data.status === 200 && data.login === username && data.type != 'Organization') {
                return true;
            }
            return false;
        },
        checkAccess: async (repositoryPath, username) => {
            // repositoryPath = 'owner/repo-name'
            const { data } = await axios({
                method: 'GET',
                url: `${BASE_URL}/repos/${repositoryPath}/collaborators/${username}`
            });
            if (data.status === 204) {
                return true;
            }
            return false;
        },
        addAccess: async (repositoryPath, username) => {
            const { data } = await axios({
                method: 'PUT',
                url: `${BASE_URL}/repos/${repositoryPath}/collaborators/${username}`,
                headers: {
                    "Authorization": common.GITHUB_AUTH
                }
            });
            console.log(data);
        },
        removeAccess: async (repositoryPath, username) => {
            const { data } = await axios({
                method: 'DELETE',
                url: `${BASE_URL}/repos/${repositoryPath}/collaborators/${username}`,
                headers: {
                    "Authorization": common.GITHUB_AUTH
                }
            });
        }
    // }
};

module.exports = { actions } ;