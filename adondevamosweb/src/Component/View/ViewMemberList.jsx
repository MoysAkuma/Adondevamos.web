import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
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
import UserAvatar from '../Commons/UserAvatar';

// Styled components for 8-bit retro design
const StyledList = styled(List)(({ theme }) => ({
    width: '100%',
    backgroundColor: '#E0AC69',
    borderRadius: 0,
    border: '4px solid #2C2C2C',
    boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderBottom: '2px solid #2C2C2C',
    padding: theme.spacing(2),
    transition: 'background-color 0.2s ease',
    '&:hover': {
        backgroundColor: '#D4A05E',
    },
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    border: '2px solid #2C2C2C',
    padding: '6px',
    margin: '0 4px',
    color: '#2C2C2C',
    '&:hover': {
        backgroundColor: '#F77F00',
        color: '#FFFFFF',
        transform: 'translateY(-2px)',
        boxShadow: '3px 3px 0px #2C2C2C',
    },
    '&:disabled': {
        backgroundColor: '#CCCCCC',
        borderColor: '#999999',
        color: '#666666',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    border: '3px solid #2C2C2C',
    backgroundColor: '#52B788',
    color: '#FFFFFF',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: '0.6rem',
    padding: theme.spacing(1.5, 3),
    boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
    '&:hover': {
        backgroundColor: '#3D5A80',
        transform: 'translate(-2px, -2px)',
        boxShadow: '6px 6px 0px rgba(0,0,0,0.4)',
    },
}));

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
    const navigate = useNavigate();
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

    const goToViewProfile = (userId) => {
        if (!userId) return;
        navigate('/View/User/' + userId);
    };
    
    return (<>

        <StyledList>
        {
            displayedItems.map( (member,index) => {
                const actualIndex = showAll ? (page - 1) * itemsPerPage + index : index;
                return ( 
                <StyledListItem
                    key={member.user.id}
                    secondaryAction={
                        <>
                            <Tooltip title="Send Message" arrow>
                              <span>
                                <StyledIconButton disabled aria-label="chat" edge="end">
                                  <Chat />
                                </StyledIconButton>
                              </span>
                            </Tooltip>
                            {
                                actualIndex !== 0 && 
                                ( <StyledIconButton aria-label="move up" edge="end">
                                    <ArrowCircleUp />
                                </StyledIconButton>)
                            }

                            {
                                (actualIndex !== (memberlist.length - 1)) && 
                                ( <StyledIconButton aria-label="move down" edge="end">
                                    <ArrowCircleDown />
                                </StyledIconButton>)
                            } 
                        </>
                    }
                >
                    <ListItemAvatar>
                        <Box 
                            onClick={() => goToViewProfile(member.user.id)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <UserAvatar
                                name={member.user.name || member.user.lastname}
                                tag={member.user.tag}
                                size="medium"
                            />
                        </Box>
                    </ListItemAvatar>
                    <ListItemText 
                        primary={ 
                            <Typography 
                                sx={{ 
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '0.7rem',
                                    color: '#2C2C2C',
                                    fontWeight: 600
                                }}
                            >
                                @{member.user.tag}
                            </Typography>
                        } 
                        secondary={ 
                            <Typography 
                                component="span" 
                                variant="body2" 
                                sx={{ 
                                    color: '#4A4A4A', 
                                    display: 'inline',
                                    fontSize: '0.7rem'
                                }} 
                            >
                                {member.user.email}    
                            </Typography>
                        } 
                    />
                </StyledListItem>
                );
            })
        }
        </StyledList>
        
        {memberlist.length > 3 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
                <StyledButton
                    variant="contained"
                    startIcon={showAll ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => {
                        setShowAll(!showAll);
                        setPage(1);
                    }}
                >
                    {showAll ? 'Show Less' : `Show All (${memberlist.length})`}
                </StyledButton>
                
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