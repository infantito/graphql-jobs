import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import SearchJobs from './components/SearchJobs';
import './app.css';
import { MatchingJobs, MatchingJobsByCountry } from './components/MatchingJobs';

type Props = {};
type ApolloClientParams = { uri: string };

const client: ApolloClient<ApolloClientParams> = new ApolloClient({ uri: process.env.REACT_APP_GRAPH_URL });

const App: React.ComponentType<Props> = () => {
  const [job, setJob] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [company, setCompany] = React.useState('');
  const handleChange = (key: string): React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> => (event): void => {
    const value = event.target.value;
    key === 'job' && setJob(value);
    key === 'country' && setCountry(value);
    key === 'company' && setCompany(value);
  }
  const handleReset: React.FormEventHandler<HTMLButtonElement> = (): void => {
    setJob('')
    setCountry('')
    setCompany('')
  }

  return (
    <div className="app">
      <ApolloProvider client={client}>
        <SearchJobs
          job={job}
          country={country}
          company={company}
          handleChange={handleChange}
          handleReset={handleReset}
        />
        {country ? (
          <MatchingJobsByCountry
            input={{ slug: country }}
            phrase={job}
            company={company}
          />
        ) : (
          <MatchingJobs
            input={{ type: 'country', slug: country }}
            phrase={job}
            company={company}
          />
        )}
      </ApolloProvider>
    </div>
  );
};

export default App;
