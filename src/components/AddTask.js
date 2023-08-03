import React, { useState } from 'react';
import '../styles.css';
import {
    Collections,
    getDocReference,
    getColReference,
    addFirestoreDocument,
    updateFirestoreDocument,
} from '../utils/firestore';
import {
    Button,
    TextField,
    Box,
    List,
    Dialog,
    DialogTitle,
    ListItem,
    ListItemText,
    Stack,
    Select,
    MenuItem,
} from '@mui/material';
import { Task } from '../models/Task';
import { Month, Shift } from '../utils/DateTime';
import { ToastContainer, toast } from 'react-toastify';

export default function AddTask(props) {
    const { id, modalOnClose, isModalOpen, initialValue, isUpdate } = props;
    const [description, setDescription] = useState(initialValue.description);
    const [date, setDate] = useState(initialValue.date);
    const [month, setMonth] = useState(initialValue.month);
    const [shift, setShift] = useState(initialValue.shift);

    const onCloseHandler = (event, reason) => {
        if (reason && reason != 'backdropClick') {
            modalOnClose('');
        }
    };

    const onConfirmHandler = async event => {
        if (description == '') {
            // change to notify user
            toast.error('description is empty', {
                position: toast.POSITION.BOTTOM_LEFT,
            });
            console.log('invalid description');
        } else if (date == '' || date < 1 || date > month.day) {
            // change to notify user
            toast.error('invalid date', {
                position: toast.POSITION.BOTTOM_LEFT,
            });
            console.log('invalid date');
        } else {
            const monthDate = month.index + (date > 9 ? '' : '0') + date;
            const newTaskData = new Task(description, monthDate, shift);
            if (isUpdate) {
                const taskDocRef = getDocReference(Collections.Tasks.name, id, null);
                updateFirestoreDocument(taskDocRef, { description: description, date: monthDate, shift: shift });
                modalOnClose(id);
            } else {
                const taskColRef = getColReference(Collections.Tasks.name, Collections.Tasks.convertor);
                const newId = await addFirestoreDocument(taskColRef, newTaskData);
                modalOnClose(newId);
            }
        }
    };

    const monthSelectHandler = event => {
        setMonth(event.target.value);
    };

    const shiftSelectHandler = event => {
        setShift(event.target.value);
    };

    function renderShift() {
        return (
            <Box sx={{ width: 355 }}>
                <Select sx={{ width: 200 }} value={shift} onChange={shiftSelectHandler}>
                    {Object.values(Shift).map(value => (
                        <MenuItem value={value}>{value}</MenuItem>
                    ))}
                </Select>
            </Box>
        );
    }

    function renderMonth() {
        return (
            <Stack sx={{ width: 355 }} direction="row" spacing={2}>
                <Select sx={{ width: 200 }} value={month} onChange={monthSelectHandler}>
                    {Object.values(Month).map(value => (
                        <MenuItem value={value}>{value.month}</MenuItem>
                    ))}
                </Select>
                <TextField
                    sx={{ width: 100 }}
                    type="number"
                    inputProps={{ min: 1, max: month.day }}
                    onChange={event => setDate(event.target.value)}
                    value={date}
                />
            </Stack>
        );
    }

    return (
        <Dialog onClose={onCloseHandler} open={isModalOpen}>
            <DialogTitle class="task-title-style">Add New Task</DialogTitle>
            <List sx={{ mr: 2, ml: 2, padding: 1, width: '100%', maxWidth: 500, fontFamily: 'inherit' }}>
                <ListItem>
                    <ListItemText sx={{ pr: 5, fontFamily: 'inherit' }}>Description</ListItemText>
                    <TextField
                        sx={{ width: 500 }}
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                    />
                </ListItem>
            </List>
            <List sx={{ mr: 2, ml: 2, padding: 1, width: '100%', maxWidth: 500 }}>
                <ListItem>
                    <ListItemText>Date</ListItemText>
                    {renderMonth()}
                </ListItem>
            </List>
            <List sx={{ mr: 2, ml: 2, padding: 1, width: '100%', maxWidth: 500 }}>
                <ListItem>
                    <ListItemText>Shift</ListItemText>
                    {renderShift()}
                </ListItem>
            </List>
            <Stack sx={{ m: 5 }} justifyContent="flex-end" direction="row">
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
            <ToastContainer />
        </Dialog>
    );
}
