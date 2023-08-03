import React, { useState } from 'react';
import '../styles.css';
import { Box, Dialog, DialogTitle, DialogContent, LinearProgress, linearProgressClasses } from '@mui/material';

export default function Loading({ isModalOpen }) {
    return (
        <Dialog open={isModalOpen}>
            <DialogTitle class="loading-style">LOADING</DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2, width: 500 }}>
                    <LinearProgress color="inherit" />
                </Box>
            </DialogContent>
        </Dialog>
    );
}
