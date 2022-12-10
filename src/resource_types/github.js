const axios = require('axios');

const BaseResourceHandler = require('./base');
const { GITHUB: GITHUBCONFIG } = require('./config');
const constants = require('../utils/constants');

const BASE_URL = 'https://api.github.com';

class GithubResourceHandler extends BaseResourceHandler {
    constructor() {
        super();
    }

    static resourceInfo = constants.resourceTypesInfo.GITHUB;
    static actionMapping = this.resourceInfo.actionMapping;
    static supportedActionTypes = this.resourceInfo.supportedActions;

    static async prerequisite(username) {
        const data = await axios({
            method: 'GET',
            url: `${BASE_URL}/users/${username}`
        });
        const userData = data.data;
        
        if (data.status === 200 && userData.login === username && userData.type !== 'Organization') {
            return userData;
        } else if (userData.type === 'Organization') {
            throw new Error('Access to Organization is not allowed');
        }
        throw new Error(`Github User ${username} does not exist`);
    }

    static async checkAccess(repositoryPath, username) {
        // repositoryPath = 'owner/repo-name'
        try {
            const data = await axios({
                method: 'GET',
                url: `${BASE_URL}/repos/${repositoryPath}/collaborators/${username}/permission`,
                headers: {
                    "Authorization": `token ${GITHUBCONFIG.TOKEN}`,
                },
            });
            if (data.status !== 200) {
                return false;
            }
            const userPermissions = data?.data?.user?.permissions || {};
            const parsedUserPermissions = {
                [this.actionMapping.PULL]: false,
                [this.actionMapping.PUSH]: false,
            };
            
            for (const action in userPermissions) {
                if (!this.supportedActionTypes.includes(action)) {
                    continue;
                }
                const actionValue = userPermissions[action];
                parsedUserPermissions[action] = actionValue;
            }

            return parsedUserPermissions;
        } catch(e) {
            if (e.response && e.response.status === 404) {
                return false;
            }
            throw e;
        };
    }

    static async addAccess(repositoryPath, username) {
        const data = await axios({
            method: 'PUT',
            url: `${BASE_URL}/repos/${repositoryPath}/collaborators/${username}`,
            headers: {
                "Authorization": `token ${GITHUBCONFIG.TOKEN}`,
            }
        });
        if (data.status === 201 || data.status === 204) {
            return true;
        }
        throw new Error('Unable to add collaborator');
    }

    static async removeAccess(repositoryPath, username) {
        try {
            const data = await axios({
                method: 'DELETE',
                url: `${BASE_URL}/repos/${repositoryPath}/collaborators/${username}`,
                headers: {
                    "Authorization": `token ${GITHUBCONFIG.TOKEN}`,
                }
            });
            if (data.status === 204) {
                return true;
            }
            throw new Error('Unable to remove collaborator');
        } catch (e) {
            throw e;
        }
    }
};

module.exports = GithubResourceHandler;