// A script's usage error: the message, then exit code 1.
export const fail = (message) => {
    console.error(message);
    process.exit(1);
};
