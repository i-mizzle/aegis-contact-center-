import { Switch } from '@headlessui/react'

const ToggleSwitch = ({ checked = false, onChange, label = 'Toggle option' }) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`${
        checked ? 'bg-green-200 dark:bg-green-700' : 'bg-gray-400 dark:bg-stone-700'
      } relative inline-flex items-center h-5 rounded-full w-10`}
    >
      <span className="sr-only">{label}</span>
      <span
        className={`transform transition ease-in-out duration-200 ${
          checked ? 'translate-x-6 bg-green-800 dark:bg-light-green' : 'translate-x-1 bg-gray-600 dark:bg-stone-400'
        } inline-block w-3 h-3 transform rounded-full`}
      />
    </Switch>
  )
}

export default ToggleSwitch
