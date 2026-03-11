import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

export const Title = styled.Text`
  font-size: 36px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  text-align: center;
`;

export const InputGroup = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  margin-left: 2px;
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

export const ButtonContainer = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${({ theme, variant }) => variant === 'secondary' ? 'transparent' : theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  border: ${({ theme, variant }) => variant === 'secondary' ? `1px solid ${theme.colors.primary}` : 'none'};
`;

export const ButtonText = styled.Text<{ variant?: 'primary' | 'secondary' }>`
  color: ${({ theme, variant }) => variant === 'secondary' ? theme.colors.primary : '#FFF'};
  font-size: 16px;
  font-weight: bold;
`;
