'use client';

import { useState } from 'react';
import { Card, Button, Badge, SignaturePad, Alert } from '@/components/ui';
import { useI18n } from '@/i18n';
import { api } from '@/lib/api';

interface CandidateVerificationProps {
  candidateId: string;
  candidateName: string;
  status: string;
  lessonsCompleted: number;
  totalLessons: number;
  readinessScore: number;
}

export function CandidateVerification({
  candidateId,
  candidateName,
  status,
  lessonsCompleted,
  totalLessons,
  readinessScore
}: CandidateVerificationProps) {
  const { t } = useI18n();
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isReadyForBaptism = lessonsCompleted === totalLessons && readinessScore >= 80;
  
  const handleSaveSignature = (dataUrl: string) => {
    setSignatureData(dataUrl);
    setIsSigned(true);
    setShowSignaturePad(false);
    setSuccessMessage(t.baptism.signatureSaved);
  };

  const handleFinalizeSigning = async () => {
    if (!signatureData) return;
    
    setIsSubmitting(true);
    try {
      await api.documents.signCertificate(candidateId, signatureData);
      setSuccessMessage("Certificate signed and finalized successfully!");
    } catch (error) {
      console.error('Error signing certificate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title={t.baptism.verifyRequirements}>
      <div className="space-y-6">
        {/* Requirements Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.baptism.bibleStudyProgress}
              </span>
              <Badge variant={lessonsCompleted === totalLessons ? 'success' : 'warning'}>
                {lessonsCompleted}/{totalLessons}
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(lessonsCompleted / totalLessons) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 border rounded-lg dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.spiritual.readinessScore}
              </span>
              <Badge variant={readinessScore >= 80 ? 'success' : 'warning'}>
                {readinessScore}%
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className={`h-2.5 rounded-full ${readinessScore >= 80 ? 'bg-green-600' : 'bg-orange-500'}`}
                style={{ width: `${readinessScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        {isReadyForBaptism ? (
          <Alert variant="info" title={t.baptism.requirementsVerified}>
            {candidateName} has completed all required Bible studies and has a sufficient readiness score for baptism.
          </Alert>
        ) : (
          <Alert variant="warning" title={t.baptism.requirementsNotMet}>
            Candidate needs to complete all lessons and reach at least 80% readiness score before baptism.
          </Alert>
        )}

        {/* Signature Section */}
        {isReadyForBaptism && (
          <div className="pt-4 border-t dark:border-gray-700">
            {isSigned ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">Pastor Signature</h4>
                  <Button variant="ghost" size="sm" onClick={() => setIsSigned(false)}>
                    {t.common.edit}
                  </Button>
                </div>
                <div className="p-4 border rounded-lg bg-white flex justify-center">
                  <img src={signatureData!} alt="Signature" className="max-h-24" />
                </div>
                {successMessage && (
                  <p className="text-sm text-green-600 font-medium">{successMessage}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => setShowSignaturePad(true)}>
                    {t.baptism.drawSignature}
                  </Button>
                  <Button variant="outline">
                    {t.baptism.applySavedSignature}
                  </Button>
                </div>

                {showSignaturePad && (
                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <SignaturePad 
                      onSave={handleSaveSignature} 
                      onClear={() => setSignatureData(null)}
                      placeholder={t.baptism.signaturePlaceholder}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Final Action */}
        <div className="flex justify-end">
          <Button 
            disabled={!isReadyForBaptism || !isSigned || status === 'baptized' || isSubmitting}
            onClick={handleFinalizeSigning}
          >
            {isSubmitting ? t.common.loading : (status === 'baptized' ? t.baptism.baptized : t.baptism.signCertificate)}
          </Button>
        </div>
      </div>
    </Card>
  );
}
