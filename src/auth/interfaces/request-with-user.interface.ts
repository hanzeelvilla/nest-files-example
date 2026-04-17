import { User } from '../entities/user.entity';

export interface RequestWithUser extends Request {
  user?: User;
}
