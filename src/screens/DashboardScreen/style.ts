import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const ScrollContainer = styled.ScrollView.attrs(({ theme }: any) => ({
  contentContainerStyle: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  }
}))`
  flex: 1;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

export const Greeting = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const MenuGrid = styled.View`
  flex-direction: column;
  align-items: center;
`;

export const MenuCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.card};
  flex-direction: row;
  width: 100%;
  height: 90px;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 3;
`;

export const CardText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;

export const SyncCard = styled.TouchableOpacity`
  background-color: #FFF3CD;
  flex-direction: row;
  width: 100%;
  height: 90px;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  align-items: center;
  border: 1px solid #FFEEBA;
`;

export const SyncCardText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #856404;
  margin-left: ${({ theme }) => theme.spacing.md}px;
  flex: 1;
`;

export const Badge = styled.View`
  background-color: #F56565;
  border-radius: 12px;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
`;

export const BadgeText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

export const LogoutButton = styled.TouchableOpacity`
  margin-top: auto;
  align-self: center;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

export const LogoutText = styled.Text`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 16px;
  font-weight: bold;
`;
