import React, { useState } from 'react';

import '../styles.css';
import { Button, Dialog, DialogTitle, Stack } from '@mui/material';
import { Collections, getDocReference, deleteFirestoreDocument, updateFirestoreDocument } from '../utils/firestore';
import { arrayRemove } from 'firebase/firestore';

export default function DeleteTask(props) {
    const { taskId, userId, modalOnClose, isModalOpen } = props;

    const onConfirmHandler = () => {
        const taskDocRef = getDocReference(Collections.Tasks.name, taskId, Collections.Tasks.convertor);
        deleteFirestoreDocument(taskDocRef);
        const userDocRef = getDocReference(Collections.Users.name, userId, null);
        updateFirestoreDocument(userDocRef, { tasks: arrayRemove(taskId) });
        modalOnClose();
    };

    const onCloseHandler = (event, reason) => {
        if (reason && reason != 'backdropClick') {
            modalOnClose();
        }
    };

    return (
        <Dialog onClose={onCloseHandler} open={isModalOpen}>
            <DialogTitle sx={{ m: 3 }}>Delete this task ?</DialogTitle>
            <Stack sx={{ m: 10 }} justifyContent="flex-end" direction="row">
                <Button class="button-style" variant="contained" onClick={onConfirmHandler}>
                    Confirm
                </Button>
                <Button
                    class="button-style button-style-error"
                    variant="contained"
                    onClick={event => onCloseHandler(event, 'cancelClick')}>
                    Cancel
                </Button>
            </Stack>
        </Dialog>
    );
}
