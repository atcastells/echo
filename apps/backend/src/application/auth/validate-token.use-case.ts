import { Service, Container } from "typedi";
import { User } from "../../domain/user/user.js";
import { SupabaseClient } from "../../adapters/outbound/authentication/supabase-client.js";
import { AuthRepository } from "../../domain/auth/auth-repository.js";
import {
  AUTH_REPOSITORY,
  SUPABASE_CLIENT,
} from "../../infrastructure/constants.js";

@Service()
export class ValidateTokenUseCase {
  private readonly supabaseClient: SupabaseClient =
    Container.get(SUPABASE_CLIENT);
  private readonly authRepository: AuthRepository =
    Container.get(AUTH_REPOSITORY);
  constructor() {}
  async execute(token: string): Promise<User | undefined> {
    const supabase = this.supabaseClient.getClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return undefined;
    }

    return this.authRepository.findByAuthId(user.id);
  }
}
