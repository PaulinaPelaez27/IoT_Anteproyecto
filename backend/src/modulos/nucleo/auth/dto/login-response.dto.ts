export class LoginResponseDto {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;

  roles: string[];       // multi-rol
  empresas: number[];    // multi-empresa (IDs de empresas)

  access_token: string;  // JWT
}
