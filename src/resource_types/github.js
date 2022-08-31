const axios = require('axios');

const BaseResourceHandler = require('./base');
const common = require('../utils/constants');

const BASE_URL = 'https://api.github.com';

class GithubResourceHandler extends BaseResourceHandler {
    async prerequisite(username) {
        const { data } = await axios({
            method: 'GET',
            url: `${BASE_URL}/users/${username}`
        });
        if (data.status === 200 && data.login === username && data.type != 'Organization') {
            return true;
        }
        return false;
    }
    async checkAccess(repositoryPath, username) {
        // repositoryPath = 'owner/repo-name'
        const { data } = await axios({
            method: 'GET',
            url: `${BASE_URL}/repos/${repositoryPath}/collaborators/${username}`
        });
        if (data.status === 204) {
            return true;
        }
        return false;
    }
    async addAccess(repositoryPath, username) {
        const { data } = await axios({
            method: 'PUT',
            url: `${BASE_URL}/repos/${repositoryPath}/collaborators/${username}`,
            headers: {
                "Authorization": common.GITHUB_AUTH
            }
        });
        console.log(data);
    }
    async removeAccess(repositoryPath, username) {
        const { data } = await axios({
            method: 'DELETE',
            url: `${BASE_URL}/repos/${repositoryPath}/collaborators/${username}`,
            headers: {
                "Authorization": common.GITHUB_AUTH
            }
        });
    }
};

module.exports = GithubResourceHandler;