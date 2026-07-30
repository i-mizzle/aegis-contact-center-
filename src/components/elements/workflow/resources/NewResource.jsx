import React from 'react'
import TextField from '../../form/TextField'
import SelectField from '../../form/SelectField'
import FormButton from '../../form/FormButton'

const NewResource = ({
  closeFunction,
  createError,
  createResource,
  newResource,
  updateNewResourceField,
  agencySelectOptions,
  resourceTypeSelectOptions,
  resourceStatusSelectOptions,
  adminRankSelectOptions,
  adminPositionSelectOptions,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Resource information</h4>
        <p className="text-xs text-stone-500 dark:text-stone-400">Capture resource identity, address, and status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          requiredField
          inputLabel="Resource name"
          inputPlaceholder="e.g. FRSC Outstation Ikeja North"
          preloadValue={newResource.name}
          returnFieldValue={(value) => updateNewResourceField('name', value)}
        />

        <SelectField
          inputLabel="Agency"
          requiredField
          titleField="name"
          selectOptions={agencySelectOptions}
          preSelected={newResource.agency}
          preSelectedLabel="name"
          returnFieldValue={(value) => updateNewResourceField('agency', value?.name || '')}
        />

        <SelectField
          inputLabel="Resource type"
          requiredField
          titleField="name"
          selectOptions={resourceTypeSelectOptions}
          preSelected={newResource.resourceType}
          preSelectedLabel="name"
          returnFieldValue={(value) => updateNewResourceField('resourceType', value?.name || '')}
        />

        <SelectField
          inputLabel="Status"
          requiredField
          titleField="name"
          selectOptions={resourceStatusSelectOptions}
          preSelected={newResource.status}
          preSelectedLabel="name"
          returnFieldValue={(value) => updateNewResourceField('status', value?.name || '')}
        />

        <div className="md:col-span-2">
          <TextField
            requiredField
            inputLabel="Address"
            inputPlaceholder="Street address or landmark"
            preloadValue={newResource.address}
            returnFieldValue={(value) => updateNewResourceField('address', value)}
          />
        </div>

        <TextField
          requiredField
          inputLabel="City"
          inputPlaceholder="e.g. Ikeja"
          preloadValue={newResource.city}
          returnFieldValue={(value) => updateNewResourceField('city', value)}
        />

        <TextField
          requiredField
          inputLabel="State"
          inputPlaceholder="e.g. Lagos"
          preloadValue={newResource.state}
          returnFieldValue={(value) => updateNewResourceField('state', value)}
        />
      </div>

      <div className="pt-2">
        <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Administrator information</h4>
        <p className="text-xs text-stone-500 dark:text-stone-400">Provide the designated administrator details for this resource.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          requiredField
          inputLabel="Full name"
          inputPlaceholder="Administrator full name"
          preloadValue={newResource.adminName}
          returnFieldValue={(value) => updateNewResourceField('adminName', value)}
        />

        <TextField
          requiredField
          inputLabel="Email"
          inputPlaceholder="admin@agency.org"
          preloadValue={newResource.adminEmail}
          returnFieldValue={(value) => updateNewResourceField('adminEmail', value)}
        />

        <TextField
          requiredField
          inputLabel="Phone number"
          inputPlaceholder="080xxxxxxxx"
          preloadValue={newResource.adminPhone}
          returnFieldValue={(value) => updateNewResourceField('adminPhone', value)}
        />

        <SelectField
          inputLabel="Rank"
          requiredField
          titleField="name"
          selectOptions={adminRankSelectOptions}
          preSelected={newResource.adminRank}
          preSelectedLabel="name"
          returnFieldValue={(value) => updateNewResourceField('adminRank', value?.name || '')}
        />

        <div className="md:col-span-2">
          <SelectField
            inputLabel="Position"
            requiredField
            titleField="name"
            selectOptions={adminPositionSelectOptions}
            preSelected={newResource.adminPosition}
            preSelectedLabel="name"
            returnFieldValue={(value) => updateNewResourceField('adminPosition', value?.name || '')}
          />
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
        <div className="w-44">
          <FormButton
            buttonLabel="Create resource"
            buttonAction={createResource}
          />
        </div>
      </div>
    </div>
  )
}

export default NewResource
