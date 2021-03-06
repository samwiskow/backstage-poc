import {
  AlertDisplay,
  createApp,
  FlatRoutes,
  OAuthRequestDialog,
  SidebarPage,
} from '@backstage/core';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import { CatalogImportPage } from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage/plugin-tech-radar';
import { TechdocsPage } from '@backstage/plugin-techdocs';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import React from 'react';
import { Navigate, Route } from 'react-router';
import { apis } from './apis';
import { EntityPage } from './components/catalog/EntityPage';
import * as plugins from './plugins';
import { AppSidebar } from './sidebar';
import { githubAuthApiRef, SignInPage } from '@backstage/core';
import { GithubPlaygroundPage } from '@internal/plugin-github-playground';

const authProviders = [
  {
    id: 'github-auth-provider',
    title: 'GitHub',
    message: 'Login via Github',
    apiRef: githubAuthApiRef,
  },
];

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
    });
    bind(apiDocsPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
    });
  },
  components: {
    SignInPage: props => {
      return <SignInPage {...props} providers={authProviders} align="center" />;
    },
  },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const App = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <SidebarPage>
        <AppSidebar />
        <FlatRoutes>
          <Navigate key="/" to="/catalog" />
          <Route path="/catalog" element={<CatalogIndexPage />} />
          <Route
            path="/catalog/:namespace/:kind/:name"
            element={<CatalogEntityPage />}
          >
            <EntityPage />
          </Route>
          <Route path="/docs" element={<TechdocsPage />} />
          <Route path="/create" element={<ScaffolderPage />} />
          <Route path="/api-docs" element={<ApiExplorerPage />} />
          <Route
            path="/tech-radar"
            element={<TechRadarPage width={1500} height={800} />}
          />
          <Route path="/catalog-import" element={<CatalogImportPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/github-playground" element={<GithubPlaygroundPage />}/>
        </FlatRoutes>
      </SidebarPage>
    </AppRouter>
  </AppProvider>
);

export default App;
