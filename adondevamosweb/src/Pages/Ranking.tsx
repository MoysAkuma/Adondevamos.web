import React from 'react';
import { useParams } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { useMediaQuery, useTheme } from '@mui/material';
import { Leaderboard } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Ranking from '../Component/Ranking/Ranking';
import MultiRanking from '../Component/Ranking/MultiRanking';
import CenteredTemplate from '../Component/Commons/CenteredTemplate';
import {
  PixelTypography,
  StyledContainer,
  StyledSectionCard,
  StyledRankingHeaderCard,
  StyledRankingHeaderContent,
  StyledRankingContent,
  RankingEntityType,
} from '../Css/Ranking.styles';

function RankingPage() {
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
    const { entityType } = useParams<{ entityType?: string }>();
    const { t } = useTranslation();

    const validTypes: RankingEntityType[] = ['places', 'trips', 'itineraries'];

    const entityLabel = entityType
        ? t(`ranking.entities.${entityType}`, { defaultValue: entityType })
        : undefined;
    const pageTitle = entityLabel
        ? t('ranking.pageTitle', { entity: entityLabel })
        : t('ranking.allPageTitle');
    const pageDescription = entityLabel
        ? t('ranking.pageDescription', { entity: entityLabel.toLowerCase() })
        : t('ranking.allPageDescription');
    useSeoMeta({
        title: pageTitle,
        description: pageDescription,
        ogTitle: pageTitle,
    });
    const showMulti = !entityType || !validTypes.includes(entityType as RankingEntityType);

    return (
        <CenteredTemplate>
            <StyledContainer sx={{ maxWidth: '900px' }}>
                {/* Header Section */}
                <StyledRankingHeaderCard>
                    <StyledRankingHeaderContent>
                        <PixelTypography 
                            variant="h4" 
                            sx={{
                                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                color: '#FFFFFF',
                                mb: 1,
                                lineHeight: 1.4
                            }}
                        >
                            <Leaderboard sx={{ fontSize: isSmUp ? 48 : 40 }} />
                            {t('ranking.heading')}
                        </PixelTypography>
                        <PixelTypography
                            sx={{
                                fontSize: isSmUp ? '0.6rem' : '0.5rem',
                                color: '#2C2C2C',
                                lineHeight: 1.6,
                                mt: 1,
                            }}
                        >
                            {t('ranking.description')}
                        </PixelTypography>
                    </StyledRankingHeaderContent>
                </StyledRankingHeaderCard>

                {/* Ranking Content Section */}
                <StyledSectionCard sx={{ mb: 0 }}>
                    <StyledRankingContent>
                        {showMulti ? (
                            <MultiRanking />
                        ) : (
                            <Ranking defaultEntityType={entityType} showSelector={true} />
                        )}
                    </StyledRankingContent>
                </StyledSectionCard>
            </StyledContainer>
        </CenteredTemplate>
    );
}

export default RankingPage;
