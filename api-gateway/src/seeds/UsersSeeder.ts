import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../utils/entities/user.entity';

export class SeedUsers {

  constructor() {
  }

  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const users = [
      { username: 'user1', password: 'password1' },
      { username: 'user2', password: 'password2' },
      { username: 'user3', password: 'password3' },
      { username: 'user4', password: 'password4' },
      { username: 'user5', password: 'password5' },
    ];

    const saltRounds = 10;

    for (const user of users) {
      const salt = await bcrypt.genSalt(saltRounds);
      user.password = await bcrypt.hash(user.password, salt);
    }

    await userRepository.save(users);
  }
}
