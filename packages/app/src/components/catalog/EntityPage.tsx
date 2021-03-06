/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ApiEntity, Entity } from '@backstage/catalog-model';
import { WarningPanel } from '@backstage/core';
import {
  ApiDefinitionCard,
  ConsumedApisCard,
  ConsumingComponentsCard,
  ProvidedApisCard,
  ProvidingComponentsCard,
} from '@backstage/plugin-api-docs';
import { AboutCard, EntityPageLayout } from '@backstage/plugin-catalog';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  isPluginApplicableToEntity as isCircleCIAvailable,
  Router as CircleCIRouter,
} from '@backstage/plugin-circleci';
import {
  isPluginApplicableToEntity as isGitHubActionsAvailable,
  Router as GitHubActionsRouter,
} from '@backstage/plugin-github-actions';
import { EmbeddedDocsRouter as DocsRouter } from '@backstage/plugin-techdocs';
import { Grid } from '@material-ui/core';
import React from 'react';

import { Router as GitHubInsightsRouter } from '@roadiehq/backstage-plugin-github-insights';

import {
  ContributorsCard,
  LanguagesCard,
  ReadMeCard,
  ReleasesCard,
  isPluginApplicableToEntity as isGitHubAvailable,
} from '@roadiehq/backstage-plugin-github-insights';

import { Router as GithubPullRequestsRouter } from '@roadiehq/backstage-plugin-github-pull-requests';
import { PullRequestsStatsCard } from '@roadiehq/backstage-plugin-github-pull-requests';

import {
  JiraCard,
  isPluginApplicableToEntity as isJiraAvailable,
} from '@roadiehq/backstage-plugin-jira';

import { Router as SecurityInsightsRouter } from '@roadiehq/backstage-plugin-security-insights';
import {
  SecurityInsightsWidget,
  isPluginApplicableToEntity as isSecurityInsightsAvailable,
} from '@roadiehq/backstage-plugin-security-insights';

import { SonarQubeCard } from '@backstage/plugin-sonarqube';

const CICDSwitcher = ({ entity }: { entity: Entity }) => {
  // This component is just an example of how you can implement your company's logic in entity page.
  // You can for example enforce that all components of type 'service' should use GitHubActions
  switch (true) {
    case isGitHubActionsAvailable(entity):
      return <GitHubActionsRouter entity={entity} />;
    case isCircleCIAvailable(entity):
      return <CircleCIRouter entity={entity} />;
    default:
      return (
        <WarningPanel title="CI/CD switcher:">
          No CI/CD is available for this entity. Check corresponding
          annotations!
        </WarningPanel>
      );
  }
};

const OverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item>
      <AboutCard entity={entity} variant="gridItem" />
    </Grid>
    <Grid item md={6}>
      <PullRequestsStatsCard entity={entity} />
    </Grid>
    {isJiraAvailable(entity) && (
      <Grid item md={6}>
        <JiraCard entity={entity} />
      </Grid>
    )}
    <Grid item xs={12} sm={6} md={4}>
      <SonarQubeCard entity={entity} />
    </Grid>
    {isSecurityInsightsAvailable(entity) && (
      <>
        <Grid item md={6}>
          <SecurityInsightsWidget entity={entity} />
        </Grid>
      </>
    )}
    {isGitHubAvailable(entity) && (
      <>
        <Grid item md={6}>
          <ContributorsCard entity={entity} />
          <LanguagesCard entity={entity} />
          <ReleasesCard entity={entity} />
        </Grid>
        <Grid item md={6}>
          <ReadMeCard entity={entity} />
        </Grid>
      </>
    )}
  </Grid>
);

const ComponentApisContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3} alignItems="stretch">
    <Grid item md={6}>
      <ProvidedApisCard entity={entity} />
    </Grid>
    <Grid item md={6}>
      <ConsumedApisCard entity={entity} />
    </Grid>
  </Grid>
);

const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<OverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/ci-cd/*"
      title="CI/CD"
      element={<CICDSwitcher entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/api/*"
      title="API"
      element={<ComponentApisContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/github-pull-requests"
      title="Github Pull Requests"
      element={<GithubPullRequestsRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/code-insights/*"
      title="Code Insights"
      element={<GitHubInsightsRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/security-insights"
      title="Security Insights"
      element={<SecurityInsightsRouter entity={entity} />}
    />
  </EntityPageLayout>
);

const WebsiteEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={<OverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/ci-cd/*"
      title="CI/CD"
      element={<CICDSwitcher entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/code-insights/*"
      title="Code Insights"
      element={<GitHubInsightsRouter entity={entity} />}
    />
  </EntityPageLayout>
);

const DefaultEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<OverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/docs/*"
      title="Docs"
      element={<DocsRouter entity={entity} />}
    />
  </EntityPageLayout>
);

export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
  switch (entity?.spec?.type) {
    case 'service':
      return <ServiceEntityPage entity={entity} />;
    case 'website':
      return <WebsiteEntityPage entity={entity} />;
    default:
      return <DefaultEntityPage entity={entity} />;
  }
};

const ApiOverviewContent = ({ entity }: { entity: Entity }) => (
  <Grid container spacing={3}>
    <Grid item md={6}>
      <AboutCard entity={entity} />
    </Grid>
    <Grid container item md={12}>
      <Grid item md={6}>
        <ProvidingComponentsCard entity={entity} />
      </Grid>
      <Grid item md={6}>
        <ConsumingComponentsCard entity={entity} />
      </Grid>
    </Grid>
  </Grid>
);

const ApiDefinitionContent = ({ entity }: { entity: ApiEntity }) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <ApiDefinitionCard apiEntity={entity} />
    </Grid>
  </Grid>
);

const ApiEntityPage = ({ entity }: { entity: Entity }) => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/*"
      title="Overview"
      element={<ApiOverviewContent entity={entity} />}
    />
    <EntityPageLayout.Content
      path="/definition/*"
      title="Definition"
      element={<ApiDefinitionContent entity={entity as ApiEntity} />}
    />
  </EntityPageLayout>
);

export const EntityPage = () => {
  const { entity } = useEntity();

  switch (entity?.kind?.toLowerCase()) {
    case 'component':
      return <ComponentEntityPage entity={entity} />;
    case 'api':
      return <ApiEntityPage entity={entity} />;
    default:
      return <DefaultEntityPage entity={entity} />;
  }
};
