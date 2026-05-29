'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { Button, Card, Input, Select } from '@/components/ui';
import { InstructorRow, InstructorMetrics, AssignmentModal } from './components';

interface Instructor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  qualifications: string;
  specialization: string;
  experienceYears: number;
  candidateCount: number;
}

interface MetricsData {
  activeCandidates: number;
  lessonsCompleted: number;
  averageReadiness: number;
  baptismsThisYear: number;
}

// Mock data - replace with actual API calls
const mockInstructors: Instructor[] = [
  {
    id: '1',
    fullName: 'Pastor John Kamanzi',
    email: 'pastor.john@bms.rw',
    phone: '+250 788 123 456',
    qualifications: 'Bachelor of Theology',
    specialization: 'Discipleship',
    experienceYears: 5,
    candidateCount: 3,
  },
  {
    id: '2',
    fullName: 'Pastor Marie Uwimana',
    email: 'pastor.marie@bms.rw',
    phone: '+250 788 234 567',
    qualifications: 'Diploma in Theology',
    specialization: 'Youth Ministry',
    experienceYears: 3,
    candidateCount: 6,
  },
  {
    id: '3',
    fullName: 'Rev. Peter Habumuremyi',
    email: 'rev.peter@bms.rw',
    phone: '+250 788 345 678',
    qualifications: 'Master of Divinity',
    specialization: 'Pastoral Care',
    experienceYears: 10,
    candidateCount: 2,
  },
];

const mockMetrics: MetricsData = {
  activeCandidates: 11,
  lessonsCompleted: 48,
  averageReadiness: 72,
  baptismsThisYear: 8,
};

const mockUnassignedCandidates = [
  { id: 'c1', fullName: 'Emmanuel Nkusi', localChurch: 'Kigali Central', status: 'in_progress' },
  { id: 'c2', fullName: 'Ange Mukamana', localChurch: 'Remera', status: 'registered' },
];

export default function InstructorsPage() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const filteredInstructors = mockInstructors.filter((instructor) => {
    const matchesSearch =
      instructor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !specializationFilter || instructor.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  const specializationOptions = [
    { value: '', label: t.common.all },
    { value: 'Discipleship', label: 'Discipleship' },
    { value: 'Youth Ministry', label: 'Youth Ministry' },
    { value: 'Pastoral Care', label: 'Pastoral Care' },
  ];

  const handleAssign = (candidateId: string) => {
    // API call to assign candidate
    console.log('Assigning candidate:', candidateId, 'to instructor:', selectedInstructor?.id);
    setShowAssignmentModal(false);
    setSelectedInstructor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.instructor.directory}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.instructor.subtitle}
          </p>
        </div>
        <Button>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t.instructor.addTraining}
        </Button>
      </div>

      {/* Metrics Cards */}
      <InstructorMetrics metrics={mockMetrics} />

      {/* Filters */}
      <Card variant="outlined" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder={t.common.search + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={specializationOptions}
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Instructors Table */}
      <Card variant="outlined" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.common.name}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.auth.phone}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.instructor.qualifications}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.instructor.specialization}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.instructor.experience}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.instructor.assignedCandidates}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.common.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInstructors.length > 0 ? (
                filteredInstructors.map((instructor) => (
                  <InstructorRow
                    key={instructor.id}
                    id={instructor.id}
                    fullName={instructor.fullName}
                    email={instructor.email}
                    phone={instructor.phone}
                    qualifications={instructor.qualifications}
                    specialization={instructor.specialization}
                    experienceYears={instructor.experienceYears}
                    candidateCount={instructor.candidateCount}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    {t.instructor.noInstructorsFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Assignment Modal */}
      {showAssignmentModal && selectedInstructor && (
        <AssignmentModal
          instructorId={selectedInstructor.id}
          instructorName={selectedInstructor.fullName}
          unassignedCandidates={mockUnassignedCandidates}
          onAssign={handleAssign}
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedInstructor(null);
          }}
        />
      )}
    </div>
  );
}