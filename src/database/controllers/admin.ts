import AppDataSource from '@database/dataSource';
import Admin from '@database/entities/admin';

export const getAdminDataByUid = async (uid: string) => {
  const adminData = await AppDataSource.getRepository(Admin)
    .createQueryBuilder('admin')
    .where('admin.uid = :uid', { uid })
    .getOne();

  return adminData;
};
