import { 
    Validator,
  ValidatorConstraint, 
  ValidatorConstraintInterface 
} from 'class-validator';

@ValidatorConstraint({ name: 'UmbralRangoValidador', async: false })
export class UmbralRangoValidador implements ValidatorConstraintInterface {
  validate(valorMin: number, args: any): boolean {
    const objeto = args.object as any;
    const valorMax = objeto['valorMax'];
    if (valorMin === null && valorMax === null) {
      return false;
    }
    if (valorMin !== null && valorMax !== null) {
      return valorMin <= valorMax;
    }
    return true;
  }
    defaultMessage(args: any): string {
        return 'El valor mínimo debe ser menor o igual al valor máximo, y no ambos pueden ser nulos';
    }
}