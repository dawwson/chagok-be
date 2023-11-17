import { User } from '../../src/entity/user.entity';
import { Category } from '../../src/entity/category.entity';
import { CategoryName } from '../../src/shared/enum/category-name.enum';

export const testUsers: User[] = [
  {
    id: '18ced157-af28-4f06-94f3-a0a7192dcb68',
    email: 'test1@gmail.com',
    password: 'test1',
  },
  {
    id: '9e9f3460-cf67-4222-803b-71e4bd567594',
    email: 'test2@gmail.com',
    password: 'test2',
  },
] as User[];

export const testCategories: Category[] = Object.values(CategoryName).map(
  (name, index) => ({ id: index, name }) as Category,
);
// export const testCategories: Category[] = [
//   {
//     id: 1,
//     name: CategoryName.FOOD,
//   },
//   {
//     id: 2,
//     name: 'test2@gmail.com',
//   },
// ] as Category[];
