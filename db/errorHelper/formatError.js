module.exports = (error) => {
    if (error.code == 23505) {
        if (error.constraint) {
            const key = error.constraint.split('_')[1];
            return `${key} already exists`;
        }
    }
    return 'database error';
};
