import { useState } from 'react';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Stack
} from '@mui/material';
import {
  ExpandMore,
  HelpOutline,
  TravelExplore,
  Map,
  Security,
  Group
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CenteredTemplate from '../Component/Commons/CenteredTemplate';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: 0,
  border: '3px solid #2C2C2C',
  marginBottom: theme.spacing(2),
  boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `0 0 ${theme.spacing(2)} 0`,
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: '#3D5A80',
  borderBottom: '3px solid #2C2C2C',
  minHeight: 64,
  '&.Mui-expanded': {
    minHeight: 64,
  },
  '& .MuiAccordionSummary-content': {
    margin: '12px 0',
  },
  '& .MuiSvgIcon-root': {
    color: '#FFFFFF',
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  padding: theme.spacing(3),
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  borderRadius: 0,
  border: '2px solid #2C2C2C',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.5rem',
  height: 28,
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const faqs = [
  {
    category: 'General',
    icon: <HelpOutline />,
    color: '#E63946',
    questions: [
      {
        question: 'Is adondevamos a finished project?',
        answer: 'No, this site is a work in progress and continuously being improved.'
      },
        {
        question: 'What is AdondeVamos?',
        answer: 'AdondeVamos is a travel planning platform where you can discover places, create trips, and share your travel experiences with a community of explorers.'
      },
      {
        question: 'Is AdondeVamos free to use?',
        answer: 'Yes! AdondeVamos is completely free. You can browse places, create trips, and share your adventures without any cost.'
      },
      {
        question: 'Do I need an account to use the site?',
        answer: 'You can browse trips and places without an account, but to create your own content, vote on places, or save favorites, you\'ll need to register.'
      }
    ]
  },
  {
    category: 'Trips',
    icon: <TravelExplore />,
    color: '#52B788',
    questions: [
      {
        question: 'How do I create a trip?',
        answer: 'Click on "Trips" in the navigation bar, then click the "Create Trip" button. Fill in your trip details including name, dates, description, and add places to your itinerary.'
      },
      {
        question: 'Can I edit my trip after creating it?',
        answer: 'Yes! You can edit your trips at any time. Just go to your trip and click the edit button. You can modify dates, add or remove places, and update the description.'
      },
      {
        question: 'How do I add places to my trip itinerary?',
        answer: 'When creating or editing a trip, you can search for places and add them to your itinerary. You can also set specific dates for each place visit.'
      },
      {
        question: 'Can I share my trip with others?',
        answer: 'Absolutely! Each trip has a share button that lets you copy the link or share directly through social media. Your friends can view your trip even without an account.'
      }
    ]
  },
  {
    category: 'Places',
    icon: <Map />,
    color: '#F77F00',
    questions: [
      {
        question: 'How do I add a new place?',
        answer: 'Navigate to "Places" and click "Create Place". Fill in the details including name, location, description, facilities, and upload photos to help others discover this location.'
      },
      {
        question: 'Can I upload photos to places?',
        answer: 'Yes! When creating or editing a place, you can upload multiple photos to showcase the location. High-quality images help other travelers get a better sense of the place.'
      },
      {
        question: 'What are place facilities?',
        answer: 'Facilities are amenities or features available at a location, such as parking, WiFi, restaurants, accessibility features, etc. These help travelers know what to expect.'
      },
      {
        question: 'How does the voting system work?',
        answer: 'Registered users can vote on places they like. The most voted places appear in the "Most Voted Places" section, helping others discover popular destinations.'
      }
    ]
  },
  {
    category: 'Account & Privacy',
    icon: <Security />,
    color: '#6B5B95',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'Click "Login" in the navigation bar, then select "Sign Up". Enter your email, create a username, and set a secure password to get started.'
      }
    ]
  }
];

export default function FAQ() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <CenteredTemplate maxWidth="lg" showLogo={false}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              color: '#2C2C2C',
              textShadow: '3px 3px 0px #FFFFFF',
              mb: 2
            }}
          >
            FAQ
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: { xs: '0.6rem', sm: '0.7rem' },
              color: '#2C2C2C',
              lineHeight: 2
            }}
          >
            Frequently Asked Questions
          </Typography>
        </Box>

        {faqs.map((category, categoryIndex) => (
          <Box key={category.category} sx={{ mb: 4 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  backgroundColor: category.color,
                  color: '#FFFFFF',
                  p: 1,
                  border: '2px solid #2C2C2C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {category.icon}
              </Box>
              <CategoryChip
                label={category.category}
                sx={{
                  backgroundColor: category.color,
                  color: '#FFFFFF',
                  fontWeight: 600
                }}
              />
            </Stack>

            {category.questions.map((faq, index) => (
              <StyledAccordion
                key={`${categoryIndex}-${index}`}
                expanded={expanded === `panel${categoryIndex}-${index}`}
                onChange={handleChange(`panel${categoryIndex}-${index}`)}
              >
                <StyledAccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`panel${categoryIndex}-${index}-content`}
                  id={`panel${categoryIndex}-${index}-header`}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: { xs: '0.6rem', sm: '0.7rem' },
                      color: '#FFFFFF',
                      lineHeight: 1.8
                    }}
                  >
                    {faq.question}
                  </Typography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                  <Typography
                    sx={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: { xs: '0.5rem', sm: '0.6rem' },
                      color: '#2C2C2C',
                      lineHeight: 2
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </StyledAccordionDetails>
              </StyledAccordion>
            ))}
          </Box>
        ))}

        <Box
          sx={{
            mt: 6,
            p: 3,
            backgroundColor: '#6B5B95',
            border: '3px solid #2C2C2C',
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              color: '#FFFFFF',
              mb: 2,
              textShadow: '2px 2px 0px #2C2C2C'
            }}
          >
            Still have questions?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: { xs: '0.5rem', sm: '0.6rem' },
              color: '#E8F4FD',
              lineHeight: 2
            }}
          >
            Contact me at <a href="mailto:moises.moran.dev@gmail.com">moises.moran.dev@gmail.com</a>
          </Typography>
        </Box>
    </CenteredTemplate>
  );
}
