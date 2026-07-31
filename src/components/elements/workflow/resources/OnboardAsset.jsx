import TextField from '../../form/TextField'
import SelectField from '../../form/SelectField'
import DateField from '../../form/DateField'
import ToggleSwitch from '../../form/ToggleSwitch'
import FormButton from '../../form/FormButton'

const OnboardAsset = ({
  closeFunction,
  createError,
  onboardAsset,
  asset,
  updateAssetField,
  assetTypeSelectOptions,
  statusSelectOptions,
}) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Asset information</h4>
      <p className="text-xs text-stone-500 dark:text-stone-400">Register the asset identity, assignment, operational status, and supported media capabilities.</p>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <TextField
        requiredField
        inputLabel="Asset name"
        inputPlaceholder="e.g. Thermal Camera Unit"
        preloadValue={asset.name}
        returnFieldValue={(value) => updateAssetField('name', value)}
      />
      <TextField
        requiredField
        inputLabel="Serial number"
        inputPlaceholder="e.g. SN-001-16000"
        preloadValue={asset.serialNumber}
        returnFieldValue={(value) => updateAssetField('serialNumber', value)}
      />
      <SelectField
        requiredField
        inputLabel="Asset type"
        titleField="name"
        selectOptions={assetTypeSelectOptions}
        preSelected={asset.assetType}
        preSelectedLabel="name"
        returnFieldValue={(value) => updateAssetField('assetType', value?.name || '')}
      />
      <TextField
        requiredField
        inputLabel="Assigned unit"
        inputPlaceholder="e.g. Unit 03"
        preloadValue={asset.assignedUnit}
        returnFieldValue={(value) => updateAssetField('assignedUnit', value)}
      />
      <DateField
        requiredField
        inputLabel="Commissioned date"
        preloadValue={asset.commissionedDate}
        returnFieldValue={(value) => updateAssetField('commissionedDate', value)}
      />
      <SelectField
        requiredField
        inputLabel="Operational status"
        titleField="name"
        selectOptions={statusSelectOptions}
        preSelected={asset.status}
        preSelectedLabel="name"
        returnFieldValue={(value) => updateAssetField('status', value?.name || '')}
      />
    </div>

    <div className="rounded-lg border border-stone-200 p-4 dark:border-stone-800">
      <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Media capabilities</h4>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {[
          ['cameraEnabled', 'Camera enabled'],
          ['audioEnabled', 'Audio enabled'],
          ['stillPhotosEnabled', 'Still photos enabled'],
        ].map(([field, label]) => (
          <div key={field} className="flex items-center justify-between gap-3 rounded-lg bg-stone-50 px-3 py-2 dark:bg-stone-900/40">
            <span className="text-sm text-stone-700 dark:text-stone-200">{label}</span>
            <ToggleSwitch
              checked={asset[field]}
              onChange={(value) => updateAssetField(field, value)}
              label={label}
            />
          </div>
        ))}
      </div>
    </div>

    {createError && (
      <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-800/40 dark:bg-rose-900/20 dark:text-rose-300">
        {createError}
      </p>
    )}

    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={closeFunction}
        className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
      >
        Cancel
      </button>
      <div className="w-40">
        <FormButton buttonLabel="Onboard asset" buttonAction={onboardAsset} />
      </div>
    </div>
  </div>
)

export default OnboardAsset
