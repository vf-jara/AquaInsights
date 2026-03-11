import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const ExportButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  flex-direction: row;
  align-items: center;
`;

export const ExportButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  margin-left: 4px;
`;

export const FilterRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const PickerContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const LeituraCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.card};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

export const LeituraData = styled.Text`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const StatusBadge = styled.View<{ status: string }>`
  background-color: ${({ theme, status }) => status === 'Normal' ? theme.colors.success : theme.colors.danger};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-bottom: 8px;
`;

export const StatusText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
`;

export const ParamText = styled.Text`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
`;

export const EmptyText = styled.Text`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 16px;
`;
