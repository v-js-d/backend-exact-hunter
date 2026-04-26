import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	findById(id: string): Promise<User | null> {
		return this.userRepository.findById(id);
	}

	findByEmail(email: string): Promise<User | null> {
		return this.userRepository.findByEmail(email);
	}
}
