import gql from 'graphql-tag';
import { JobFragment } from './fragments';

const COUNTRIES = gql`
  query COUNTRIES {
    countries {
      id
      name
      slug
    }
  }
`;

const COMPANIES = gql`
  query COMPANIES {
    companies {
      id
      name
      slug
    }
  }
`;

const MATCHING_JOBS = gql`
  query MATCHING_JOBS($input: JobsInput!) {
    jobs(input: $input) {
      ...JobFragment
    }
  }

  ${JobFragment}
`;

const JOBS_BY_COUNTRY = gql`
  query JOBS_BY_COUNTRY($input: LocationInput!, $orderBy: JobOrderByInput!) {
    country(input: $input) {
      id
      name
      slug
      jobs(orderBy: $orderBy) {
        ...JobFragment
      }
    }
  }

  ${JobFragment}
`;

export { COUNTRIES, COMPANIES, MATCHING_JOBS, JOBS_BY_COUNTRY };
