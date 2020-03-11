import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { MATCHING_JOBS, JOBS_BY_COUNTRY } from '../queries';
import { ApolloError } from 'apollo-boost';

type JobsProps = {
  loading: boolean;
  error: ApolloError | undefined;
  jobs: Job[];
};

const Jobs: React.ComponentType<JobsProps> = (props: JobsProps) => {
  const { loading, error, jobs } = props;

  if (loading) {
    return (
      <div className="app-matching">
        <ul className="app-jobs">
          <li><p className="app-job">loading...</p></li>
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-matching">
        <ul className="app-jobs">
          <li><p className="app-job">Error: {error.message}</p></li>
        </ul>
      </div>
    );
  }

  const intl = new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="app-matching">
      <h5 className="app-total">Total: {jobs.length} jobs</h5>
      <ul className="app-jobs">
        {jobs.length > 0 ? (
          jobs.map((job: Job, index: number) => (
            <li key={job.id || index} title={job.slug}>
              <a href={job.applyUrl} rel="noopener noreferrer" target="_blank" className="app-apply">
                <img src="https://graphql.org/img/favicon.png" alt="💻" />
                <p className="app-job">{job.title}</p>
                <span className="app-mode">{job?.countries?.length ? job?.countries[0]?.name : 'Remote'}</span>
                <span className="app-date">{intl.format(new Date(job.createdAt))}</span>
              </a>
            </li>
          ))
        ) : (
          <li>
            <p className="app-job">There&apos;s no data</p>
          </li>
        )}
      </ul>
    </div>
  );
};

type JobsParams = {
  type: string;
  slug: string;
};

type PropsJob = {
  input: JobsParams;
  phrase: string;
  company: string;
};

type Company = {
  id: string;
  name: string;
  slug: string;
}

type Country = {
  id: string;
  name: string;
}

type Job = {
  id: string;
  title: string;
  slug: string;
  company: Company;
  countries: Country[];
  applyUrl: string;
  createdAt: string;
};

interface JobsData {
  jobs: Job[];
}

interface QueryJobs {
  input: JobsParams;
}

type FindParams = {
  phrase: string;
  company: string;
  jobs: Job[];
}

const findJobMatches = ({ phrase, company, jobs }: FindParams): Job[] => {
  const both = company && phrase;
  const isProceed = company || phrase;

  return isProceed ? jobs.filter(({ title, company: enterprise }: Job) => {
    let exist: boolean | string = false;
    const isPhrased = title.toLowerCase().includes(phrase.toLowerCase());

    if (both) {
      exist = both && isPhrased && enterprise.id === company;
    } else if (isProceed) {
      exist = company && enterprise.id === company;
      exist = phrase ? isPhrased : exist;
    }

    return exist;
  }) : jobs;
}

const MatchingJobs: React.ComponentType<PropsJob> = (props: PropsJob) => {
  const { loading, error, data } = useQuery<JobsData, QueryJobs>(MATCHING_JOBS, {
    variables: {
      input: props.input,
    }
  });
  const jobs = findJobMatches({
    jobs: data?.jobs || [],
    phrase: props.phrase,
    company: props.company
  });

  return <Jobs loading={loading} error={error} jobs={jobs} />;
};

type CountryParams = {
  slug: string;
};

type PropsCountry = {
  input: CountryParams;
  phrase: string;
  company: string;
};

interface CountryData {
  country: {
    jobs: Job[];
  };
}

interface QueryCountry {
  input: CountryParams;
  orderBy: string;
}

const MatchingJobsByCountry: React.ComponentType<PropsCountry> = (props: PropsCountry) => {
  const { loading, error, data } = useQuery<CountryData, QueryCountry>(JOBS_BY_COUNTRY, {
    variables: {
      input: props.input,
      orderBy: 'createdAt_DESC'
    }
  });
  const jobs = findJobMatches({
    jobs: data?.country?.jobs || [],
    phrase: props.phrase,
    company: props.company
  });

  return <Jobs loading={loading} error={error} jobs={jobs} />;
};

export { MatchingJobs, MatchingJobsByCountry };
