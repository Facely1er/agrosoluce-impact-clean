import { useState, useEffect } from 'react';
import {
  Shield,
  MapPin,
  FileText,
  Award,
  Settings,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  RefreshCw,
  Users,
} from 'lucide-react';
import {
  getCooperativeEudrReadiness,
  saveCooperativeEudrReadiness,
  scoreEudrReadiness,
  type CooperativeEudrReadiness as ReadinessRecord,
  type CooperativeEudrReadinessForm,
  type GeoResponse,
  type TraceabilityResponse,
  type DdProcedureResponse,
  type StaffTrainedResponse,
  type ReadinessBand,
} from '../api/cooperativeEudrApi';

// =============================================
// TYPES & CONFIG
// =============================================

interface CooperativeEudrReadinessProps {
  cooperativeId: string;
  /** If provided the form is editable (cooperative manager view). Omit for read-only buyer view. */
  editable?: boolean;
}

const BAND_CONFIG: Record<ReadinessBand, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: typeof CheckCircle;
}> = {
  not_ready: {
    label: 'Not Ready',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: XCircle,
  },
  developing: {
    label: 'Developing',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertTriangle,
  },
  ready: {
    label: 'EUDR Ready',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
  },
};

const SECTION_META = [
  { key: 'geo', label: 'Plot Geo-data', icon: MapPin, weight: '25%' },
  { key: 'declarations', label: 'Farmer Declarations', icon: Users, weight: '25%' },
  { key: 'traceability', label: 'Traceability', icon: RefreshCw, weight: '15%' },
  { key: 'documentation', label: 'Documentation', icon: FileText, weight: '20%' },
  { key: 'certifications', label: 'Certifications', icon: Award, weight: '5%' },
  { key: 'processes', label: 'Internal Processes', icon: Settings, weight: '10%' },
];

const EMPTY_FORM: CooperativeEudrReadinessForm = {
  plots_geo_response: '',
  declarations_response: '',
  traceability_response: '',
  has_social_policy: false,
  has_land_evidence: false,
  has_recent_audit: false,
  has_eudr_certification: false,
  certification_names: [],
  has_dd_procedure: '',
  staff_trained: '',
};

// =============================================
// HELPERS
// =============================================

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(100, score)}%` }}
      />
    </div>
  );
}

function RadioGroup<T extends string>({
  name,
  value,
  options,
  onChange,
  disabled,
}: {
  name: string;
  value: T | '';
  options: { value: T; label: string; hint?: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
            value === opt.value
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => !disabled && onChange(opt.value)}
            className="mt-0.5 accent-primary-600"
            disabled={disabled}
          />
          <div>
            <span className="text-sm font-medium text-gray-800">{opt.label}</span>
            {opt.hint && <p className="text-xs text-gray-500 mt-0.5">{opt.hint}</p>}
          </div>
        </label>
      ))}
    </div>
  );
}

// =============================================
// RESULTS VIEW
// =============================================

function ReadinessResults({ record, onEdit }: { record: ReadinessRecord; onEdit?: () => void }) {
  const band = BAND_CONFIG[record.readiness_band];
  const BandIcon = band.icon;
  const [showGaps, setShowGaps] = useState(false);

  return (
    <div className="space-y-5">
      {/* Overall score card */}
      <div className={`rounded-xl border-2 ${band.border} ${band.bg} p-5`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BandIcon className={`h-6 w-6 ${band.color}`} />
            <span className={`text-lg font-bold ${band.color}`}>{band.label}</span>
          </div>
          <div className="text-right">
            <span className={`text-3xl font-bold ${band.color}`}>{record.overall_score}</span>
            <span className={`text-sm ${band.color}`}>/100</span>
          </div>
        </div>
        <ScoreBar
          score={record.overall_score}
          color={
            record.readiness_band === 'ready'
              ? 'bg-green-500'
              : record.readiness_band === 'developing'
              ? 'bg-yellow-400'
              : 'bg-red-400'
          }
        />
        <p className="text-xs text-gray-500 mt-2">
          Last assessed:{' '}
          {record.completed_at
            ? new Date(record.completed_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : '—'}
        </p>
      </div>

      {/* Section scores */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Score by Section</h4>
        <div className="space-y-3">
          {SECTION_META.map(({ key, label, icon: Icon, weight }) => {
            const score: number = (record.section_scores as Record<string, number>)[key] ?? 0;
            const color =
              score >= 75 ? 'bg-green-400' : score >= 40 ? 'bg-yellow-400' : 'bg-red-400';
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                    <span className="text-gray-400">({weight})</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{score}/100</span>
                </div>
                <ScoreBar score={score} color={color} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Gaps */}
      {record.gaps && record.gaps.length > 0 && (
        <div>
          <button
            onClick={() => setShowGaps(!showGaps)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors"
          >
            {showGaps ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {record.gaps.length} Gap{record.gaps.length !== 1 ? 's' : ''} Identified
          </button>
          {showGaps && (
            <div className="mt-2 space-y-2">
              {record.gaps.map((gap, i) => {
                const priorityStyles =
                  gap.priority === 'critical'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : gap.priority === 'high'
                    ? 'bg-orange-50 border-orange-200 text-orange-800'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-800';
                return (
                  <div
                    key={i}
                    className={`text-xs border rounded-lg px-3 py-2 ${priorityStyles}`}
                  >
                    <span className="font-semibold uppercase mr-2">{gap.priority}</span>
                    {gap.message}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Edit button */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-primary-300 text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Update Assessment
        </button>
      )}
    </div>
  );
}

// =============================================
// FORM VIEW
// =============================================

function ReadinessForm({
  cooperativeId,
  existing,
  onSaved,
  onCancel,
}: {
  cooperativeId: string;
  existing?: ReadinessRecord | null;
  onSaved: (record: ReadinessRecord) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<CooperativeEudrReadinessForm>(() => {
    if (!existing) return EMPTY_FORM;
    return {
      plots_geo_response: existing.plots_geo_response ?? '',
      declarations_response: existing.declarations_response ?? '',
      traceability_response: existing.traceability_response ?? '',
      has_social_policy: existing.has_social_policy,
      has_land_evidence: existing.has_land_evidence,
      has_recent_audit: existing.has_recent_audit,
      has_eudr_certification: existing.has_eudr_certification,
      certification_names: existing.certification_names ?? [],
      has_dd_procedure: existing.has_dd_procedure ?? '',
      staff_trained: existing.staff_trained ?? '',
    };
  });

  const [certInput, setCertInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);

  const preview = scoreEudrReadiness(form);

  const SECTIONS = [
    {
      key: 'geo',
      title: 'Plot Geo-data Coverage',
      icon: MapPin,
      description:
        'EUDR requires precise geo-coordinates for every plot where the commodity is grown. How many of your farmers have GPS-referenced plots recorded?',
      content: (
        <RadioGroup<GeoResponse>
          name="plots_geo_response"
          value={form.plots_geo_response}
          onChange={(v) => setForm((f) => ({ ...f, plots_geo_response: v }))}
          options={[
            { value: 'none', label: 'None — no GPS data collected yet' },
            { value: 'partial', label: 'Partial — less than half of farmers (~30%)' },
            { value: 'majority', label: 'Majority — more than half (~70%)' },
            { value: 'all', label: 'All / nearly all farmers have GPS plots (≥ 90%)' },
          ]}
        />
      ),
    },
    {
      key: 'declarations',
      title: 'Farmer Deforestation-Free Declarations',
      icon: Users,
      description:
        'Each farmer must sign a declaration confirming their plots have not caused deforestation after 31 Dec 2020. What is your current coverage?',
      content: (
        <RadioGroup<GeoResponse>
          name="declarations_response"
          value={form.declarations_response}
          onChange={(v) => setForm((f) => ({ ...f, declarations_response: v }))}
          options={[
            { value: 'none', label: 'None — no declarations collected yet' },
            { value: 'partial', label: 'Partial — less than half of farmers' },
            { value: 'majority', label: 'Majority — more than half of farmers' },
            { value: 'all', label: 'All / nearly all farmers have signed declarations' },
          ]}
        />
      ),
    },
    {
      key: 'traceability',
      title: 'Supply Chain Traceability',
      icon: RefreshCw,
      description:
        'EUDR requires you to be able to trace each lot back to the farm of origin. How do you currently track this?',
      content: (
        <RadioGroup<TraceabilityResponse>
          name="traceability_response"
          value={form.traceability_response}
          onChange={(v) => setForm((f) => ({ ...f, traceability_response: v }))}
          options={[
            { value: 'none', label: 'No traceability system in place' },
            { value: 'manual', label: 'Manual registers / paper records per farmer' },
            {
              value: 'digital_partial',
              label: 'Digital system — partially implemented',
              hint: 'e.g. spreadsheets or a basic app for some farmers',
            },
            {
              value: 'digital_full',
              label: 'Full digital traceability to plot level',
              hint: 'e.g. AgroSoluce, CocoaConnect, Farmforce, etc.',
            },
          ]}
        />
      ),
    },
    {
      key: 'documentation',
      title: 'Key Documents',
      icon: FileText,
      description:
        'These three document types are required to demonstrate supply-chain due diligence to EU buyers.',
      content: (
        <div className="space-y-3">
          {[
            {
              key: 'has_social_policy' as const,
              label: 'Social / Child Labor Policy',
              hint: 'A written policy covering labor rights, child protection, and grievance mechanisms.',
            },
            {
              key: 'has_land_evidence' as const,
              label: 'Land-use / Deforestation Evidence',
              hint:
                'Maps, satellite imagery, or land-use certificates showing plots are deforestation-free since Dec 2020.',
            },
            {
              key: 'has_recent_audit' as const,
              label: 'Recent Audit (internal or third-party)',
              hint: 'An audit report from the past 2 years covering your supply chain practices.',
            },
          ].map(({ key, label, hint }) => (
            <label
              key={key}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                form[key] ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                className="mt-0.5 accent-green-600"
              />
              <div>
                <span className="text-sm font-medium text-gray-800">{label}</span>
                <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
              </div>
            </label>
          ))}
        </div>
      ),
    },
    {
      key: 'certifications',
      title: 'EUDR-relevant Certifications',
      icon: Award,
      description:
        'Certifications like Rainforest Alliance, Fairtrade, or organic can provide supporting evidence for EUDR compliance.',
      content: (
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.has_eudr_certification}
              onChange={(e) =>
                setForm((f) => ({ ...f, has_eudr_certification: e.target.checked }))
              }
              className="accent-primary-600"
            />
            <span className="text-sm font-medium text-gray-800">
              We hold at least one active certification relevant to EUDR
            </span>
          </label>
          {form.has_eudr_certification && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Certification names (press Enter to add each)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && certInput.trim()) {
                      e.preventDefault();
                      setForm((f) => ({
                        ...f,
                        certification_names: [...f.certification_names, certInput.trim()],
                      }));
                      setCertInput('');
                    }
                  }}
                  placeholder="e.g. Rainforest Alliance 2023"
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
              {form.certification_names.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.certification_names.map((name, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            certification_names: f.certification_names.filter((_, j) => j !== i),
                          }))
                        }
                        className="hover:text-primary-600 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'processes',
      title: 'Internal Processes',
      icon: Settings,
      description:
        'Having documented procedures and trained staff ensures your EUDR compliance is sustainable over time.',
      content: (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Do you have a documented EUDR due diligence procedure?
            </p>
            <RadioGroup<DdProcedureResponse>
              name="has_dd_procedure"
              value={form.has_dd_procedure}
              onChange={(v) => setForm((f) => ({ ...f, has_dd_procedure: v }))}
              options={[
                { value: 'no', label: 'No procedure in place' },
                { value: 'in_progress', label: 'In progress — being drafted' },
                { value: 'yes', label: 'Yes — procedure is documented and in use' },
              ]}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Have relevant staff been trained on EUDR obligations?
            </p>
            <RadioGroup<StaffTrainedResponse>
              name="staff_trained"
              value={form.staff_trained}
              onChange={(v) => setForm((f) => ({ ...f, staff_trained: v }))}
              options={[
                { value: 'no', label: 'No training conducted' },
                { value: 'planned', label: 'Training planned but not yet completed' },
                { value: 'yes', label: 'Yes — key staff are trained' },
              ]}
            />
          </div>
        </div>
      ),
    },
  ];

  const totalSections = SECTIONS.length;
  const isLastSection = currentSection === totalSections - 1;

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const { data, error } = await saveCooperativeEudrReadiness(
      cooperativeId,
      form,
      existing?.id
    );
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    if (data) onSaved(data);
  };

  const section = SECTIONS[currentSection];
  const SectionIcon = section.icon;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>
            Section {currentSection + 1} of {totalSections}
          </span>
          <span>{Math.round(((currentSection + 1) / totalSections) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
          />
        </div>
      </div>

      {/* Live preview score */}
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
        <Shield className="h-4 w-4 text-gray-400 shrink-0" />
        <div className="flex-1">
          <ScoreBar
            score={preview.overall_score}
            color={
              preview.readiness_band === 'ready'
                ? 'bg-green-400'
                : preview.readiness_band === 'developing'
                ? 'bg-yellow-400'
                : 'bg-red-300'
            }
          />
        </div>
        <span className="text-sm font-semibold text-gray-700 w-14 text-right">
          {preview.overall_score}/100
        </span>
      </div>

      {/* Current section */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-50 rounded-lg shrink-0">
            <SectionIcon className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{section.title}</h4>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{section.description}</p>
          </div>
        </div>
        {section.content}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
          disabled={currentSection === 0}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>

        <div className="flex gap-1">
          {SECTIONS.map((s, i) => (
            <button
              key={i}
              type="button"
              title={`Go to section: ${s.title}`}
              aria-label={`Go to section: ${s.title}`}
              onClick={() => setCurrentSection(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentSection ? 'bg-primary-500' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>

        {isLastSection ? (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Save Assessment
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentSection((s) => s + 1)}
            className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {saveError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {saveError}
        </p>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

// =============================================
// MAIN COMPONENT
// =============================================

export default function CooperativeEudrReadiness({
  cooperativeId,
  editable = false,
}: CooperativeEudrReadinessProps) {
  const [record, setRecord] = useState<ReadinessRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    load();
  }, [cooperativeId]);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await getCooperativeEudrReadiness(cooperativeId);
    if (err) setError(err.message);
    else setRecord(data);
    setLoading(false);
  };

  const handleSaved = (saved: ReadinessRecord) => {
    setRecord(saved);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading EUDR readiness…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        Failed to load EUDR readiness data: {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">EUDR Supply-Side Readiness</h3>
        </div>
        {record && !isEditing && (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              BAND_CONFIG[record.readiness_band].bg
            } ${BAND_CONFIG[record.readiness_band].color}`}
          >
            {BAND_CONFIG[record.readiness_band].label}
          </span>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 mb-4">
        <p className="text-xs text-yellow-800">
          <strong>Disclaimer:</strong> This is a self-reported readiness assessment and does not constitute
          EUDR certification, regulatory approval, or a legal compliance determination.
        </p>
      </div>

      {isEditing || (!record && editable) ? (
        <ReadinessForm
          cooperativeId={cooperativeId}
          existing={record}
          onSaved={handleSaved}
          onCancel={record ? () => setIsEditing(false) : undefined}
        />
      ) : record ? (
        <ReadinessResults
          record={record}
          onEdit={editable ? () => setIsEditing(true) : undefined}
        />
      ) : (
        /* No assessment yet, read-only visitor */
        <div className="text-center py-6 text-gray-400">
          <Shield className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No EUDR readiness assessment completed yet.</p>
        </div>
      )}
    </div>
  );
}
