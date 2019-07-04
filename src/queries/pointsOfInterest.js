import gql from 'graphql-tag';

export const GET_POINTS_OF_INTEREST = gql`
  query PointsOfInterest($limit: Int, $order: PointsOfInterestOrder) {
    pointsOfInterest(limit: $limit, order: $order) {
      id
      name
      category {
        name
      }
      description
      mediaContents {
        contentType
        sourceUrl {
          url
        }
      }
      addresses {
        city
        street
        zip
      }
      contact {
        email
        phone
        lastName
      }
      webUrls {
        url
      }
    }
  }
`;

export const GET_POINT_OF_INTEREST = gql`
  query PointOfInterest($id: ID!) {
    pointOfInterest(id: $id) {
      id
      title: name
      category {
        name
      }
      description
      mediaContents {
        contentType
        sourceUrl {
          url
        }
      }
      dataProvider {
        logo {
          url
        }
        name
      }
      addresses {
        city
        street
        zip
      }
      contact {
        email
        phone
        lastName
      }
      webUrls {
        url
      }
      prices {
        category
        amount
        description
        maxChildrenCount
        maxAdultCount
        groupPrice
      }
      openingHours {
        sortNumber
        weekday
        timeFrom
        timeTo
        open
        dateFrom
        dateTo
        description
      }
      operatingCompany {
        name
        address {
          id
          kind
          addition
          street
          zip
          city
        }
        contact {
          firstName
          lastName
          phone
          email
          fax
          webUrls {
            url
          }
        }
      }
    }
  }
`;
