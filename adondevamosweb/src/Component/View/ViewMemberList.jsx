import { useState, useEffect } from "react";
import axios from 'axios';

import { Typography, List, ListItem, ListItemText, 
    IconButton, ListItemAvatar, Avatar,
    Tooltip,
    Icon,
    Collapse,
    Box,
    Pagination,
    Button
 } from '@mui/material';
import { Chat, FlightTakeoff, Add, Delete, Edit, ArrowCircleUp, 
    ArrowCircleDown, AccountCircle, ExpandMore, ExpandLess } from '@mui/icons-material';
function ViewMemberList ({
    memberlist = [
    { 
        id: 0,
        user:{
            id: 0,
            tag: "user1",
            email: "",
            lastname: ""        
        }
    }
    ]
})
{
    const [showAll, setShowAll] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    
    const displayedItems = showAll 
        ? memberlist.slice((page - 1) * itemsPerPage, page * itemsPerPage)
        : memberlist.slice(0, 3);
    
    const totalPages = Math.ceil(memberlist.length / itemsPerPage);
    
    const handlePageChange = (event, value) => {
        setPage(value);
    };
    
    return (<>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {
            displayedItems.map( (member,index) => {
                const actualIndex = showAll ? (page - 1) * itemsPerPage + index : index;
                return ( 
                <ListItem
                    key={member.user.id}
                    secondaryAction={
                        <>
                            <Tooltip title="Send Message" arrow>
                              <IconButton disabled aria-label="chat" edge="end">
                            
                                </IconButton>
                            </Tooltip>
                            {
                                actualIndex != 0 && 
                                ( <IconButton aria-label="move up" edge="end">
                                    <ArrowCircleUp />
                                </IconButton>)
                            }

                            {
                                (actualIndex != (memberlist.length - 1)) && 
                                ( <IconButton aria-label="move down" edge="end">
                                    <ArrowCircleDown />
                                </IconButton>)
                            } 
                        </>
                    }
                    disablePadding
                >
                    <ListItemAvatar>
                        <Avatar>
                            <AccountCircle />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                        primary={ "@" + member.user.tag } 
                        secondary={ <> 
                            <Typography 
                                component="span" variant="body2" 
                                sx={{ color: 'text.primary', display: 'inline' }} >
                                {
                                    member.user.email
                                }    
                            </Typography> </>   } 
                    />
                </ListItem>
                );
            })
        }
        </List>
        
        {memberlist.length > 3 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={showAll ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => {
                        setShowAll(!showAll);
                        setPage(1);
                    }}
                >
                    {showAll ? 'Show Less' : `Show All (${memberlist.length})`}
                </Button>
                
                {showAll && totalPages > 1 && (
                    <Pagination 
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="small"
                    />
                )}
            </Box>
        )}
    </>);
}

export default ViewMemberList;