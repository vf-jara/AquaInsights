import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AvaliacaoGeral, NivelQualidade, ParametroAvaliacao } from '../../utils/waterQualityRules';
import { Container, ContentOffset, NivelBanner, NivelLabel, NivelText, SectionTitle, ParamCard, ParamHeader, ParamName, ParamValue, ParamBadge, ParamBadgeText, ParamMsg, InstrucaoCard, InstrucaoBullet, InstrucaoText, VoltarButton, VoltarButtonText } from './style';

type OrientacaoRouteParams = {
  Orientacao: { avaliacao: AvaliacaoGeral };
};

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
