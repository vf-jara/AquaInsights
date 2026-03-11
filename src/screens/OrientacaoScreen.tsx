import React from 'react';
import styled from 'styled-components/native';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AvaliacaoGeral, NivelQualidade, ParametroAvaliacao } from '../utils/waterQualityRules';

type OrientacaoRouteParams = {
  Orientacao: { avaliacao: AvaliacaoGeral };
};

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContentOffset = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: 40px;
`;

const NivelBanner = styled.View<{ nivel: NivelQualidade }>`
  background-color: ${({ nivel }) =>
    nivel === 'Ótimo' ? '#2A9D8F' : nivel === 'Atenção' ? '#F4A261' : '#E63946'};
  padding: 20px;
  border-radius: 16px;
  align-items: center;
  margin-bottom: 24px;
`;

const NivelLabel = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const NivelText = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  margin-top: 4px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const ParamCard = styled.View<{ nivel: NivelQualidade }>`
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

const ParamHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ParamName = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const ParamValue = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ParamBadge = styled.View<{ nivel: NivelQualidade }>`
  background-color: ${({ nivel }) =>
    nivel === 'Ótimo' ? '#2A9D8F' : nivel === 'Atenção' ? '#F4A261' : '#E63946'};
  padding: 2px 10px;
  border-radius: 12px;
`;

const ParamBadgeText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #fff;
`;

const ParamMsg = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 2px;
`;

const InstrucaoCard = styled.View`
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

const InstrucaoBullet = styled.Text`
  font-size: 16px;
  margin-right: 10px;
  line-height: 22px;
`;

const InstrucaoText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  line-height: 22px;
`;

const VoltarButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

const VoltarButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

function getNivelEmoji(nivel: NivelQualidade): string {
  if (nivel === 'Ótimo') return '✅';
  if (nivel === 'Atenção') return '⚠️';
  return '🚨';
}

export default function OrientacaoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<OrientacaoRouteParams, 'Orientacao'>>();
  const { avaliacao } = route.params;

  return (
    <Container>
      <ContentOffset>
        <NivelBanner nivel={avaliacao.nivelGeral}>
          <NivelLabel>Avaliação Geral</NivelLabel>
          <NivelText>{getNivelEmoji(avaliacao.nivelGeral)} {avaliacao.nivelGeral}</NivelText>
        </NivelBanner>

        <SectionTitle>Parâmetros Analisados</SectionTitle>
        {avaliacao.avaliacoes.map((a: ParametroAvaliacao, idx: number) => (
          <ParamCard key={idx} nivel={a.nivel}>
            <ParamHeader>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ParamName>{a.parametro}</ParamName>
                <ParamBadge nivel={a.nivel}>
                  <ParamBadgeText>{a.nivel}</ParamBadgeText>
                </ParamBadge>
              </View>
              <ParamValue>{a.valor} {a.unidade}</ParamValue>
            </ParamHeader>
            <ParamMsg>{a.mensagem}</ParamMsg>
          </ParamCard>
        ))}

        <SectionTitle>Instruções de Manejo</SectionTitle>
        {avaliacao.instrucoes.map((instrucao: string, idx: number) => (
          <InstrucaoCard key={idx}>
            <InstrucaoBullet>•</InstrucaoBullet>
            <InstrucaoText>{instrucao}</InstrucaoText>
          </InstrucaoCard>
        ))}

        <VoltarButton onPress={() => navigation.navigate('Dashboard')}>
          <VoltarButtonText>Voltar ao Dashboard</VoltarButtonText>
        </VoltarButton>
      </ContentOffset>
    </Container>
  );
}
