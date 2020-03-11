import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { COUNTRIES, COMPANIES } from '../queries';

type Props = {
  job: string;
  country: string;
  company: string;
  handleChange(key: string): React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  handleReset: React.FormEventHandler<HTMLButtonElement>;
};

type Country = {
  id: string;
  name: string;
  slug: string;
}

type Company = {
  id: string;
  name: string;
  slug: string;
}

const SearchJobs: React.ComponentType<Props> = (props: Props) => {
  const {
    loading: loadingCountries,
    error: errorCountries,
    data: dataCountries
  } = useQuery(COUNTRIES);
  const {
    loading: loadingCompanies,
    error: errorCompanies,
    data: dataCompanies
  } = useQuery(COMPANIES);
  const countries = loadingCountries || errorCountries ? [] : (dataCountries || {}).countries || [];
  const companies = loadingCompanies || errorCompanies ? [] : (dataCompanies || {}).companies || [];

  return (
    <div className="app-filter">
      <h2 className="app-headline">Work with us!</h2>
      <div className="app-searcher">
        <input
          type="text"
          className="app-control app-input"
          value={props.job}
          onChange={props.handleChange('job')}
          placeholder="Type a job title"
        />
        <select
          className="app-control app-select"
          value={props.country}
          onChange={props.handleChange('country')}
        >
          <option value="" disabled={true}>
            Select a country
          </option>
          {countries.map((country: Country) => (
            <option value={country.slug} key={country.id}>
              {country.name}
            </option>
          ))}
        </select>
        <select
          className="app-control app-select"
          value={props.company}
          onChange={props.handleChange('company')}
        >
          <option value="" disabled={true}>
            Select a company
          </option>
          {companies.map((company: Company) => (
            <option value={company.id} key={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        <button className="app-control app-button" type="button" onClick={props.handleReset}>
          See All
        </button>
      </div>
    </div>
  );
}

export default React.memo(SearchJobs);
