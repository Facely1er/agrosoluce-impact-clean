import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download, ArrowRight, Info } from 'lucide-react';

interface DataMigrationStepProps {
  cooperativeId: string;
  onComplete: () => void;
}

type MigrationMethod = 'csv' | 'manual' | 'skip';

export default function DataMigrationStep({ cooperativeId: _cooperativeId, onComplete }: DataMigrationStepProps) {
  const [method, setMethod] = useState<MigrationMethod | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError('Format non supporté. Veuillez utiliser un fichier CSV ou Excel (.xlsx, .xls).');
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    // Simulate upload (real implementation would parse CSV and insert rows)
    await new Promise((r) => setTimeout(r, 1500));
    setUploading(false);
    setUploadDone(true);
    setTimeout(() => onComplete(), 1000);
  };

  const downloadTemplate = () => {
    const csv = [
      'prenom,nom,telephone,village,superficie_ha,culture_principale',
      'Kofi,Atta,+225 07 XX XX XX XX,Yamoussoukro,2.5,Cacao',
      'Amara,Coulibaly,+225 05 XX XX XX XX,Bouaké,1.8,Anacarde',
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agrosoluce_modele_producteurs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Étape optionnelle</p>
          <p>
            Si vous avez déjà une liste de producteurs sous Excel ou CSV, vous pouvez l'importer ici.
            Sinon, vous pourrez saisir les données directement depuis votre espace coopérative.
          </p>
        </div>
      </div>

      {/* Method selection */}
      {!method && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Comment souhaitez-vous importer vos données ?</h4>
          {[
            {
              id: 'csv' as MigrationMethod,
              icon: Upload,
              title: 'Importer un fichier CSV / Excel',
              description: 'Glissez votre liste de producteurs existante. Nous la convertissons automatiquement.',
              badge: 'Recommandé',
              badgeColor: 'bg-green-100 text-green-700',
            },
            {
              id: 'manual' as MigrationMethod,
              icon: FileText,
              title: 'Saisie manuelle',
              description: 'Ajoutez vos producteurs un par un depuis votre espace coopérative.',
              badge: null,
              badgeColor: '',
            },
            {
              id: 'skip' as MigrationMethod,
              icon: ArrowRight,
              title: 'Passer cette étape',
              description: 'Commencez avec une base vide. Vous pouvez importer vos données à tout moment.',
              badge: 'Optionnel',
              badgeColor: 'bg-gray-100 text-gray-600',
            },
          ].map(({ id, icon: Icon, title, description, badge, badgeColor }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setMethod(id);
                if (id === 'skip' || id === 'manual') onComplete();
              }}
              className="w-full flex items-start gap-4 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-primary-400 hover:shadow-md text-left transition-all group"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Icon className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{title}</span>
                  {badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor}`}>
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* CSV Upload UI */}
      {method === 'csv' && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Importer votre liste de producteurs</h4>

          {/* Template download */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Télécharger le modèle CSV</p>
              <p className="text-xs text-gray-500 mt-0.5">Format prêt à remplir avec vos données existantes</p>
            </div>
            <button
              type="button"
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </button>
          </div>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
            }`}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="h-10 w-10 text-green-500" />
                <p className="font-semibold text-green-700">{file.name}</p>
                <p className="text-xs text-green-600">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload className="h-10 w-10" />
                <p className="font-medium">Glissez votre fichier ici ou cliquez pour parcourir</p>
                <p className="text-xs">CSV, Excel (.xlsx, .xls) — Max 10 MB</p>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMethod(null)}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retour
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading || uploadDone}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {uploadDone ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Importé avec succès !
                </>
              ) : uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Import en cours...
                </>
              ) : (
                'Importer le fichier'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
