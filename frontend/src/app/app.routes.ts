import { Routes } from '@angular/router';
//import { ListaEmpresas } from './pages/lista-empresas/lista-empresas';
import { EMPRESAS_ROUTES } from './features/empresas/empresas.routes';
import { PROYECTOS_ROUTES } from './features/proyectos/proyectos.routes';

export const routes: Routes = [ { path: 'empresas', children: EMPRESAS_ROUTES }, { path: 'proyectos', children: PROYECTOS_ROUTES } ];