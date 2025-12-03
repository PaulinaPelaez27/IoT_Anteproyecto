import { Routes } from '@angular/router';
//import { ListaEmpresas } from './pages/lista-empresas/lista-empresas';
import { EMPRESAS_ROUTES } from './features/empresas/empresas.routes';

export const routes: Routes = [ { path: 'empresas', children: EMPRESAS_ROUTES } ];