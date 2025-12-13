import React from "react";
import { useState, useEffect } from "react";
import { Typography, Box, TextField } from "@mui/material";

import { Button, Modal } from "@mui/material";
import { Help } from "@mui/icons-material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
export default function RecoverPassword()
{
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return(
    <>
        
            <Button 
            type="button" 
            disabled={isSubmitting}
            variant="text"
            size="small"
            endIcon={ <Help/> }
            sx={{ color:"#000"}}
            onClick={handleOpen}
            >
            Recover Password
        </Button>
        
        
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        >
        <Box sx={{ ...style, width: 400 }}>
            <Typography id="parent-modal-title" variant="h6" component="h2">
                Insert Email
            </Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
            />
            <Typography id="parent-modal-description" sx={{ mt: 2 }}>
                We will send you an email with instructions to recover your password.
            </Typography>
            <Box sx={{ 
                display:'flex', 
                justifyContent: 'flex-end',
                mt: 2
             }}>
                <Button 
                type="submit" 
                disabled={isSubmitting}
                variant="contained"
                
                sx={{ mt: 2 }}
                >
                    Send Instructions
                </Button>
            </Box>
        </Box>
        </Modal>
    </>);
}