import gql from 'graphql-tag';

const JobFragment = gql`
  fragment JobFragment on Job {
    id
    title
    slug
    applyUrl
    createdAt
    company {
      id
      name
      slug
    }
    countries {
      id
      name
    }
  }
`;

export { JobFragment };
