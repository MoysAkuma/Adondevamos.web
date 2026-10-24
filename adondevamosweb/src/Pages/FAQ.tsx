import { useState } from 'react';
import { useSeoMeta } from '@unhead/react';
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
import { Trans, useTranslation } from 'react-i18next';

const StyledContainer = styled(Box)(({ theme }) => ({
  maxWidth: '800px',
  margin: '0 auto',
  padding: theme.spacing(2),
}));

const StyledHeaderCard = styled(Box)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(3),
  backgroundColor: '#6B5B95',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  marginBottom: theme.spacing(2),
  boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `0 0 ${theme.spacing(2)} 0`,
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: '#3D5A80',
  borderBottom: '4px solid #2C2C2C',
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
  backgroundColor: '#E8F4FD',
  padding: theme.spacing(3),
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  borderRadius: 0,
  border: '3px solid #2C2C2C',
  fontFamily: "'Press Start 2P', cursive",
  fontSize: '0.5rem',
  height: 32,
  boxShadow: '3px 3px 0px rgba(0,0,0,0.2)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const CategorySection = styled(Box)(({ theme }) => ({
  borderRadius: 0,
  border: '4px solid #2C2C2C',
  boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
  marginBottom: theme.spacing(3),
  backgroundColor: '#F5F5F5',
  padding: theme.spacing(2),
}));

const faqs = [
  {
    category: 'faq.general',
    icon: <HelpOutline />,
    color: '#E63946',
    questions: [
      {
        question: 'faq.finishedQuestion',
        answer: 'faq.finishedAnswer'
      },
        {
        question: 'faq.aboutQuestion',
        answer: 'faq.aboutAnswer'
      },
      {
        question: 'faq.freeQuestion',
        answer: 'faq.freeAnswer'
      },
      {
        question: 'faq.accountQuestion',
        answer: 'faq.accountAnswer'
      }
    ]
  },
  {
    category: 'faq.trips',
    icon: <TravelExplore />,
    color: '#52B788',
    questions: [
      {
        question: 'faq.createTripQuestion',
        answer: 'faq.createTripAnswer'
      },
      {
        question: 'faq.editTripQuestion',
        answer: 'faq.editTripAnswer'
      },
      {
        question: 'faq.itineraryQuestion',
        answer: 'faq.itineraryAnswer'
      },
      {
        question: 'faq.shareTripQuestion',
        answer: 'faq.shareTripAnswer'
      }
    ]
  },
  {
    category: 'faq.places',
    icon: <Map />,
    color: '#F77F00',
    questions: [
      {
        question: 'faq.addPlaceQuestion',
        answer: 'faq.addPlaceAnswer'
      },
      {
        question: 'faq.photosQuestion',
        answer: 'faq.photosAnswer'
      },
      {
        question: 'faq.facilitiesQuestion',
        answer: 'faq.facilitiesAnswer'
      },
      {
        question: 'faq.votingQuestion',
        answer: 'faq.votingAnswer'
      }
    ]
  },
  {
    category: 'faq.accountPrivacy',
    icon: <Security />,
    color: '#6B5B95',
    questions: [
      {
        question: 'faq.createAccountQuestion',
        answer: 'faq.createAccountAnswer'
      }
    ]
  }
];

export default function FAQ() {
  const { t } = useTranslation();
  useSeoMeta({
    title: t('faq.pageTitle'),
    description: t('faq.pageDescription'),
    ogTitle: t('faq.pageTitle'),
  });
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <CenteredTemplate maxWidth="lg" showLogo={false}>
      <StyledContainer>
        {/* Header Section */}
        <StyledHeaderCard>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: { xs: '1.5rem', sm: '1.8rem' },
              color: '#FFFFFF',
              mb: 2,
              lineHeight: 1.4
            }}
          >
            FAQ
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: { xs: '0.5rem', sm: '0.6rem' },
              color: '#E8F4FD',
              lineHeight: 2
            }}
          >
            {t('faq.title')}
          </Typography>
        </StyledHeaderCard>

        {faqs.map((category, categoryIndex) => (
          <CategorySection key={category.category}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  backgroundColor: category.color,
                  color: '#FFFFFF',
                  p: 1.5,
                  border: '3px solid #2C2C2C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '3px 3px 0px rgba(0,0,0,0.2)',
                }}
              >
                {category.icon}
              </Box>
              <CategoryChip
                label={t(category.category)}
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
                    {t(faq.question)}
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
                    {t(faq.answer)}
                  </Typography>
                </StyledAccordionDetails>
              </StyledAccordion>
            ))}
          </CategorySection>
        ))}

        {/* Contact Section */}
        <Box
          sx={{
            p: 3,
            backgroundColor: '#52B788',
            border: '4px solid #2C2C2C',
            boxShadow: '8px 8px 0px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              color: '#FFFFFF',
              mb: 2
            }}
          >
            {t('faq.stillQuestions')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Press Start 2P', cursive",
              fontSize: { xs: '0.5rem', sm: '0.6rem' },
              color: '#FFFFFF',
              lineHeight: 2
            }}
          >
            <Trans
              i18nKey="faq.contact"
              components={[
                <a key="contact" href="mailto:moises.moran.dev@gmail.com" style={{ color: '#2C2C2C', textDecoration: 'none' }}>
                  moises.moran.dev@gmail.com
                </a>,
              ]}
            />
          </Typography>
        </Box>
      </StyledContainer>
    </CenteredTemplate>
  );
}
