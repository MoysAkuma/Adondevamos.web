import { useState } from 'react';
import {
  Button,
  Typography,
  ButtonGroup,
  Alert,
  AlertTitle
} from '@mui/material';
import { AccountCircle, Delete, WatchLater } from '@mui/icons-material';
import MemberSearch from './MemberSearch';
import MemberList from './MemberList';

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
          <MemberList 
            memberlist={memberlist} 
            callBackDelete={onRemoveMember} 
          />
        </>
      )}
    </>
  );
}

export default ManageMemberList;
