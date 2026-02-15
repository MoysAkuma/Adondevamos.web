import { useState } from 'react';
import {
  Button,
  Typography,
  ButtonGroup,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Paper
} from '@mui/material';
import { AccountCircle, Delete, WatchLater } from '@mui/icons-material';
import MemberSearch from './MemberSearch';
import MemberList from './MemberList';
import { Box } from '@mui/system';

/**
 * Reusable component for managing trip member lists
 * @param {Array} memberlist - Current list of members
 * @param {Function} onAddMember - Callback when a member is added
 * @param {Function} onRemoveMember - Callback when a member is removed
 * @param {Function} onResetMembers - Callback to reset all members
 * @param {boolean} showDuplicateError - Whether to show duplicate user error
 */
function ManageMemberList({ 
  memberlist = [], 
  onAddMember, 
  onRemoveMember, 
  onResetMembers,
  showDuplicateError = false 
}) {
  const [showMemberSearch, setShowMemberSearch] = useState(false);

  const handleAddMemberClick = () => {
    setShowMemberSearch(true);
  };

  const handleMemberAdd = (item) => {
    if (onAddMember) {
      onAddMember(item);
      setShowMemberSearch(false);
    }
  };

  const handleResetMembers = () => {
    if (onResetMembers) {
      onResetMembers();
    }
  };
  const handleRemove = (id) => {
    if (onRemoveMember) {
      onRemoveMember(id);
    }
  };

  const generateMemberList = (members) => {
    return( 
      <Paper 
          elevation={1} 
          sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper'
          }}
      >
        <List sx={{ width: '100%', p: 0 }}>
          {members.map((member, index) => {
              return (
                        <Box key={member.user.id}>
                            <ListItem
                                sx={{
                                    py: 2,
                                    px: 2,
                                    '&:hover': {
                                        bgcolor: 'action.hover'
                                    }
                                }}
                                secondaryAction={<>
                                    <Button 
                                        variant="text" 
                                        color="error"
                                        onClick={() => handleRemove(member.user.id)}
                                    >
                                        Remove
                                    </Button>
                                </>}
                            >
                                <ListItemAvatar>
                                    <Avatar 
                                        sx={{ 
                                            bgcolor: 'primary.main',
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        <AccountCircle />
                                    </Avatar>
                                </ListItemAvatar>
                                
                                <ListItemText 
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {member.user.name}
                                            </Typography>
                                            
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {member.user.email}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            
                            {index < members.length - 1 && <Divider />}
                        </Box>
                    );
                })}
            </List>
        </Paper>);
          }


  return (
    <>
      <Typography variant="subtitle2" align="left">
        Members
      </Typography>
          
      <ButtonGroup 
        variant="contained" 
        color="primary" 
        fullWidth
      >
        <Button 
          variant="contained" 
          startIcon={<AccountCircle/>}
          onClick={handleAddMemberClick}
        >
          Add member
        </Button>
        {
          memberlist.length === 0 ? (
            <Button 
              variant="text" 
              startIcon={<WatchLater/>}
              onClick={(e) => e.preventDefault()}
            >
              Decided Later
            </Button>
          ) : (
            <Button 
              variant="text" 
              startIcon={<Delete/>}
              onClick={handleResetMembers}
            >
              Reset members
            </Button>
          )
        }
      </ButtonGroup>

      {memberlist.length === 0 && (
        <Alert severity='info'>
          Your member list is empty
        </Alert>
      )}

      {showMemberSearch && (
        <MemberSearch
          callback={handleMemberAdd}
          memberlist={memberlist}
        />
      )}

      {showDuplicateError && (
        <Alert severity="warning">
          <AlertTitle>This User was already added</AlertTitle>
          Please, select another user
        </Alert>
      )}

      {memberlist.length > 0 && (
        <>
          <Typography variant="body1" align="left">
            Member list 
          </Typography>
          {
            generateMemberList(memberlist)
          }
        </>
      )}
    </>
  );
}

export default ManageMemberList;
