import styled, { css } from 'styled-components/native';

import { colors, normalize } from '../config';

export const RegularText = styled.Text`
  color: ${colors.darkText};
  font-family: titillium-web-regular;
  font-size: ${normalize(16)};
  line-height: ${normalize(22)};

  ${(props) =>
    props.small &&
    css`
      font-size: ${normalize(14)};
    `};

  ${(props) =>
    props.link &&
    css`
      color: ${colors.primary};
    `};

  ${(props) =>
    props.lighter &&
    css`
      color: ${colors.lighterText};
    `};

  ${(props) =>
    props.lightest &&
    css`
      color: ${colors.lightestText};
    `};
`;

export const BoldText = styled(RegularText)`
  font-family: titillium-web-bold;
`;
