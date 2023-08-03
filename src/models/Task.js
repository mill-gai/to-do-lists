export class Task {
    constructor(description, date, shift) {
        this.description = description;
        this.date = date;
        this.shift = shift;
    }
}

export const taskConverter = {
    toFirestore: task => {
        return { description: task.description, date: task.date, shift: task.shift };
    },

    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Task(data.description, data.date, data.shift);
    },
};
