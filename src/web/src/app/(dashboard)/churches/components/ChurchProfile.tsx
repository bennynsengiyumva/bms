'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Card, Button, Input, Select } from '@/components/ui';

interface ChurchProfileProps {
  church?: any;
  onSave?: (data: any) => void;
}

export function ChurchProfile({ church, onSave }: ChurchProfileProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: church?.name || '',
    type: church?.type || 'local',
    district: church?.district || '',
    pastor: church?.pastor || '',
    address: church?.address || '',
    phone: church?.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
        {church ? t.churches.editProfile : t.churches.createProfile || 'Church Profile'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t.churches.churchName || 'Church Name'}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Select
            label={t.churches.type || 'Type'}
            options={[
              { value: 'union', label: 'Union' },
              { value: 'field', label: 'Field' },
              { value: 'district', label: 'District' },
              { value: 'local', label: 'Local Church' },
            ]}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <Input
            label={t.churches.pastorName || 'Assigned Pastor'}
            value={formData.pastor}
            onChange={(e) => setFormData({ ...formData, pastor: e.target.value })}
          />
          <Input
            label={t.churches.phone || 'Phone Number'}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="md:col-span-2">
            <Input
              label={t.churches.address || 'Address'}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="submit" variant="primary">
            {t.common.save}
          </Button>
        </div>
      </form>
    </Card>
  );
}
