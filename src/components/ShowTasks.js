import React, { useState, useMemo, useCallback } from 'react';

import '../styles.css';
import { List, ListItem, IconButton, ListItemText, Stack, Button, Container, Box } from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddTask from './AddTask';
import ShowTask from './ShowTask';
import {
    Collections,
    getDocReference,
    getColReference,
    getFirestoreDocument,
    updateFirestoreDocument,
    addFirestoreDocument,
} from '../utils/firestore';
import { arrayUnion } from 'firebase/firestore';
import { Refferal } from '../models/Refferal';
import { Month, Shift } from '../utils/DateTime';
import { ToastContainer, toast } from 'react-toastify';

export default function ShowTasks(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const userId = props.userId;
    const [userData, setUserData] = useState(props.userData);
    const initialValue = { description: '', date: 1, month: Month.Jan, shift: Shift.Morning };

    const addTaskHandler = () => {
        setIsModalOpen(true);
    };

    const updateRefferal = userData => {
        if (!(userData.tasks.length || userData.isActivated)) {
            const referralColRef = getColReference(Collections.Refferals.name, Collections.Refferals.convertor);
            const newRefferalData = new Refferal(userId, false);
            addFirestoreDocument(referralColRef, newRefferalData);
        }
    };

    const updateUserData = async () => {
        setIsLoading(true);
        const updateUserData = await getFirestoreDocument(
            getDocReference(Collections.Users.name, userId, Collections.Users.convertor)
        );
        setUserData(updateUserData);
        setIsLoading(false);
    };

    const closeAddTaskHandler = async taskId => {
        if (taskId != '') {
            const userDocRef = getDocReference(Collections.Users.name, userId, null);
            updateFirestoreDocument(userDocRef, { tasks: arrayUnion(taskId) });
            updateRefferal(userData);
            await updateUserData();
        }
        setIsModalOpen(false);
    };

    const renderTask = useCallback(() => {
        return isLoading ? (
            <div>Loading...</div>
        ) : (
            userData.tasks.map((value, index) => (
                <ShowTask index={index} taskId={value} userId={userId} updateUserData={updateUserData} />
            ))
        );
    }, [userData.tasks, isLoading]);

    return (
        <Container maxWidth="lg">
            <Box display="flex" justifyContent="flex-end" mt={4}>
                {userData.fullName}
            </Box>
            <Box sx={{ width: 300, padding: 2, fontFamily: 'inherit' }}>
                <Button
                    class="botton-style"
                    variant="contained"
                    color="primary"
                    startIcon={<PlaylistAddIcon />}
                    onClick={addTaskHandler}>
                    Add Task
                </Button>
            </Box>
            <Box sx={{ padding: 2 }}>
                <List sx={{ width: '100%', maxWidth: 500 }}>{renderTask()}</List>
            </Box>
            <AddTask
                id={null}
                modalOnClose={closeAddTaskHandler}
                isModalOpen={isModalOpen}
                initialValue={initialValue}
                isUpdate={false}
            />
        </Container>
    );
}
