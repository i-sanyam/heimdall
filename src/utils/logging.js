const LOGGING_ENABLED = true;

const error = (preMessage, err) => {
    if (!LOGGING_ENABLED) {
        return;
    }
    console.error(preMessage, "\n", err);
}

const log = (preMessage, log) => {
    if (!LOGGING_ENABLED) {
        return;
    }
    console.log(preMessage, log);
}

module.exports = { error, log };