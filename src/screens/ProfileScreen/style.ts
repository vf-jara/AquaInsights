import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  font-weight: bold;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const Input = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.card};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  border-width: 1px;
  border-color: #E2E8F0;
`;

export const DisaledInput = styled(Input)`
  background-color: #E2E8F0;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
`;

export const ButtonText = styled.Text`
  color: #FFF;
  font-size: 16px;
  font-weight: bold;
`;
