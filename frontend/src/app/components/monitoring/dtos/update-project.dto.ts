import { CreateProjectDto } from './create-project.dto';

export interface UpdateProjectDto extends CreateProjectDto {
  id: string;
}
