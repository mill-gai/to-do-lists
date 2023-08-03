import React, { useState } from 'react';
import '../styles.css';

import { ListItem, IconButton, ListItemText, Stack, Box, CircularProgress } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTask from './AddTask';
import DeleteTask from './DeleteTask';
import { Collections, getDocReference, getFirestoreDocument } from '../utils/firestore';
import { getMonthByIndex, Shift } from '../utils/DateTime';

export default function ShowTask({ index, taskId, userId, updateUserData }) {
    const [taskData, setTaskData] = useState();
    const [initalValue, setInitalValue] = useState();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const getTaskData = () => {
        const taskDocRef = getDocReference(Collections.Tasks.name, taskId, Collections.Tasks.convertor);
        getFirestoreDocument(taskDocRef).then(result => {
            setTaskData(result);
            const month = result.date.slice(0, 2);
            const day = result.date.slice(2, 4);
            const newInitialValue = {
                description: result.description,
                date: parseInt(day),
                month: getMonthByIndex(month),
                shift: result.shift,
            };
            setInitalValue(newInitialValue);
        });
        return (
            <Box display="flex" sx={{ border: 1, m: 1, p: 1, borderRadius: '12px', borderColor: 'primary.main' }}>
                <ListItem key={index} disablePadding>
                    <ListItemText id={`checkbox-list-label-${index}`} primary={'LOADING'} />
                    <CircularProgress sx={{ p: 1 }} />
                </ListItem>
            </Box>
        );
    };

    const updateTaskHandler = () => {
        setIsUpdateModalOpen(true);
    };

    const closeUpdateTaskHandler = async () => {
        await updateUserData();
        setIsUpdateModalOpen(false);
        getTaskData();
    };

    const deleteTaskHandler = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteTaskHandler = async () => {
        await updateUserData();
        getTaskData();
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            {taskData && initalValue ? (
                // <Box display="flex" sx={{ border: 1, m: 2, p: 1, borderRadius: '12px', borderColor: 'primary.main' }}>
                <Box display="flex" class="task-style">
                    <ListItem key={index} disablePadding>
                        <ListItemText id={`checkbox-list-label-${index}`} primary={taskData.description} />
                        <Stack direction="row" spacing={2}>
                            <IconButton edge="end" aria-label="comments" onClick={updateTaskHandler}>
                                <EditNoteIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="comments" onClick={deleteTaskHandler}>
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    </ListItem>
                    <AddTask
                        id={taskId}
                        modalOnClose={closeUpdateTaskHandler}
                        isModalOpen={isUpdateModalOpen}
                        initialValue={initalValue}
                        isUpdate={true}
                    />
                    <DeleteTask
                        taskId={taskId}
                        userId={userId}
                        modalOnClose={closeDeleteTaskHandler}
                        isModalOpen={isDeleteModalOpen}
                    />
                </Box>
            ) : (
                getTaskData()
            )}
        </>
    );
}
