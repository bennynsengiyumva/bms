import prisma from '../models/prisma';

export const getAllUsers = async (filters: any) => {
  return await prisma.user.findMany({
    where: filters,
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      role: true,
      status: true,
      lastLogin: true,
      createdAt: true,
      churchId: true,
      districtId: true,
      fieldId: true,
      unionId: true,
    },
  });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      church: true,
      district: true,
      field: true,
      union: true,
    },
  });
};

export const updateUser = async (id: string, userData: any) => {
  return await prisma.user.update({
    where: { id },
    data: userData,
  });
};

export const updateUserRole = async (id: string, role: string) => {
  return await prisma.user.update({
    where: { id },
    data: { role },
  });
};

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};
