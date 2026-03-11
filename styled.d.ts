import 'styled-components/native';
import { Theme } from './src/theme/theme';

declare module 'styled-components/native' {
    export interface DefaultTheme extends Theme { }
}
