import React from "react";
import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

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
            <p>test</p>
        </Box>
        </Modal>
    </>);
}