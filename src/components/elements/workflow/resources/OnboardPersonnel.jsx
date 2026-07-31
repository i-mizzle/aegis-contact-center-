import TextField from '../../form/TextField'
import SelectField from '../../form/SelectField'
import NumberField from '../../form/NumberField'
import FormButton from '../../form/FormButton'

const OnboardPersonnel = ({
  closeFunction,
  createError,
  onboardPersonnel,
  personnel,
  updatePersonnelField,
  rankSelectOptions,
  positionSelectOptions,
  shiftSelectOptions,
  statusSelectOptions,
}) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Personnel information</h4>
      <p className="text-xs text-stone-500 dark:text-stone-400">Capture the officer's identity, assignment, and current duty status.</p>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <TextField
        requiredField
        inputLabel="Full name"
        inputPlaceholder="Officer full name"
        preloadValue={personnel.name}
        returnFieldValue={(value) => updatePersonnelField('name', value)}
      />
      <TextField
        requiredField
        inputLabel="Service number"
        inputPlaceholder="e.g. NPF-20481"
        preloadValue={personnel.serviceNumber}
        returnFieldValue={(value) => updatePersonnelField('serviceNumber', value)}
      />
      <TextField
        requiredField
        inputLabel="Email address"
        inputPlaceholder="officer@agency.org"
        preloadValue={personnel.email}
        returnFieldValue={(value) => updatePersonnelField('email', value)}
      />
      <TextField
        requiredField
        inputLabel="Phone number"
        inputPlaceholder="080xxxxxxxx"
        preloadValue={personnel.phone}
        returnFieldValue={(value) => updatePersonnelField('phone', value)}
      />
      <SelectField
        requiredField
        inputLabel="Rank"
        titleField="name"
        selectOptions={rankSelectOptions}
        preSelected={personnel.rank}
        preSelectedLabel="name"
        returnFieldValue={(value) => updatePersonnelField('rank', value?.name || '')}
      />
      <SelectField
        requiredField
        inputLabel="Position"
        titleField="name"
        selectOptions={positionSelectOptions}
        preSelected={personnel.position}
        preSelectedLabel="name"
        returnFieldValue={(value) => updatePersonnelField('position', value?.name || '')}
      />
      <SelectField
        requiredField
        inputLabel="Assigned shift"
        titleField="name"
        selectOptions={shiftSelectOptions}
        preSelected={personnel.shift}
        preSelectedLabel="name"
        returnFieldValue={(value) => updatePersonnelField('shift', value?.name || '')}
      />
      <SelectField
        requiredField
        inputLabel="Duty status"
        titleField="name"
        selectOptions={statusSelectOptions}
        preSelected={personnel.status}
        preSelectedLabel="name"
        returnFieldValue={(value) => updatePersonnelField('status', value?.name || '')}
      />
      <NumberField
        requiredField
        inputLabel="Years in service"
        inputPlaceholder="e.g. 5"
        preloadValue={personnel.yearsInService}
        returnFieldValue={(value) => updatePersonnelField('yearsInService', value)}
      />
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
      <div className="w-44">
        <FormButton buttonLabel="Onboard personnel" buttonAction={onboardPersonnel} />
      </div>
    </div>
  </div>
)

export default OnboardPersonnel
