export class User {
    constructor(mobile, fullName, isActivated, tasks, referralGenerated) {
        this.mobile = mobile;
        this.fullName = fullName;
        this.isActivated = isActivated;
        this.tasks = tasks;
        this.referralGenerated = referralGenerated;
    }
}
export const userConverter = {
    toFirestore: user => {
        return {
            mobile: user.mobile,
            fullName: user.fullName,
            isActivated: user.isActivated,
            tasks: user.tasks,
            referralGenerated: user.referralGenerated,
        };
    },

    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.mobile, data.fullName, data.isActivated, data.tasks, data.referralGenerated);
    },
};
