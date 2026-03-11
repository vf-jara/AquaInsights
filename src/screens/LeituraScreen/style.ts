import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ContentOffset = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: 40px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const Label = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  font-weight: 600;
  margin-left: 2px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  font-weight: bold;
`;

export const InputGroup = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const inputStyle = {
  backgroundColor: '#FFFFFF',
  padding: 16,
  borderRadius: 8,
  fontSize: 16,
  borderWidth: 1,
  borderColor: '#E2E8F0',
};

export const PickerContainer = styled.View`
  background-color: '#FFFFFF';
  border-radius: 8px;
  border-width: 1px;
  border-color: '#E2E8F0';
  overflow: hidden;
  margin-bottom: 16px;
`;

export const ActionButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
`;

export const ActionButtonText = styled.Text`
  color: #FFF;
  font-size: 16px;
  font-weight: bold;
`;
