'use client';

import Link from 'next/link';

interface InstructorRowProps {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  qualifications: string;
  specialization: string;
  experienceYears: number;
  candidateCount: number;
}

export function InstructorRow({
  id,
  fullName,
  email,
  phone,
  qualifications,
  specialization,
  experienceYears,
  candidateCount,
}: InstructorRowProps) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
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
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{qualifications}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{specialization}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{experienceYears} {experienceYears === 1 ? 'year' : 'years'}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          candidateCount > 5 
            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            : candidateCount > 0
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
        }`}>
          {candidateCount} assigned
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link 
            href={`/instructors/${id}`}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
          >
            View
          </Link>
          <Link 
            href={`/instructors/${id}/assign`}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
          >
            Assign
          </Link>
        </div>
      </td>
    </tr>
  );
}