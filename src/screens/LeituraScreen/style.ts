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

export const dropdownStyles = {
  dropdown: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#7A8C9E',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#2B3A4A',
  },
  itemContainerStyle: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  itemTextStyle: {
    fontSize: 16,
    color: '#2B3A4A',
  },
};

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
