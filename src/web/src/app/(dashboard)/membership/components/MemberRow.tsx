'use client';

import Link from 'next/link';

interface MemberRowProps {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  church: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'transferred';
}

export function MemberRow({
  id,
  fullName,
  email,
  phone,
  church,
  joinDate,
  status,
}: MemberRowProps) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-green-600 dark:text-green-300">
              {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{phone}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{church}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{joinDate}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          status === 'active' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : status === 'inactive'
              ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link 
            href={`/membership/${id}`}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
          >
            View
          </Link>
          <Link 
            href={`/membership/${id}/transfer`}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
          >
            Transfer
          </Link>
        </div>
      </td>
    </tr>
  );
}