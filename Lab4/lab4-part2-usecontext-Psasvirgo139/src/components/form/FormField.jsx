import { useFormContext } from '../../context/FormContext';

export default function FormField({ name, label, type = 'text', placeholder }) {
  const { state, dispatch } = useFormContext();
  const value = state.values[name] || '';
  const error = state.errors[name] || '';
  const touched = state.touched[name] || false;

  const handleChange = (e) => {
    dispatch({
      type: 'CHANGE',
      payload: { field: name, value: e.target.value },
    });
  };

  const handleBlur = () => {
    dispatch({
      type: 'BLUR',
      payload: { field: name },
    });
  };

  // Determine border class
  let inputClass = 'form-control rounded-3 py-2 px-3 transition';
  if (touched) {
    if (error) {
      inputClass += ' is-invalid';
    } else {
      inputClass += ' is-valid';
    }
  }

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-semibold text-secondary small mb-1">
        {label}
      </label>
      <input
        type={type}
        id={name}
        className={inputClass}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched && error && (
        <div className="invalid-feedback small mt-1" data-testid={`${name}-error`}>
          {error}
        </div>
      )}
    </div>
  );
}
