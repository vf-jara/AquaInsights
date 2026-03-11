import styled from 'styled-components/native';
import { NivelQualidade } from '../../utils/waterQualityRules';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ContentOffset = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: 40px;
`;

export const NivelBanner = styled.View<{ nivel: NivelQualidade }>`
  background-color: ${({ nivel }) =>
    nivel === 'Ótimo' ? '#2A9D8F' : nivel === 'Atenção' ? '#F4A261' : '#E63946'};
  padding: 20px;
  border-radius: 16px;
  align-items: center;
  margin-bottom: 24px;
`;

export const NivelLabel = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const NivelText = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  margin-top: 4px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const ParamCard = styled.View<{ nivel: NivelQualidade }>`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 10px;
  border-left-width: 4px;
  border-left-color: ${({ nivel }) =>
    nivel === 'Ótimo' ? '#2A9D8F' : nivel === 'Atenção' ? '#F4A261' : '#E63946'};
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.06;
  shadow-radius: 3px;
  elevation: 1;
`;

export const ParamHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const ParamName = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

export const ParamValue = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const ParamBadge = styled.View<{ nivel: NivelQualidade }>`
  background-color: ${({ nivel }) =>
    nivel === 'Ótimo' ? '#2A9D8F' : nivel === 'Atenção' ? '#F4A261' : '#E63946'};
  padding: 2px 10px;
  border-radius: 12px;
`;

export const ParamBadgeText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #fff;
`;

export const ParamMsg = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 2px;
`;

export const InstrucaoCard = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: flex-start;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.06;
  shadow-radius: 3px;
  elevation: 1;
`;

export const InstrucaoBullet = styled.Text`
  font-size: 16px;
  margin-right: 10px;
  line-height: 22px;
`;

export const InstrucaoText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  line-height: 22px;
`;

export const VoltarButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

export const VoltarButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
