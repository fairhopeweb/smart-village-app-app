import PropTypes from 'prop-types';
import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Query } from 'react-apollo';
import _shuffle from 'lodash/shuffle';

import { NetworkContext } from '../NetworkProvider';
import { device, normalize, texts } from '../config';
import {
  CardList,
  DiagonalGradient,
  Image,
  BoldText,
  Button,
  ServiceBox,
  TextList,
  Title,
  TitleContainer,
  TitleShadow,
  Touchable,
  Wrapper,
  WrapperWrap
} from '../components';
import { getQuery } from '../queries';
import { eventDate, graphqlFetchPolicy, momentFormat, shareMessage } from '../helpers';

export class HomeScreen extends React.PureComponent {
  static contextType = NetworkContext;

  render() {
    const { navigation } = this.props;
    const isConnected = this.context.isConnected;
    const fetchPolicy = graphqlFetchPolicy(isConnected);

    return (
      <SafeAreaView>
        <ScrollView>
          <Image source={require('../../assets/images/home.jpg')} />
          <TitleContainer>
            <Touchable
              onPress={() =>
                navigation.navigate({
                  routeName: 'Index',
                  params: {
                    title: 'Nachrichten',
                    query: 'newsItems',
                    queryVariables: {},
                    rootRouteName: 'NewsItems'
                  }
                })
              }
            >
              <Title>{texts.homeTitles.news}</Title>
            </Touchable>
          </TitleContainer>
          {device.platform === 'ios' && <TitleShadow />}
          <Query query={getQuery('newsItems')} variables={{ limit: 3 }} fetchPolicy={fetchPolicy}>
            {({ data, loading }) => {
              if (loading) {
                return (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator />
                  </View>
                );
              }

              const newsItems =
                data &&
                data.newsItems &&
                data.newsItems.map((newsItem, index) => ({
                  id: newsItem.id,
                  subtitle: `${momentFormat(newsItem.publishedAt)} | ${newsItem.dataProvider &&
                    newsItem.dataProvider.name}`,
                  title: newsItem.contentBlocks[0].title,
                  routeName: 'Detail',
                  params: {
                    title: 'Nachricht',
                    query: 'newsItem',
                    queryVariables: { id: `${newsItem.id}` },
                    rootRouteName: 'NewsItems',
                    shareContent: {
                      message: shareMessage(newsItem, 'newsItem')
                    },
                    details: newsItem
                  },
                  bottomDivider: index !== data.newsItems.length - 1,
                  __typename: newsItem.__typename
                }));

              if (!newsItems || !newsItems.length) return null;

              return (
                <View>
                  <TextList navigation={navigation} data={newsItems} />

                  <Wrapper>
                    <Button
                      title="Alle Nachrichten anzeigen"
                      onPress={() =>
                        navigation.navigate({
                          routeName: 'Index',
                          params: {
                            title: 'Nachrichten',
                            query: 'newsItems',
                            queryVariables: {},
                            rootRouteName: 'NewsItems'
                          }
                        })
                      }
                    />
                  </Wrapper>
                </View>
              );
            }}
          </Query>

          <TitleContainer>
            <Touchable
              onPress={() =>
                navigation.navigate({
                  routeName: 'Index',
                  params: {
                    title: 'Orte und Touren',
                    query: 'pointsOfInterestAndTours',
                    queryVariables: {},
                    rootRouteName: 'pointsOfInterestAndTours'
                  }
                })
              }
            >
              <Title>{texts.homeTitles.pointsOfInterest}</Title>
            </Touchable>
          </TitleContainer>
          {device.platform === 'ios' && <TitleShadow />}
          <Query
            query={getQuery('pointsOfInterestAndTours')}
            variables={{ limit: 10, order: 'RAND' }}
            fetchPolicy={fetchPolicy}
          >
            {({ data, loading }) => {
              if (loading) {
                return (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator />
                  </View>
                );
              }

              const pointsOfInterest =
                data &&
                data.pointsOfInterest &&
                data.pointsOfInterest.map((pointOfInterest) => ({
                  id: pointOfInterest.id,
                  name: pointOfInterest.name,
                  category: !!pointOfInterest.category && pointOfInterest.category.name,
                  image:
                    !!pointOfInterest.mediaContents &&
                    !!pointOfInterest.mediaContents.length &&
                    !!pointOfInterest.mediaContents[0].sourceUrl &&
                    pointOfInterest.mediaContents[0].sourceUrl.url, // TODO: some logic to get the first image/thumbnail
                  routeName: 'Detail',
                  params: {
                    title: 'Ort',
                    query: 'pointOfInterest',
                    queryVariables: { id: `${pointOfInterest.id}` },
                    rootRouteName: 'PointsOfInterest',
                    shareContent: {
                      message: shareMessage(pointOfInterest, 'pointOfInterest')
                    },
                    details: pointOfInterest
                  },
                  __typename: pointOfInterest.__typename
                }));

              const tours =
                data &&
                data.tours &&
                data.tours.map((tour) => ({
                  id: tour.id,
                  name: tour.name,
                  category: !!tour.category && tour.category.name,
                  image:
                    !!tour.mediaContents &&
                    !!tour.mediaContents.length &&
                    !!tour.mediaContents[0].sourceUrl &&
                    tour.mediaContents[0].sourceUrl.url, // TODO: some logic to get the first image/thumbnail
                  routeName: 'Detail',
                  params: {
                    title: 'Touren',
                    query: 'tour',
                    queryVariables: { id: `${tour.id}` },
                    rootRouteName: 'Tours',
                    shareContent: {
                      message: shareMessage(tour, 'tour')
                    },
                    details: tour
                  },
                  __typename: tour.__typename
                }));

              return (
                <View>
                  <CardList
                    navigation={navigation}
                    data={_shuffle([...(pointsOfInterest || []), ...(tours || [])])}
                    horizontal
                  />

                  <Wrapper>
                    <Button
                      title="Alle Orte und Touren anzeigen"
                      onPress={() =>
                        navigation.navigate({
                          routeName: 'Index',
                          params: {
                            title: 'Orte und Touren',
                            query: 'pointsOfInterestAndTours',
                            queryVariables: {},
                            rootRouteName: 'pointsOfInterestAndTours'
                          }
                        })
                      }
                    />
                  </Wrapper>
                </View>
              );
            }}
          </Query>
          <TitleContainer>
            <Touchable
              onPress={() =>
                navigation.navigate({
                  routeName: 'Index',
                  params: {
                    title: 'Veranstaltungen',
                    query: 'eventRecords',
                    queryVariables: {},
                    rootRouteName: 'EventRecords'
                  }
                })
              }
            >
              <Title>{texts.homeTitles.events}</Title>
            </Touchable>
          </TitleContainer>
          {device.platform === 'ios' && <TitleShadow />}
          <Query
            query={getQuery('eventRecords')}
            variables={{ limit: 3 }}
            fetchPolicy={fetchPolicy}
          >
            {({ data, loading }) => {
              if (loading) {
                return (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator />
                  </View>
                );
              }

              const eventRecords =
                data &&
                data.eventRecords &&
                data.eventRecords.map((eventRecord, index) => ({
                  id: eventRecord.id,
                  subtitle: `${eventRecord.dates[0] &&
                    eventDate(
                      eventRecord.dates[0].dateStart,
                      eventRecord.dates[0].dateEnd
                    )} | ${eventRecord.dataProvider && eventRecord.dataProvider.name}`, // TODO: refactor eventRecord.dates[0]
                  title: eventRecord.title,
                  routeName: 'Detail',
                  params: {
                    title: 'Veranstaltung',
                    query: 'eventRecord',
                    queryVariables: { id: `${eventRecord.id}` },
                    rootRouteName: 'EventRecords',
                    shareContent: {
                      message: shareMessage(eventRecord, 'eventRecord')
                    }
                  },
                  bottomDivider: index !== data.eventRecords.length - 1,
                  __typename: eventRecord.__typename
                }));

              if (!eventRecords || !eventRecords.length) return null;

              return (
                <View>
                  <TextList navigation={navigation} data={eventRecords} />

                  <Wrapper>
                    <Button
                      title="Alle Veranstaltungen anzeigen"
                      onPress={() =>
                        navigation.navigate({
                          routeName: 'Index',
                          params: {
                            title: 'Veranstaltungen',
                            query: 'eventRecords',
                            queryVariables: {},
                            rootRouteName: 'EventRecords'
                          }
                        })
                      }
                    />
                  </Wrapper>
                </View>
              );
            }}
          </Query>
          <TitleContainer>
            <Title>{texts.homeTitles.service}</Title>
          </TitleContainer>
          {device.platform === 'ios' && <TitleShadow />}
          <Query
            query={getQuery('publicJsonFile')}
            variables={{ name: 'homeService' }}
            fetchPolicy={fetchPolicy}
          >
            {({ data, loading }) => {
              if (loading) {
                return (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator />
                  </View>
                );
              }

              let publicJsonFileContent =
                data && data.publicJsonFile && JSON.parse(data.publicJsonFile.content);

              if (!publicJsonFileContent) return null;

              return (
                <DiagonalGradient style={{ padding: normalize(14) }}>
                  <WrapperWrap>
                    {publicJsonFileContent.map((item, index) => {
                      return (
                        <ServiceBox key={index + item.title}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate({
                                routeName: item.routeName,
                                params: item.params
                              })
                            }
                          >
                            <View>
                              <Image
                                source={{ uri: item.icon }}
                                style={styles.serviceImage}
                                PlaceholderContent={null}
                              />
                              <BoldText small light>
                                {item.title}
                              </BoldText>
                            </View>
                          </TouchableOpacity>
                        </ServiceBox>
                      );
                    })}
                  </WrapperWrap>
                </DiagonalGradient>
              );
            }}
          </Query>
          <TitleContainer>
            <Title>{texts.homeTitles.about}</Title>
          </TitleContainer>
          {device.platform === 'ios' && <TitleShadow />}
          <Query
            query={getQuery('publicJsonFile')}
            variables={{ name: 'homeAbout' }}
            fetchPolicy={fetchPolicy}
          >
            {({ data, loading }) => {
              if (loading) {
                return (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator />
                  </View>
                );
              }

              let publicJsonFileContent =
                data && data.publicJsonFile && JSON.parse(data.publicJsonFile.content);

              if (!publicJsonFileContent) return null;

              return <TextList navigation={navigation} data={publicJsonFileContent} noSubtitle />;
            }}
          </Query>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: normalize(14)
  },
  serviceImage: {
    alignSelf: 'center',
    height: normalize(40),
    marginBottom: normalize(7),
    resizeMode: 'contain',
    width: '100%'
  }
});

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};
