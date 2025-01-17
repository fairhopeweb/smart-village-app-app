import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { consts, Icon, normalize } from '../../config';
import { openLink } from '../../helpers';
import { WebUrl } from '../../types';
import { RegularText } from '../Text';
import { InfoBox } from '../Wrapper';

type Props = {
  openWebScreen: (link: string) => void;
  webUrls: WebUrl[];
};

export const UrlSection = ({ openWebScreen, webUrls }: Props) => (
  <>
    {webUrls.map((item, index) => {
      const { url, description } = item;
      const a11yText = consts.a11yLabel;

      if (!url) {
        return null;
      }

      return (
        <InfoBox key={index}>
          <Icon.Url style={styles.margin} />
          <TouchableOpacity
            accessibilityLabel={`
              ${a11yText.website} (${description || url}) ${a11yText.button} ${a11yText.webViewHint}
            `}
            onPress={() => openLink(url, openWebScreen)}
          >
            {!description || !!description?.startsWith('url') ? (
              <RegularText primary>{url}</RegularText>
            ) : (
              <RegularText primary>{description}</RegularText>
            )}
          </TouchableOpacity>
        </InfoBox>
      );
    })}
  </>
);

const styles = StyleSheet.create({
  margin: {
    marginRight: normalize(10)
  }
});
