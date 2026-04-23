import { Token } from 'generated/prisma/client';
import { SaveTokenParams } from '../types/token.type';

export abstract class TokenRepository {
	abstract save(params: SaveTokenParams): Promise<Token>;
	abstract findByUserAndDevice(userId: string, roleContextId: string, deviceId: string): Promise<Token | null>;
	abstract findById(id: string): Promise<Token | null>;
	abstract deleteById(id: string): Promise<Token>;
	abstract deleteAllByUserId(userId: string): Promise<number>;
}
