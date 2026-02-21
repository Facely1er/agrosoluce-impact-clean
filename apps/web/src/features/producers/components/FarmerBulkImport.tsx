import { useState, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import {
  X,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  FileSpreadsheet,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { bulkCreateFarmers } from '../api/farmersApi';
import type { Farmer } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface RawRow {
  name?: string;
  registration_number?: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: string | number;
  longitude?: string | number;
  location_description?: string;
  date_of_birth?: string;
  gender?: string;
  [key: string]: unknown;
}

interface ParsedRow {
  rowIndex: number;
  raw: RawRow;
  data: Omit<Farmer, 'id' | 'created_at' | 'updated_at'> | null;
  errors: string[];
  warnings: string[];
  status: 'valid' | 'warning' | 'error';
}

interface ImportResult {
  inserted: number;
  skipped: number;
  errors: string[];
}

interface FarmerBulkImportProps {
  cooperativeId: string;
  onSuccess: (inserted: number) => void;
  onCancel: () => void;
}

// ─── Column mapping (accepts French and English header names) ────────────────

const COLUMN_MAP: Record<string, keyof RawRow> = {
  // French
  nom: 'name',
  'nom complet': 'name',
  'numéro d\'enregistrement': 'registration_number',
  "numéro d'enregistrement": 'registration_number',
  "numero d'enregistrement": 'registration_number',
  'numéro enregistrement': 'registration_number',
  téléphone: 'phone',
  telephone: 'phone',
  courriel: 'email',
  adresse: 'address',
  latitude: 'latitude',
  longitude: 'longitude',
  'description emplacement': 'location_description',
  'description de l\'emplacement': 'location_description',
  "description de l'emplacement": 'location_description',
  'date de naissance': 'date_of_birth',
  genre: 'gender',
  sexe: 'gender',
  // English
  name: 'name',
  'full name': 'name',
  registration_number: 'registration_number',
  'registration number': 'registration_number',
  phone: 'phone',
  mobile: 'phone',
  email: 'email',
  'e-mail': 'email',
  address: 'address',
  lat: 'latitude',
  lng: 'longitude',
  lon: 'longitude',
  location_description: 'location_description',
  'location description': 'location_description',
  date_of_birth: 'date_of_birth',
  dob: 'date_of_birth',
  gender: 'gender',
  sex: 'gender',
};

// ─── Validation helpers ──────────────────────────────────────────────────────

function normalizeHeader(h: string): keyof RawRow | null {
  const key = h.trim().toLowerCase();
  return COLUMN_MAP[key] ?? null;
}

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function parseDate(v: string): string | null {
  if (!v) return null;
  // Accept YYYY-MM-DD or DD/MM/YYYY or DD-MM-YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const dmY = v.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmY) return `${dmY[3]}-${dmY[2].padStart(2, '0')}-${dmY[1].padStart(2, '0')}`;
  return null;
}

function validateAndTransformRow(
  raw: RawRow,
  rowIndex: number,
  cooperativeId: string,
): ParsedRow {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required: name
  const name = String(raw.name ?? '').trim();
  if (!name) errors.push('Le nom est obligatoire.');

  // Email
  const email = String(raw.email ?? '').trim() || undefined;
  if (email && !validateEmail(email)) errors.push('Format email invalide.');

  // Latitude / Longitude
  const latRaw = raw.latitude !== undefined && raw.latitude !== '' ? Number(raw.latitude) : undefined;
  const lngRaw = raw.longitude !== undefined && raw.longitude !== '' ? Number(raw.longitude) : undefined;
  if (latRaw !== undefined && (isNaN(latRaw) || latRaw < -90 || latRaw > 90))
    errors.push('Latitude invalide (doit être entre -90 et 90).');
  if (lngRaw !== undefined && (isNaN(lngRaw) || lngRaw < -180 || lngRaw > 180))
    errors.push('Longitude invalide (doit être entre -180 et 180).');
  if ((latRaw !== undefined) !== (lngRaw !== undefined))
    warnings.push('La latitude et la longitude doivent être renseignées ensemble.');

  // Date of birth
  const dobRaw = String(raw.date_of_birth ?? '').trim();
  const dob = dobRaw ? parseDate(dobRaw) : undefined;
  if (dobRaw && !dob) errors.push('Format de date invalide (utilisez YYYY-MM-DD ou DD/MM/YYYY).');

  // Gender
  const genderRaw = String(raw.gender ?? '').trim().toLowerCase();
  const genderMap: Record<string, string> = { m: 'M', male: 'M', homme: 'M', f: 'F', female: 'F', femme: 'F', other: 'autre', autre: 'autre' };
  const gender = genderRaw ? (genderMap[genderRaw] ?? genderRaw) : undefined;
  if (gender && !['M', 'F', 'autre'].includes(gender))
    warnings.push(`Genre non reconnu: "${raw.gender}". Valeurs acceptées: M, F, autre.`);

  const status: ParsedRow['status'] =
    errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'valid';

  const data: Omit<Farmer, 'id' | 'created_at' | 'updated_at'> | null =
    errors.length === 0
      ? {
          cooperative_id: cooperativeId,
          name,
          registration_number: String(raw.registration_number ?? '').trim() || undefined,
          phone: String(raw.phone ?? '').trim() || undefined,
          email,
          address: String(raw.address ?? '').trim() || undefined,
          latitude: latRaw,
          longitude: lngRaw,
          location_description: String(raw.location_description ?? '').trim() || undefined,
          date_of_birth: dob ?? undefined,
          gender,
          is_active: true,
        }
      : null;

  return { rowIndex, raw, data, errors, warnings, status };
}

// ─── Template download ───────────────────────────────────────────────────────

function downloadTemplate() {
  const headers = [
    'name',
    'registration_number',
    'phone',
    'email',
    'address',
    'latitude',
    'longitude',
    'location_description',
    'date_of_birth',
    'gender',
  ];
  const example = [
    'Jean Kouamé',
    'REG-001',
    '+225 07 00 00 00',
    'jean@example.com',
    'Village Tiébissou, Côte d\'Ivoire',
    '7.1391',
    '-5.5881',
    'Parcelle nord, près de la rivière',
    '1985-06-15',
    'M',
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  ws['!cols'] = headers.map(() => ({ wch: 22 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Producteurs');
  XLSX.writeFile(wb, 'modele_import_producteurs.xlsx');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FarmerBulkImport({ cooperativeId, onSuccess, onCancel }: FarmerBulkImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const validRows = rows.filter((r) => r.status !== 'error');
  const errorRows = rows.filter((r) => r.status === 'error');

  const parseFile = useCallback(
    (file: File) => {
      setParseError(null);
      setRows([]);
      setImportResult(null);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const wb = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const raw: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' });

          if (raw.length < 2) {
            setParseError('Le fichier est vide ou ne contient pas de données.');
            return;
          }

          const headerRow = raw[0] as string[];
          const fieldMap: (keyof RawRow | null)[] = headerRow.map(normalizeHeader);

          const unmapped = headerRow.filter((h, i) => h && !fieldMap[i]);
          const dataRows = raw.slice(1).filter((r) => r.some((c) => String(c).trim() !== ''));

          if (!fieldMap.includes('name')) {
            setParseError(
              'Colonne "name" (ou "nom") introuvable. Vérifiez les en-têtes de votre fichier ou utilisez le modèle fourni.',
            );
            return;
          }

          const parsed: ParsedRow[] = dataRows.map((row, idx) => {
            const rawRow: RawRow = {};
            fieldMap.forEach((field, colIdx) => {
              if (field) rawRow[field] = (row as unknown[])[colIdx] as string | number;
            });
            return validateAndTransformRow(rawRow, idx + 2, cooperativeId);
          });

          setRows(parsed);
          if (unmapped.length > 0) {
            setParseError(
              `Colonnes ignorées (non reconnues) : ${unmapped.map((h) => `"${h}"`).join(', ')}`,
            );
          }
        } catch (err) {
          setParseError('Erreur de lecture du fichier. Assurez-vous que le fichier est valide.');
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [cooperativeId],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  };

  const handleImport = async () => {
    const toInsert = rows.filter((r) => r.status !== 'error' && r.data).map((r) => r.data!);
    if (toInsert.length === 0) return;

    setImporting(true);
    const { inserted, error } = await bulkCreateFarmers(toInsert);
    setImporting(false);

    if (error) {
      setImportResult({ inserted: 0, skipped: errorRows.length, errors: [error.message] });
      return;
    }

    setImportResult({
      inserted,
      skipped: errorRows.length,
      errors: [],
    });

    if (inserted > 0) {
      setTimeout(() => onSuccess(inserted), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileSpreadsheet className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Import en masse</h2>
              <p className="text-xs text-gray-500">Formats acceptés : .xlsx, .xls, .csv</p>
            </div>
          </div>
          <button onClick={onCancel} aria-label="Fermer" className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Template download */}
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-medium text-blue-900">Première importation ?</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Téléchargez le modèle Excel pour voir les colonnes attendues avec un exemple.
              </p>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 ml-4"
            >
              <Download className="h-4 w-4" />
              Modèle .xlsx
            </button>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-primary-400 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Sélectionner un fichier Excel ou CSV"
              title="Sélectionner un fichier Excel ou CSV"
            />
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            {fileName ? (
              <p className="text-sm font-medium text-primary-700">{fileName}</p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-700">
                  Glissez-déposez votre fichier ici
                </p>
                <p className="text-xs text-gray-500 mt-1">ou cliquez pour sélectionner</p>
              </>
            )}
          </div>

          {/* Parse warning (non-blocking) */}
          {parseError && (
            <div className={`flex gap-2 items-start rounded-lg px-4 py-3 text-sm ${
              parseError.startsWith('Colonnes ignorées')
                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Summary bar */}
          {rows.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{rows.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Lignes lues</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{validRows.length}</p>
                <p className="text-xs text-green-600 mt-0.5">Valides</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-red-700">{errorRows.length}</p>
                <p className="text-xs text-red-500 mt-0.5">Avec erreurs</p>
              </div>
            </div>
          )}

          {/* Import result */}
          {importResult && (
            <div className={`flex items-start gap-3 rounded-xl p-4 ${
              importResult.errors.length
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'
            }`}>
              {importResult.errors.length ? (
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                {importResult.errors.length ? (
                  <>
                    <p className="font-medium text-red-800">Erreur lors de l'import</p>
                    {importResult.errors.map((e, i) => (
                      <p key={i} className="text-sm text-red-700">{e}</p>
                    ))}
                  </>
                ) : (
                  <>
                    <p className="font-medium text-green-800">
                      {importResult.inserted} producteur{importResult.inserted > 1 ? 's' : ''} importé{importResult.inserted > 1 ? 's' : ''} avec succès
                    </p>
                    {importResult.skipped > 0 && (
                      <p className="text-sm text-green-700">
                        {importResult.skipped} ligne{importResult.skipped > 1 ? 's' : ''} ignorée{importResult.skipped > 1 ? 's' : ''} (erreurs de validation)
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Preview table */}
          {rows.length > 0 && !importResult && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Aperçu des données
                <span className="font-normal text-gray-500 ml-2">
                  (les lignes avec erreurs seront ignorées)
                </span>
              </h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-600 w-8">#</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Statut</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Nom</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Téléphone</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Email</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">N° Enreg.</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rows.map((row) => (
                        <>
                          <tr
                            key={row.rowIndex}
                            className={`transition-colors ${
                              row.status === 'error'
                                ? 'bg-red-50'
                                : row.status === 'warning'
                                ? 'bg-amber-50'
                                : 'bg-white hover:bg-gray-50'
                            }`}
                          >
                            <td className="px-3 py-2 text-gray-400">{row.rowIndex}</td>
                            <td className="px-3 py-2">
                              {row.status === 'error' && (
                                <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                                  <AlertCircle className="h-3 w-3" /> Erreur
                                </span>
                              )}
                              {row.status === 'warning' && (
                                <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                                  <AlertTriangle className="h-3 w-3" /> Attention
                                </span>
                              )}
                              {row.status === 'valid' && (
                                <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                                  <CheckCircle className="h-3 w-3" /> OK
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-900 max-w-[140px] truncate">
                              {String(row.raw.name ?? '—')}
                            </td>
                            <td className="px-3 py-2 text-gray-600">{String(row.raw.phone ?? '—')}</td>
                            <td className="px-3 py-2 text-gray-600 max-w-[140px] truncate">
                              {String(row.raw.email ?? '—')}
                            </td>
                            <td className="px-3 py-2 text-gray-600">
                              {String(row.raw.registration_number ?? '—')}
                            </td>
                            <td className="px-3 py-2">
                              {(row.errors.length > 0 || row.warnings.length > 0) && (
                                <button
                                  onClick={() => setExpandedRow(expandedRow === row.rowIndex ? null : row.rowIndex)}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  {expandedRow === row.rowIndex ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                          {expandedRow === row.rowIndex && (
                            <tr key={`${row.rowIndex}-detail`} className={row.status === 'error' ? 'bg-red-50' : 'bg-amber-50'}>
                              <td colSpan={7} className="px-4 py-2">
                                {row.errors.map((e, i) => (
                                  <p key={i} className="text-xs text-red-700 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {e}
                                  </p>
                                ))}
                                {row.warnings.map((w, i) => (
                                  <p key={i} className="text-xs text-amber-700 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" /> {w}
                                  </p>
                                ))}
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            {rows.length > 0 && !importResult
              ? `${validRows.length} ligne${validRows.length > 1 ? 's' : ''} sera${validRows.length > 1 ? 'ont' : ''} importée${validRows.length > 1 ? 's' : ''}`
              : 'Sélectionnez un fichier pour commencer'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            {!importResult && (
              <button
                onClick={handleImport}
                disabled={validRows.length === 0 || importing}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Import en cours…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Importer {validRows.length > 0 ? `(${validRows.length})` : ''}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
